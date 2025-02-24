import cv2
import numpy as np
from mss import mss

from app.core.data_models.model_io import WindowInfoOutput
from app.core.interfaces.model_interface import ModelInterface


class ScreenshotModel(ModelInterface[WindowInfoOutput, np.ndarray]):
    @staticmethod
    def get_name() -> str:
        return "screenshot_model"

    def __init__(self) -> None:
        self.model = None

    def load(self) -> None:
        self.model = mss()

    def predict(self, input_data: WindowInfoOutput) -> np.ndarray:
        dict_data = input_data.model_dump()
        img = self.model.grab(dict_data)
        return cv2.cvtColor(np.array(img), cv2.COLOR_BGRA2BGR)
