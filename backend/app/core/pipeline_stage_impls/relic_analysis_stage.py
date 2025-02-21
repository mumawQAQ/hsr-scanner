from typing import Optional

from loguru import logger

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult, StageResultMetaData
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.core.model_impls.relic_rating_model import RelicRatingModel
from app.core.network_models.responses.relic_ocr_response import RelicOCRResponse


class RelicAnalysisStage(BasePipelineStage):

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            ocr_data: Optional[RelicOCRResponse] = context.data.get("ocr_stage")
            relic_rating_model: Optional[RelicRatingModel] = ModelManager().get_model(RelicRatingModel.get_name())

            if not ocr_data:
                error_msg = "遗器OCR数据未找到"
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            if not relic_rating_model:
                error_msg = "遗器评分模组未找到, 请联系开发者"
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
            logger.exception(f"遗器分析阶段异常")
            return StageResult(success=False, data=None, error="遗器分析阶段异常, 打开日志查看详细信息")
