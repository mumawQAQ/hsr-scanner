from loguru import logger

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult, StageResultMetaData
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.core.network_models.responses.relic_ocr_response import RelicOCRResponse


class RelicAnalysisStage(BasePipelineStage):

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            ocr_data: RelicOCRResponse = context.data.get("ocr_stage")
            relic_rating_model = ModelManager().get_model("relic_rating")

            if not ocr_data:
                error_msg = "OCR data not found."
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            if not relic_rating_model:
                error_msg = "Relic rating model not found. This error should not happen. please contact the developer."
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            try:
                result = relic_rating_model.predict(ocr_data)
            except ValueError as e:
                error_msg = str(e)
                logger.error(e)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            return StageResult(
                success=True,
                data=result,
                metadata=StageResultMetaData(send_to_frontend=True)
            )
        except Exception as e:
            logger.exception(f"Error in relic analysis stage")
            return StageResult(success=False, data=None, error=str(e))
