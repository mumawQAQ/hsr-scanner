from typing import Optional

import pygetwindow as gw

from app.constant import GAME_TITLES
from app.core.data_models.window_info import WindowInfo
from app.core.interfaces.model_interface import ModelInterface


class WindowInfoModel(ModelInterface[None, Optional[WindowInfo]]):

    def load(self) -> None:
        pass

    def predict(self, input_data: None) -> Optional[WindowInfo]:
        game_window = None
        for title in GAME_TITLES:
            windows = gw.getWindowsWithTitle(title)
            if windows:
                game_window = windows[0]
                break

        if not game_window:
            return None

        return WindowInfo(
            width=game_window.width,
            height=game_window.height,
            left=game_window.left,
            top=game_window.top
        )
