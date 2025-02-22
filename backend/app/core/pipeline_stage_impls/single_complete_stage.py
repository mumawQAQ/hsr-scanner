from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage


class SingleCompleteStage(BasePipelineStage):

    @staticmethod
    def get_name() -> str:
        return "single_complete_stage"

    async def process(self, context: PipelineContext) -> StageResult:
        context.cleanup()
        return StageResult(success=True, data=None)
