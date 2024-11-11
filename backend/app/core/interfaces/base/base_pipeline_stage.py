from abc import ABC, abstractmethod

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.pipeline_interface import PipelineStageProtocol
from app.core.managers.websocket_manager import WebsocketManager
from app.core.network_models.responses.pipeline_response import PipelineResponse


class BasePipelineStage(ABC, PipelineStageProtocol):
    def __init__(self, websocket_manager: WebsocketManager):
        self.websocket_manager = websocket_manager

    @abstractmethod
    def get_stage_name(self) -> str:
        pass

    @abstractmethod
    async def process(self, context: PipelineContext) -> StageResult:
        pass

    async def send_progress(self, context: PipelineContext, message: str):
        """Send progress message via WebSocket."""
        await self.websocket_manager.send_message(
            PipelineResponse(
                type="progress",
                stage=self.get_stage_name(),
                data=message,
                pipeline_id=context.pipeline_id,
                pipeline_type=context.pipeline_type
            ).model_dump_json())
