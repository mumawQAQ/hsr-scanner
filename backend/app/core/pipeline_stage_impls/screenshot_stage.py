from typing import Optional, Dict, Any

import cv2
import numpy as np
import pyautogui as pg
from win32api import GetCurrentThreadId
from win32con import SW_RESTORE, SW_SHOW
from win32gui import IsWindowVisible, GetForegroundWindow, EnumWindows, GetWindowText, GetWindowRect
from win32gui import ShowWindow, BringWindowToTop, IsIconic, SetForegroundWindow
from win32process import AttachThreadInput, GetWindowThreadProcessId

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
            # get whether to bring the window to the front
            bring_to_front = context.meta_data.get('bring_to_front', False)
            # Find game window
            window_info = self.__find_game_window__()
            if not window_info:
                raise ValueError(
                    f"Game window not found. Searched titles: {GAME_TITLES}. "
                    f"Make sure the game is running and the language is set to English."
                )

            hwnd, window_title = window_info

            # check if the window is already in the foreground
            if GetForegroundWindow() != hwnd and bring_to_front:
                self.__bring_window_to_foreground__(hwnd)

            # Get window dimensions and capture screenshot
            window_rect = self.__get_window_rect__(hwnd)
            screenshot_data = self.__capture_screenshot__(window_rect)

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

    def __find_game_window__(self) -> Optional[tuple]:
        """
        Attempt to find the game window from the list of possible titles.
        Returns tuple of (window handle, window title) if found, None otherwise.
        """

        def callback(hwnd, _windows):
            if IsWindowVisible(hwnd):
                window_text = GetWindowText(hwnd)
                for title in GAME_TITLES:
                    if title.lower() in window_text.lower():
                        _windows.append((hwnd, window_text))
            return True

        windows = []
        EnumWindows(callback, windows)
        return windows[0] if windows else None

    def __bring_window_to_foreground__(self, hwnd: int) -> None:
        """
        Brings window to foreground using Win32 API with various fallback methods.
        Returns True if successful, False otherwise.
        """
        # Get current foreground window
        current_fore = GetForegroundWindow()

        # Get thread info
        current_thread = GetCurrentThreadId()
        target_thread = GetWindowThreadProcessId(hwnd)[0]
        fore_thread = GetWindowThreadProcessId(current_fore)[0]

        # Attach threads if necessary
        if current_thread != fore_thread:
            AttachThreadInput(current_thread, fore_thread, True)
        if current_thread != target_thread:
            AttachThreadInput(current_thread, target_thread, True)

        # Try multiple methods to bring window to foreground
        try:
            # Show window if minimized
            if IsIconic(hwnd):
                ShowWindow(hwnd, SW_RESTORE)

            # Set foreground window
            SetForegroundWindow(hwnd)

            # Alternative method using ShowWindow
            ShowWindow(hwnd, SW_SHOW)

            # Force window to top
            BringWindowToTop(hwnd)

        finally:
            # Detach threads
            if current_thread != fore_thread:
                AttachThreadInput(current_thread, fore_thread, False)
            if current_thread != target_thread:
                AttachThreadInput(current_thread, target_thread, False)

    def __get_window_rect__(self, hwnd: int) -> Dict[str, int]:
        """Get window rectangle coordinates."""
        rect = GetWindowRect(hwnd)
        return {
            'left': rect[0],
            'top': rect[1],
            'width': rect[2] - rect[0],
            'height': rect[3] - rect[1]
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
