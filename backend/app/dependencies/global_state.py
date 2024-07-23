from app.models.yolo_box import YoloBox


class GlobalState:
    def __init__(self):
        self.interval = 2000
        self.screen = None
        self.window = {
            'left': 0,
            'top': 0,
            'width': 0,
            'height': 0
        }
        self.screen_rgb = None
        self.yolo_boxes: list[YoloBox] = []


global_state = GlobalState()


def get_global_state():
    return global_state
