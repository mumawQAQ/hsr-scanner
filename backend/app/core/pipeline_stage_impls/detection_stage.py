from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_enums import GameRecognitionStage
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.base.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.logging_config import logger


class DetectionStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return GameRecognitionStage.DETECTION.value

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            screenshot = context.data.get(GameRecognitionStage.SCREENSHOT.value)
            yolo_model = ModelManager().get_model("yolo")

            if not screenshot:
                raise ValueError("Screenshot data not found.")

            if not yolo_model:
                raise ValueError("YOLO model not found.")

            detection_data = yolo_model.predict(screenshot)

            return StageResult(
                success=True,
                data=detection_data,
            )

        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))
