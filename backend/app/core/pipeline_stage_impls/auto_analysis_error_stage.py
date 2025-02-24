import asyncio

from loguru import logger

from app.constant import ANALYSIS_FAIL_SKIP
from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.core.model_impls.keyboard_model import KeyboardModel


class AutoAnalysisErrorStage(BasePipelineStage):
    @staticmethod
    def get_name() -> str:
        return "auto_analysis_error_stage"

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            skip_if_error = context.meta_data.get(ANALYSIS_FAIL_SKIP, True)
            context.cleanup()

            if skip_if_error:
                keyboard_model = ModelManager().get_model(KeyboardModel)
                keyboard_model.predict("d")

            await asyncio.sleep(0.25)
            return StageResult(success=True, data=None)
        except Exception as e:
            logger.exception("自动分析错误处理阶段异常")
            return StageResult(success=False, data=None, error=str(e))
