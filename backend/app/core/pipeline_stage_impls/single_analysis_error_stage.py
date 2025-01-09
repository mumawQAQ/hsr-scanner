from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage


class SingleAnalysisErrorStage(BasePipelineStage):

    async def process(self, context: PipelineContext) -> StageResult:
        context.data.clear()
        return StageResult(success=True, data=None)
