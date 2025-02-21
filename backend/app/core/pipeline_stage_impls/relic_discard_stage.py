import asyncio
from typing import Optional

import pyautogui as pg
from loguru import logger

from app.constant import RELIC_DISCARD_SCORE, AUTO_DETECT_DISCARD_ICON, DISCARD_ICON_POSITION
from app.core.data_models.caches import CachedDiscardIconPosition
from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.core.model_impls.keyboard_model import KeyboardModel


class RelicDiscardStage(BasePipelineStage):

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            screenshot = context.data.get("screenshot_stage")
            detection = context.data.get("detection_stage")
            relic_analysis = context.data.get("relic_analysis_stage")
            relic_discard_score = context.meta_data.get(RELIC_DISCARD_SCORE, 40) / 100
            auto_detect_discard_icon = context.meta_data.get(AUTO_DETECT_DISCARD_ICON, True)
            discard_icon_position = context.meta_data.get(DISCARD_ICON_POSITION, {})
            discard_icon_x = discard_icon_position.get('x', 0)
            discard_icon_y = discard_icon_position.get('y', 0)

            logger.info(
                f"当前阶段配置: relic_discard_score: {relic_discard_score}, auto_detect_discard_icon: {auto_detect_discard_icon}, discard_icon_position: {discard_icon_position}")

            keyboard_model: Optional[KeyboardModel] = ModelManager().get_model(KeyboardModel.get_name())

            if not keyboard_model:
                error_msg = "键盘模组未找到, 请联系开发者"
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            if not screenshot:
                error_msg = "截图数据未找到, 请检查游戏是否运行中, 语言是否设置为英文"
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            if relic_analysis is None:
                error_msg = "遗器分析数据未找到"
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

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
                elif detection is None or 'discard-icon' not in detection:
                    error_msg = "无法获取弃置图标位置, 如果此错误频繁发生, 请尝试手动设置弃置图标位置"
                    logger.error(error_msg)
                    return StageResult(
                        success=False,
                        data=None,
                        error=error_msg
                    )
                else:
                    icon_center_x = detection['discard-icon']['box']['x_center']
                    icon_center_y = detection['discard-icon']['box']['y_center']

                    # cache the icon position
                    context.cache[CachedDiscardIconPosition.name] = CachedDiscardIconPosition(x=icon_center_x,
                                                                                              y=icon_center_y)

            logger.info(f"弃置图标位置: ({icon_center_x}, {icon_center_y})")

            if len(relic_analysis) == 0 or relic_analysis[0].score < relic_discard_score:
                window_left = screenshot['window_info'].left
                window_top = screenshot['window_info'].top

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
        except Exception as e:
            logger.exception(f"遗器弃置阶段异常")
            return StageResult(success=False, data=None, error="遗器弃置阶段异常, 打开日志查看详细信息")
