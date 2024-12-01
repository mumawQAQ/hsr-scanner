from typing import Optional, Dict, Any

import cv2
import numpy as np
import pyautogui as pg
import pygetwindow as gw

from app.constant import GAME_TITLES
from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_enums import GameRecognitionStage
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.base.base_pipeline_stage import BasePipelineStage


class ScreenshotStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return GameRecognitionStage.SCREENSHOT.value

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            # Find game window
            window_info = self.__find_game_window__()
            if not window_info:
                raise ValueError(
                    f"Game window not found. Searched titles: {GAME_TITLES}. "
                    f"Make sure the game is running and the language is set to English."
                )

            screenshot_data = self.__capture_screenshot__(window_info)

            return StageResult(
                success=True,
                data=screenshot_data
            )

        except Exception as e:
            return StageResult(
                success=False,
                error=f"Unexpected error during screenshot capture: {str(e)}",
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
        """Capture and process the screenshot of the specified window."""
        # Add small margins to ensure we capture the full window
        left = max(0, window_rect['left'])
        top = max(0, window_rect['top'])
        width = window_rect['width']
        height = window_rect['height']

        # Capture the screenshot
        screen = pg.screenshot(region=(left, top, width, height))
        image_bgr = cv2.cvtColor(np.array(screen), cv2.COLOR_RGB2BGR)

        return {
            'image': screen,
            'image_bgr': image_bgr,
            'window': window_rect
        }
