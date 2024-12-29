from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_enums import GameRecognitionStage
from app.core.data_models.stage_result import StageResult, StageResultMetaData
from app.core.interfaces.base.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.core.network_models.responses.relic_ocr_response import RelicOCRResponse


class RelicAnalysisStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return GameRecognitionStage.RELIC_ANALYSIS.value

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            ocr_data: RelicOCRResponse = context.data.get(GameRecognitionStage.OCR.value)
            relic_rating_model = ModelManager().get_model("relic_rating")

            if not ocr_data:
                raise ValueError("OCR data not found.")

            if not relic_rating_model:
                raise ValueError("Relic rating model not found.")

            result = relic_rating_model.predict(ocr_data)

            return StageResult(
                success=True,
                data=result,
                metadata=StageResultMetaData(send_to_frontend=True)
            )
        except Exception as e:
            return StageResult(success=False, data=None, error=str(e))
