import asyncio

import pyautogui as pg
from loguru import logger

from app.constant import RELIC_DISCARD_SCORE, AUTO_DETECT_DISCARD_ICON, DISCARD_ICON_POSITION
from app.core.custom_exception import ModelNotFoundException, StageResultNotFoundException
from app.core.data_models.caches import CachedDiscardIconPosition
from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.core.model_impls.keyboard_model import KeyboardModel
from app.core.pipeline_stage_impls.detection_stage import DetectionStage
from app.core.pipeline_stage_impls.relic_analysis_stage import RelicAnalysisStage
from app.core.pipeline_stage_impls.screenshot_stage import ScreenshotStage


class RelicDiscardStage(BasePipelineStage):

    @staticmethod
    def get_name() -> str:
        return "relic_discard_stage"

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            screenshot_stage_result = context.get_stage_result(ScreenshotStage.get_name())
            detection_stage_result = context.get_stage_result(DetectionStage.get_name())
            relic_analysis_stage_result = context.get_stage_result(RelicAnalysisStage.get_name())

            relic_discard_score = context.meta_data.get(RELIC_DISCARD_SCORE, 40) / 100
            auto_detect_discard_icon = context.meta_data.get(AUTO_DETECT_DISCARD_ICON, True)
            discard_icon_position = context.meta_data.get(DISCARD_ICON_POSITION, {})
            discard_icon_x = discard_icon_position.get('x', 0)
            discard_icon_y = discard_icon_position.get('y', 0)

            logger.info(
                f"当前阶段配置: relic_discard_score: {relic_discard_score}, auto_detect_discard_icon: {auto_detect_discard_icon}, discard_icon_position: {discard_icon_position}")

            keyboard_model = ModelManager().get_model(KeyboardModel)

            # use the user set mouse position if available
            if not auto_detect_discard_icon:
                icon_center_x = discard_icon_x
                icon_center_y = discard_icon_y
            else:
                # check if the cached icon position is set
                cached_discard_icon_position: CachedDiscardIconPosition = context.cache.get(
                    CachedDiscardIconPosition.name)
                if cached_discard_icon_position:
                    logger.info("使用缓存的弃置图标位置")
                    icon_center_x = cached_discard_icon_position.x
                    icon_center_y = cached_discard_icon_position.y
                elif 'discard-icon' not in detection_stage_result:
                    error_msg = "无法获取弃置图标位置, 如果此错误频繁发生, 请尝试手动设置弃置图标位置"
                    logger.error(error_msg)
                    return StageResult(
                        success=False,
                        data=None,
                        error=error_msg
                    )
                else:
                    icon_center_x = detection_stage_result['discard-icon']['box']['x_center']
                    icon_center_y = detection_stage_result['discard-icon']['box']['y_center']

                    # cache the icon position
                    context.cache[CachedDiscardIconPosition.name] = CachedDiscardIconPosition(x=icon_center_x,
                                                                                              y=icon_center_y)

            logger.info(f"弃置图标位置: ({icon_center_x}, {icon_center_y})")

            if len(relic_analysis_stage_result) == 0 or relic_analysis_stage_result[0].score < relic_discard_score:
                window_left = screenshot_stage_result['window_info'].left
                window_top = screenshot_stage_result['window_info'].top

                icon_x = window_left + icon_center_x
                icon_y = window_top + icon_center_y

                # click on the icon
                pg.click(icon_x, icon_y)
                # reset mouse position
                pg.moveTo(1, 1)

                # wait for 0.5 seconds, if this is too fast the next relic may not be processed
                await asyncio.sleep(0.5)

            keyboard_model.predict("d")

            return StageResult(
                success=True,
                data=None,
            )
        except StageResultNotFoundException as e:
            logger.exception(e.message)
            return StageResult(success=False, data=None, error=e.message)
        except ModelNotFoundException as e:
            logger.exception(e.message)
            return StageResult(success=False, data=None, error=e.message)
        except Exception:
            logger.exception(f"遗器弃置阶段异常")
            return StageResult(success=False, data=None, error="遗器弃置阶段异常, 打开日志查看详细信息")
