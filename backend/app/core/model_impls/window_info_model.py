import pygetwindow as gw

from app.constant import GAME_TITLES
from app.core.custom_exception import WindowNotFoundException
from app.core.data_models.model_io import WindowInfoOutput
from app.core.interfaces.model_interface import ModelInterface


class WindowInfoModel(ModelInterface[None, WindowInfoOutput]):

    @staticmethod
    def get_name() -> str:
        return "window_info_model"

    def load(self) -> None:
        pass

    def predict(self, input_data):
        game_window = None
        for title in GAME_TITLES:
            windows = gw.getWindowsWithTitle(title)
            if windows:
                game_window = windows[0]
                break

        if not game_window:
            raise WindowNotFoundException(f"未检测到游戏窗口{GAME_TITLES}, 请检查游戏是否运行中, 语言是否设置为英文")

        return WindowInfoOutput(
            width=game_window.width,
            height=game_window.height,
            left=game_window.left,
            top=game_window.top
        )
