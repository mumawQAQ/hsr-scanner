from typing import Optional, Dict, Any

import cv2
import numpy as np
import pygetwindow as gw
from loguru import logger
from mss import mss

from app.constant import GAME_TITLES
from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage


class ScreenshotStage(BasePipelineStage):

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            # Find game window
            window_info = self.__find_game_window__()
            if not window_info:
                error_msg = f"未检测到游戏窗口, 尝试搜索标题: {GAME_TITLES}. 请检查游戏是否运行中, 语言是否设置为英文"
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    error=error_msg,
                    data=None
                )

            screenshot_data = self.__capture_screenshot__(window_info)

            return StageResult(
                success=True,
                data=screenshot_data
            )

        except Exception as e:
            logger.exception(f"截图阶段异常")
            return StageResult(
                success=False,
                error=f"截图阶段异常 {str(e)}",
                data=None,
            )

    def __find_game_window__(self) -> Optional[dict]:
        """
        Attempt to find the game window from the list of possible titles.
        Returns game rectangle info None otherwise.
        """
        game_window = None

        for title in GAME_TITLES:
            windows = gw.getWindowsWithTitle(title)
            if windows:
                game_window = windows[0]
                break

        if not game_window:
            return None

        return {
            'left': game_window.left,
            'top': game_window.top,
            'width': game_window.width,
            'height': game_window.height,
        }

    def __capture_screenshot__(self, window_rect: Dict[str, int]) -> Dict[str, Any]:
        """Capture and process the screenshot of the specified window using mss."""
        left = max(0, window_rect['left'])
        top = max(0, window_rect['top'])
        width = window_rect['width']
        height = window_rect['height']

        monitor = {
            "left": left,
            "top": top,
            "width": width,
            "height": height
        }

        # TODO: this can be optimized to not create new mss each time
        with mss() as sct:
            sct_img = sct.grab(monitor)
            img_np = np.array(sct_img)

            # # Convert from BGRA to RGB
            img_np = cv2.cvtColor(img_np, cv2.COLOR_BGRA2BGR)

            return {
                'image': img_np,
                'window': window_rect
            }
