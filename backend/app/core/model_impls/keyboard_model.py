from typing import Union

from pynput.keyboard import Controller as KeyboardController, Key

from app.core.interfaces.model_interface import ModelInterface


class KeyboardModel(ModelInterface[str, None]):

    def __init__(self):
        self.keyboard = KeyboardController()

    def load(self) -> None:
        pass

    def predict(self, input_data: Union[str, Key]) -> None:
        # TODO: extend this to support multiple event if needed
        self.keyboard.tap(input_data)
