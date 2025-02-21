import asyncio
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
        )
        self.config = pipeline_config
        self.config_name = config_name
        self.stop_event = asyncio.Event()

        self.machine = AsyncMachine(
            model=self,
            states=pipeline_config["states"],
            transitions=pipeline_config["transitions"],
            initial=pipeline_config["initial"],
            queued=True,
            auto_transitions=False,  # Disable auto transitions to prevent unexpected behavior
            ignore_invalid_triggers=True  # Ignore invalid triggers for safety
        )

    async def run_current_stage(self):
        """
        Invoked after a transition leads us to a new stage, or after we move to an error stage.
        """
        if self.stop_event.is_set():
            logger.info(f"[{self.config_name}:{self.context.pipeline_id}] 流水线已取消")
            return

        try:
            # TODO: this need to be configurable by the user
            await asyncio.sleep(0.05)
            # If we've just become idle, we shouldn't proceed.
            if self.state == "idle":
                logger.info(f"[{self.config_name}:{self.context.pipeline_id}] 流水线已空闲")
                return

            stage_instance = self.stage_manager.get_stage(self.state)
            logger.info(f"[{self.config_name}:{self.context.pipeline_id}] 运行 {self.state} ...")

            result = await stage_instance.process(self.context)

            if result.success:
                # Stage completed successfully
                self.context.data[stage_instance.get_name()] = result.data

                if result.metadata.send_to_frontend:
                    # Send result to frontend
                    await self.sio.emit(
                        "pipeline_result",
                        PipelineResponse(
                            type="result",
                            stage=stage_instance.get_name(),
                            data=result.data,
                            pipeline_id=self.context.pipeline_id,
                            pipeline_type=self.config_name
                        ).model_dump(),
                        to=self.sid
                    )

                logger.info(
                    f"[{self.config_name}:{self.context.pipeline_id}] 完成阶段 {stage_instance.get_name()}."
                )

                # Only trigger next stage if we haven't stopped or errored in the meantime
                if self.state != "idle":
                    await self.next_stage_trigger()

            else:
                self.context.data[stage_instance.get_name()] = None
                # Stage returned an error
                await self.sio.emit(
                    "pipeline_error",
                    PipelineResponse(
                        type="error",
                        stage=stage_instance.get_name(),
                        error=result.error,
                        pipeline_id=self.context.pipeline_id,
                        pipeline_type=self.config_name
                    ).model_dump(),
                    to=self.sid
                )
                logger.error(
                    f"[{self.config_name}:{self.context.pipeline_id}] 阶段 {self.state} 出错: {result.error}"
                )

                # Avoid repeatedly triggering the error if we're already in an error state
                if "error_state" not in self.state:
                    await self.on_error_trigger()

        except Exception:
            logger.exception(
                f"[{self.config_name}:{self.context.pipeline_id}] 阶段 {self.state} 时发生异常"
            )
            # Avoid repeatedly triggering the error if we're already in an error state
            if "error_state" not in self.state:
                await self.on_error_trigger()

    async def handle_run_pipeline(self):
        """
        Called externally to start the pipeline from an idle state.
        """
        await self.sio.emit(
            "pipeline_started",
            {"pipeline_id": self.context.pipeline_id, "pipeline_type": self.config_name},
            to=self.sid
        )
        await self.start_pipeline_trigger()

    async def handle_stop_pipeline(self):
        """
        Called externally (e.g., from a socket event) to stop the pipeline.
        """
        # set stop event
        self.stop_event.set()

        # If already idle, do nothing:
        if self.state == "idle":
            logger.info(f"[{self.config_name}:{self.context.pipeline_id}] 尝试停止流水线,但流水线已处于空闲状态")
            return

        await self.sio.emit(
            "pipeline_stopped",
            {"pipeline_id": self.context.pipeline_id, "pipeline_type": self.config_name},
            to=self.sid
        )

        # Attempt to stop the pipeline (valid from any state except idle).
        logger.info(f"[{self.config_name}:{self.context.pipeline_id}] 尝试停止流水线")
        await self.stop_pipeline_trigger()
