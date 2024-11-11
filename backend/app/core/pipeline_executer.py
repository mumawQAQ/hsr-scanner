import asyncio
from typing import Dict, Any, Type, Optional, List
from uuid import uuid4

from app.core.data_models.pipeline_context import PipelineContext
from app.core.managers.websocket_manager import WebsocketManager
from app.core.network_models.responses.pipeline_response import PipelineResponse
from app.core.pipeline_factory import PipelineFactory, PIPELINE_TYPE
from app.logging_config import logger


class PipelineExecutor:
    """Handles the execution of pipeline stages"""

    def __init__(self, websocket_manager: WebsocketManager):
        self.websocket_manager = websocket_manager
        self.pipeline_factory = PipelineFactory(websocket_manager)
        self.active_pipelines: Dict[str, Dict[str, Any]] = {}

    async def execute_pipeline(
            self,
            pipeline_type: Type[PIPELINE_TYPE],
            context: PipelineContext,
            stop_event: asyncio.Event
    ) -> None:
        """Execute a pipeline repeatedly until stop_event is set"""

        stages = self.pipeline_factory.create_pipeline_stages(pipeline_type)

        try:
            while not stop_event.is_set():
                for stage in stages:
                    if stop_event.is_set():
                        logger.info(f"Stop event set. Exiting pipeline {context.pipeline_id}.")
                        break

                    result = await stage.process(context)

                    # Handle stage result
                    if not result.success:
                        await self.websocket_manager.send_message(
                            PipelineResponse(
                                type="error",
                                stage=stage.get_stage_name(),
                                error=result.error,
                                pipeline_id=context.pipeline_id,
                                pipeline_type=context.pipeline_type
                            ).model_dump_json())
                        logger.error(
                            f"Pipeline {context.pipeline_id} failed at stage {stage.get_stage_name()}. Error: {result.error}")

                        if result.metadata.stop_when_failed:
                            logger.info(f"Stopping pipeline {context.pipeline_id} due to stage failure.")
                            stop_event.set()
                            break

                    # Update context with stage results
                    context.data[stage.get_stage_name()] = result.data

                    if result.metadata.send_to_frontend:
                        # Broadcast stage result
                        await self.websocket_manager.send_message(
                            PipelineResponse(
                                type="result",
                                stage=stage.get_stage_name(),
                                data=result.data,
                                pipeline_id=context.pipeline_id,
                                pipeline_type=context.pipeline_type
                            ).model_dump_json())

                    logger.info(f"Pipeline {context.pipeline_id} completed stage {stage.get_stage_name()}.")

                # TODO: adjust sleep time
                await asyncio.sleep(0.25)  # Adjust as needed

        except asyncio.CancelledError:
            # Handle pipeline cancellation
            await self.websocket_manager.send_message(
                PipelineResponse(
                    type="stopped",
                    data="Pipeline execution has been stopped by the client.",
                    pipeline_id=context.pipeline_id,
                    pipeline_type=context.pipeline_type
                ).model_dump_json())
            logger.info(f"Pipeline {context.pipeline_id} has been cancelled.")
            raise

        except Exception as e:
            # Handle unexpected exceptions
            await self.websocket_manager.send_message(
                PipelineResponse(
                    type="error",
                    error=f"Unexpected error: {str(e)}",
                    pipeline_id=context.pipeline_id,
                    pipeline_type=context.pipeline_type
                ).model_dump_json())
            logger.error(f"Unexpected error in pipeline {context.pipeline_id}: {e}")

    def start_pipeline(
            self,
            pipeline_type: Type[PIPELINE_TYPE],
            initial_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """Start a pipeline and return its ID"""
        pipeline_id = str(uuid4())

        context = PipelineContext(
            pipeline_id=pipeline_id,
            pipeline_type=pipeline_type.get_pipeline_name(),
            data=initial_data or {}
        )

        stop_event = asyncio.Event()

        task = asyncio.create_task(self.execute_pipeline(pipeline_type, context, stop_event))
        self.active_pipelines[pipeline_id] = {"task": task, "stop_event": stop_event,
                                              "pipeline_type": pipeline_type.get_pipeline_name()}

        logger.info(f"Started pipeline {pipeline_id} of type {pipeline_type.get_pipeline_name()}.")
        return pipeline_id

    async def stop_pipeline(self, pipeline_id: str):
        """Stop a running pipeline by its ID"""
        pipeline = self.active_pipelines.get(pipeline_id)
        if pipeline:
            pipeline["stop_event"].set()
            task: asyncio.Task = pipeline["task"]
            try:
                await task
            except asyncio.CancelledError:
                logger.info(f"Pipeline {pipeline_id} has been cancelled.")
            finally:
                del self.active_pipelines[pipeline_id]
                logger.info(f"Pipeline {pipeline_id} removed from active pipelines.")

    async def stop_all_pipelines(self):
        """Stop all running pipelines"""
        pipeline_ids = list(self.active_pipelines.keys())
        for pipeline_id in pipeline_ids:
            await self.stop_pipeline(pipeline_id)

    def get_active_pipelines(self) -> List[Dict[str, Any]]:
        """Return a list of active pipelines with their details"""
        active = []
        for pid, info in self.active_pipelines.items():
            active.append({
                "pipeline_id": pid,
                "pipeline_type": info.get("pipeline_type", "Unknown"),
                "status": "running"
            })
        return active
