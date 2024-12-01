from pynput.mouse import Controller as MouseController, Button

from app.core.data_models.mouse_event import MouseModelInput, MouseEventType
from app.core.interfaces.model_interface import ModelInterface


class MouseModel(ModelInterface[MouseModelInput, None]):

    def __init__(self):
        self.mouse = MouseController()

    def load(self) -> None:
        pass

    def predict(self, input_data: MouseModelInput) -> None:
        if input_data.event_type is MouseEventType.MOVE_TO:
            self.mouse.position = (input_data.x, input_data.y)
        elif input_data.event_type is MouseEventType.CLICK:
            self.mouse.press(Button.left)
            self.mouse.release(Button.left)
        else:
            raise ValueError(f"Invalid mouse event type: {input_data.event_type}")
