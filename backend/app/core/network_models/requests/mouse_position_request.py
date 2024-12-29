from pydantic import BaseModel


class MousePositionRequest(BaseModel):
    mouse_x: int
    mouse_y: int
