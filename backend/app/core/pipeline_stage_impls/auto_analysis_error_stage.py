from loguru import logger

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager


class AutoAnalysisErrorStage(BasePipelineStage):
    async def process(self, context: PipelineContext) -> StageResult:
        skip_if_error = context.meta_data.get("analysis_fail_skip", True)
        context.data = {}

        if skip_if_error:
            keyboard_model = ModelManager().get_model("keyboard")

            if not keyboard_model:
                error_msg = "Keyboard model not found. This error should not happen. please contact the developer."
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            keyboard_model.predict("d")
            return StageResult(success=True, data=None)

        return StageResult(success=True, data=None)
