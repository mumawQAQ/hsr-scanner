import os

import cv2

from app.constant import ICON_FOLDER
from app.core.custom_exception import IconNotFoundException
from app.core.data_models.model_io import IconMatcherInput, IconMatcherOutput
from app.core.interfaces.model_interface import ModelInterface


class IconMatcherModel(ModelInterface[IconMatcherInput, IconMatcherOutput]):

    @staticmethod
    def get_name() -> str:
        return "icon_matcher_model"

    def __init__(self):
        self.icons = {}

    def load(self):
        icon_filenames = [f for f in os.listdir(ICON_FOLDER)
                          if os.path.isfile(os.path.join(ICON_FOLDER, f))]
        self.icons = {
            os.path.splitext(icon)[0]: cv2.imread(os.path.join(ICON_FOLDER, icon), cv2.IMREAD_COLOR)
            for icon in icon_filenames
        }

    def predict(self, input_data: IconMatcherInput) -> IconMatcherOutput:
        image = input_data.image
        icon_name = input_data.icon_name
        threshold = input_data.throshold
        scale = input_data.scale

        if icon_name not in self.icons:
            raise IconNotFoundException(f"无法找到图标: {icon_name}, 请检查图标名称是否正确")

        icon = self.icons[icon_name]

        if scale and scale > 1:
            icon = cv2.resize(icon, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
        elif scale and scale < 1:
            icon = cv2.resize(icon, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)

        result = cv2.matchTemplate(image, icon, cv2.TM_CCOEFF_NORMED)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

        if max_val < threshold:
            raise IconNotFoundException(f"未在图像中找到图标: {icon_name}")

        return IconMatcherOutput(
            x_center=int(max_loc[0] + icon.shape[1] // 2),
            y_center=int(max_loc[1] + icon.shape[0] // 2),
            width=icon.shape[1],
            height=icon.shape[0],
            left=max_loc[0],
            top=max_loc[1]
        )
