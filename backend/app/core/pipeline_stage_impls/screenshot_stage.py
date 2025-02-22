import asyncio

from loguru import logger

from app.constant import GAME_TITLES
from app.core.custom_exception import ModelNotFoundException
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
            if not window_info:
                error_msg = f"未检测到游戏窗口, 尝试搜索标题: {GAME_TITLES}. 请检查游戏是否运行中, 语言是否设置为英文"
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    error=error_msg,
                    data=None
                )

            screenshot_data = screenshot_model.predict(window_info)

            await asyncio.sleep(0.25)
            return StageResult(
                success=True,
                data={
                    "image": screenshot_data,
                    "window_info": window_info
                }
            )

        except ModelNotFoundException as e:
            logger.exception(e.message)
            return StageResult(success=False, data=None, error=e.message)
        except Exception:
            logger.exception(f"截图阶段异常")
            return StageResult(
                success=False,
                error="截图阶段异常, 打开日志查看详细信息",
                data=None,
            )
