from abc import abstractmethod
from typing import runtime_checkable, Protocol

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult


@runtime_checkable
class PipelineStageInterface(Protocol):
    """Protocol defining what a pipeline stage must implement"""

    @staticmethod
    @abstractmethod
    def get_name() -> str:
        pass

    @abstractmethod
    async def process(self, context: PipelineContext) -> StageResult:
        pass
