from typing import Optional

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
        skip_if_error = context.meta_data.get(ANALYSIS_FAIL_SKIP, True)
        context.cleanup()

        if skip_if_error:
            keyboard_model: Optional[KeyboardModel] = ModelManager().get_model(KeyboardModel.get_name())

            if not keyboard_model:
                error_msg = "键盘模组未找到, 请联系开发者"
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            keyboard_model.predict("d")
            return StageResult(success=True, data=None)

        return StageResult(success=True, data=None)
