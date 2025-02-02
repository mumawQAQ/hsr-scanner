from loguru import logger

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager


class DetectionStage(BasePipelineStage):

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            screenshot = context.data.get("screenshot_stage")

            auto_detect_relic_box_position = context.meta_data.get('auto_detect_relic_box_position', True)
            auto_detect_discard_icon = context.meta_data.get('auto_detect_discard_icon', True)

            if not screenshot:
                error_msg = "无法获取到截图数据, 请联系开发者"
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            if not auto_detect_relic_box_position and not auto_detect_discard_icon:
                return StageResult(
                    success=True,
                    data={},
                )
            else:
                yolo_model = ModelManager().get_model("yolo")

                if not yolo_model:
                    error_msg = "YOLO模组未找到, 请联系开发者"
                    logger.error(error_msg)
                    return StageResult(
                        success=False,
                        data=None,
                        error=error_msg
                    )

                detection_data = yolo_model.predict(screenshot)

                return StageResult(
                    success=True,
                    data=detection_data,
                )


        except Exception as e:
            logger.exception(f"检测阶段异常")
            return StageResult(success=False, data=None, error=str(e))
