import asyncio

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage


class ErrorStage(BasePipelineStage):

    async def process(self, context: PipelineContext) -> StageResult:
        backoff = context.data.get('error_stage')
        # exponential backoff
        if backoff:

            next_backoff = backoff * 2
            if next_backoff > 3:
                next_backoff = 3
        else:
            next_backoff = 0.1

        await asyncio.sleep(next_backoff)
        return StageResult(success=True, data=next_backoff)
