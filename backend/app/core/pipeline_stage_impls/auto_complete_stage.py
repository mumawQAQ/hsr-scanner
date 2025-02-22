import asyncio

from loguru import logger

from app.core.custom_exception import StageResultNotFoundException, ModelNotFoundException
from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.core.model_impls.keyboard_model import KeyboardModel
from app.core.pipeline_stage_impls.relic_enhance_stage import RelicEnhanceStage


class AutoCompleteStage(BasePipelineStage):

    @staticmethod
    def get_name() -> str:
        return "auto_complete_stage"

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            keyboard_model = ModelManager().get_model(KeyboardModel)
            relic_enhance_stage_result = context.get_stage_result(RelicEnhanceStage.get_name())

            if relic_enhance_stage_result.get('next_relic', False):
                keyboard_model.predict("d")

            context.cleanup()

            await asyncio.sleep(0.25)
            return StageResult(success=True, data=None)
        except ModelNotFoundException as e:
            logger.exception(e.message)
            return StageResult(success=False, data=None, error=e.message)
        except StageResultNotFoundException as e:
            logger.exception(e.message)
            return StageResult(success=False, data=None, error=e.message)
        except Exception:
            logger.exception("自动完成阶段异常")
            return StageResult(success=False, data=None, error="自动完成阶段异常, 打开日志查看详细信息")
