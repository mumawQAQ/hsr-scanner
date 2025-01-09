from abc import ABC, abstractmethod

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult


class BasePipelineStage(ABC):

    def __init__(self, stage_name: str) -> None:
        self.stage_name = stage_name

    def get_stage_name(self) -> str:
        return self.stage_name

    @abstractmethod
    async def process(self, context: PipelineContext) -> StageResult:
        pass
