from loguru import logger

from app.constant import AUTO_DETECT_RELIC_BOX, AUTO_DETECT_DISCARD_ICON
from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.core.model_impls.yolo_model import YOLOModel
from app.core.pipeline_stage_impls.screenshot_stage import ScreenshotStage


class DetectionStage(BasePipelineStage):
    @staticmethod
    def get_name() -> str:
        return "detection_stage"

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            auto_detect_relic_box_position = context.meta_data.get(AUTO_DETECT_RELIC_BOX, True)
            auto_detect_discard_icon = context.meta_data.get(AUTO_DETECT_DISCARD_ICON, True)
            screenshot_stage_result = context.get_stage_result(ScreenshotStage.get_name())

            if not auto_detect_relic_box_position and not auto_detect_discard_icon:
                return StageResult(
                    success=True,
                    data={},
                )
            else:
                yolo_model = ModelManager().get_model(YOLOModel)
                detection_data = yolo_model.predict(screenshot_stage_result)
                return StageResult(
                    success=True,
                    data=detection_data,
                )

        except Exception as e:
            logger.exception(f"检测阶段异常")
            return StageResult(
                success=False,
                error=str(e),
                data=None,
            )
