from typing import Dict, Any
from uuid import uuid4

from loguru import logger
from socketio import AsyncServer
from transitions.extensions.asyncio import AsyncMachine

from app.core.data_models.pipeline_context import PipelineContext
from app.core.managers.stage_manager import StageManager
from app.core.network_models.responses.pipeline_response import PipelineResponse
from app.life_span import get_state_machine_config


class PipelineStateMachine:
    def __init__(self, config_name: str, meta_data: Dict[str, Any], sio: AsyncServer, sid: str):
        state_machine_config = get_state_machine_config()
        pipeline_config = state_machine_config["pipelines"][config_name]

        self.sid = sid
        self.sio = sio

        self.stage_manager = StageManager()
        self.context = PipelineContext(
            pipeline_id=str(uuid4()),
            meta_data=meta_data or {},
            data={}
        )
        self.config = pipeline_config
        self.config_name = config_name

        self.machine = AsyncMachine(
            model=self,
            states=pipeline_config["states"],
            transitions=pipeline_config["transitions"],
            initial=pipeline_config["initial"],
            auto_transitions=False,  # Disable auto transitions to prevent unexpected behavior
            ignore_invalid_triggers=True  # Ignore invalid triggers
        )

    async def run_current_stage(self):

        try:
            if self.state != "idle":
                stage_instance = self.stage_manager.get_stage(self.state)
                logger.info(f"[{self.config_name}:{self.context.pipeline_id}] Running {self.state} ...")
                result = await stage_instance.process(self.context)

                if result.success:
                    self.context.data[stage_instance.get_stage_name()] = result.data

                    if result.metadata.send_to_frontend:
                        # Send result to frontend
                        await self.sio.emit(
                            "pipeline_result",
                            PipelineResponse(
                                type="result",
                                stage=stage_instance.get_stage_name(),
                                data=result.data,
                                pipeline_id=self.context.pipeline_id,
                                pipeline_type=self.config_name
                            ).model_dump(),
                            to=self.sid
                        )

                    logger.info(
                        f"[{self.config_name}:{self.context.pipeline_id}] Completed stage {stage_instance.get_stage_name()}."
                    )

                    if self.state != "idle":
                        await self.next_stage_trigger()

                else:
                    # Send error message to frontend
                    await self.sio.emit(
                        "pipeline_error",
                        PipelineResponse(
                            type="error",
                            stage=stage_instance.get_stage_name(),
                            error=result.error,
                            pipeline_id=self.context.pipeline_id,
                            pipeline_type=self.config_name
                        ).model_dump(),
                        to=self.sid
                    )
                    logger.error(
                        f"[{self.config_name}:{self.context.pipeline_id}] Error while running {self.state} stage."
                    )

                    await self.on_error_trigger()
            else:
                logger.info(f"[{self.config_name}:{self.context.pipeline_id}] Pipeline has been cancelled.")
        except Exception:
            logger.exception(
                f"[{self.config_name}:{self.context.pipeline_id}] Error while running {self.state} stage."
            )
            await self.on_error_trigger()

    async def handle_run_pipeline(self):
        await self.sio.emit(
            "pipeline_started",
            {"pipeline_id": self.context.pipeline_id, "pipeline_type": self.config_name},
            to=self.sid
        )
        await self.start_pipeline_trigger()

    async def handle_stop_pipeline(self):
        if self.state == "idle":
            return
        
        await self.sio.emit(
            "pipeline_stopped",
            {"pipeline_id": self.context.pipeline_id, "pipeline_type": self.config_name},
            to=self.sid
        )
        await self.stop_pipeline_trigger()
