from loguru import logger

from app.core.custom_exception import StageResultNotFoundException, ModelNotFoundException
from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult, StageResultMetaData
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.core.model_impls.relic_rating_model import RelicRatingModel
from app.core.pipeline_stage_impls.ocr_stage import OCRStage


class RelicAnalysisStage(BasePipelineStage):

    @staticmethod
    def get_name() -> str:
        return "relic_analysis_stage"

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            ocr_stage_result = context.get_stage_result(OCRStage.get_name())
            relic_rating_model = ModelManager().get_model(RelicRatingModel)

            try:
                result = relic_rating_model.predict(ocr_stage_result)
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
        except StageResultNotFoundException as e:
            logger.exception(e.message)
            return StageResult(success=False, data=None, error=e.message)
        except ModelNotFoundException as e:
            logger.exception(e.message)
            return StageResult(success=False, data=None, error=e.message)
        except Exception:
            logger.exception(f"遗器分析阶段异常")
            return StageResult(success=False, data=None, error="遗器分析阶段异常, 打开日志查看详细信息")
