from typing import Union

import cv2
import numpy as np
from PIL import Image
from cv2 import Mat
from numpy import ndarray

from app.core.data_models.icon_matcher import IconMatcherInput, IconMatcherOutput
from app.core.interfaces.model_interface import ModelInterface


class IconMatcherModel(ModelInterface[IconMatcherInput, IconMatcherOutput]):
    def __init__(self):
        self.icons = None

    def __load_icon_bgr__(self, icon_path: str) -> dict[str, Union[Mat, ndarray, dict[str, int]]]:
        icon = Image.open(icon_path).convert('RGB')
        icon_np = np.array(icon)
        icon_bgr = cv2.cvtColor(icon_np, cv2.COLOR_RGB2BGR)
        icon_info = {
            'width': icon.width,
            'height': icon.height
        }

        return {
            'icon_bgr': icon_bgr,
            'icon_info': icon_info
        }

    def load(self) -> None:
        self.icons = {}

    def predict(self, input_data: IconMatcherInput) -> IconMatcherOutput:
        source_image_bgr = input_data.source_image_bgr
        icon_type = input_data.icon_type

        icon = self.icons[icon_type.value]

        result = cv2.matchTemplate(source_image_bgr, icon['icon_bgr'], cv2.TM_CCOEFF_NORMED)

        _, _, _, max_loc = cv2.minMaxLoc(result)
        best_x, best_y = max_loc
        best_center_x = int(best_x + icon['icon_info']['width'] / 2)
        best_center_y = int(best_y + icon['icon_info']['height'] / 2)

        return IconMatcherOutput(x_center=best_center_x, y_center=best_center_y)
