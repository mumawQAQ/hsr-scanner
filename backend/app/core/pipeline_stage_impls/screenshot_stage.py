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
            game_window = None
            for title in GAME_TITLES:
                windows = gw.getWindowsWithTitle(title)
                if windows:
                    game_window = windows[0]
                    break

            if not game_window:
                raise ValueError(
                    f"Game window {GAME_TITLES} not found. Make sure the game is running and the language is set to English.")

            left = game_window.left
            top = game_window.top
            width = game_window.width
            height = game_window.height

            screen = pg.screenshot(region=(left, top, width, height))
            image_bgr = cv2.cvtColor(np.array(screen), cv2.COLOR_RGB2BGR)

            screenshot_data = {
                'image': screen,
                'image_bgr': image_bgr,
                'window': {
                    'left': left,
                    'top': top,
                    'width': width,
                    'height': height
                }
            }

            return StageResult(
                success=True,
                data=screenshot_data
            )
        except Exception as e:
            return StageResult(success=False, data=None, error=str(e))
