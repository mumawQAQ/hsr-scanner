from loguru import logger

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.core.model_impls.screenshot_model import ScreenshotModel
from app.core.model_impls.window_info_model import WindowInfoModel


class ScreenshotStage(BasePipelineStage):

    @staticmethod
    def get_name() -> str:
        return "screenshot_stage"

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            window_info_model = ModelManager().get_model(WindowInfoModel)
            screenshot_model = ModelManager().get_model(ScreenshotModel)

            window_info = window_info_model.predict(None)

            screenshot_data = screenshot_model.predict(window_info)

            return StageResult(
                success=True,
                data={
                    "image": screenshot_data,
                    "window_info": window_info
                }
            )
        except Exception as e:
            logger.exception(f"截图阶段异常")
            return StageResult(
                success=False,
                error=str(e),
                data=None,
            )
