from enum import Enum


class YoloCls(Enum):
    RELIC_MAIN_STAT = 'relic-main-stat'
    RELIC_SUB_STAT = 'relic-sub-stat'
    RELIC_TITLE = 'relic-title'


def get_yolo_cls(cls: str) -> YoloCls:
    if cls == 'relic-main-stat':
        return YoloCls.RELIC_MAIN_STAT
    elif cls == 'relic-sub-stat':
        return YoloCls.RELIC_SUB_STAT
    elif cls == 'relic-title':
        return YoloCls.RELIC_TITLE
    else:
        raise ValueError(f'无效yolo class: {cls}')


class YoloBox:
    def __init__(self, x_center: float, y_center: float, width: float, height: float, cls: YoloCls, w: int, h: int):
        self.x_center = x_center
        self.y_center = y_center
        self.width = width
        self.height = height
        self.cls = cls
        self.x1 = int((x_center - width / 2) * w)
        self.y1 = int((y_center - height / 2) * h)
        self.x2 = int((x_center + width / 2) * w)
        self.y2 = int((y_center + height / 2) * h)

    def __str__(self):
        return f'YoloBox({self.cls}, {self.x_center}, {self.y_center}, {self.width}, {self.height})'
