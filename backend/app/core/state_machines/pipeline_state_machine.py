import asyncio
import json
import os.path
from uuid import uuid4

from loguru import logger
from transitions.extensions.asyncio import AsyncMachine

from app.constant import ROOT_PATH
from app.core.data_models.pipeline_context import PipelineContext
from app.core.managers.stage_manager import StageManager
from app.core.network_models.responses.pipeline_response import PipelineResponse


class PipelineStateMachine:
    def __init__(self, config_name: str):
        with open(os.path.join(ROOT_PATH, "assets", "configs", "state_machine_config.json"), 'r',
                  encoding='utf-8') as f:
            state_machine_config = json.load(f)
        pipeline_config = state_machine_config["pipelines"][config_name]

        self.stage_manager = StageManager()
        self.context = PipelineContext(
            pipeline_id=str(uuid4()),
            meta_data={},
            data={}
        )
        self.config = pipeline_config
        self.running_states = pipeline_config["running_states"]
        self.config_name = config_name

        states = pipeline_config["states"]
        transitions = pipeline_config["transitions"]
        initial = pipeline_config["initial"]

        self.machine = AsyncMachine(
            model=self,
            states=states,
            transitions=transitions,
            initial=initial
        )

    async def run_current_stage(self):
        current_stage_name = self.state

        try:
            if current_stage_name in self.running_states:
                stage_instance = self.stage_manager.get_stage(current_stage_name)
                logger.info(f"[{self.config_name}:{self.context.pipeline_id}] Running {current_stage_name} ...")
                result = await stage_instance.process(self.context)

                if result.success:
                    self.context.data[stage_instance.get_stage_name()] = result.data

                    if result.metadata.send_to_frontend:
                        # TODO: send result to frontend
                        PipelineResponse(
                            type="result",
                            stage=stage_instance.get_stage_name(),
                            data=result.data,
                            pipeline_id=self.context.pipeline_id,
                            pipeline_type=self.config_name
                        ).model_dump_json()

                    logger.info(
                        f"[{self.config_name}:{self.context.pipeline_id}] Completed stage {stage_instance.get_stage_name()}.")

                    await self.next_stage()
                else:
                    # TODO: send error message to frontend
                    PipelineResponse(
                        type="error",
                        stage=stage_instance.get_stage_name(),
                        error=result.error,
                        pipeline_id=self.context.pipeline_id,
                        pipeline_type=self.config_name
                    ).model_dump_json()
                    logger.error(
                        f"[{self.config_name}:{self.context.pipeline_id}]  Error while running {current_stage_name} stage.")

                    if result.metadata.stop_when_failed:
                        logger.info(
                            f"[{self.config_name}:{self.context.pipeline_id}] Stopping pipeline due to stage failure.")
                        await self.stop_pipeline()

                    await self.on_error()
            elif current_stage_name == "cancel" or current_stage_name == "idle":
                logger.info(f"[{self.config_name}:{self.context.pipeline_id}] Pipeline has been cancelled.")
            else:
                logger.error(f"[{self.config_name}:{self.context.pipeline_id}] Unknown stage: {current_stage_name}")
        except Exception:
            logger.exception(
                f"[{self.config_name}:{self.context.pipeline_id}] Error while running {current_stage_name} stage.")
            await self.on_error()

    async def run_pipeline(self):
        logger.info(f"[{self.config_name}:{self.context.pipeline_id}] Starting pipeline...")
        await self.start_pipeline()

    async def stop_pipeline(self):
        logger.info(f"[{self.config_name}:{self.context.pipeline_id}] Stopping pipeline...")
        await self.stop_pipeline()


async def main():
    pipeline_state_machine = PipelineStateMachine("SingleRelicAnalysisPipeline")
    await pipeline_state_machine.run_pipeline()


if __name__ == '__main__':
    asyncio.run(main())
