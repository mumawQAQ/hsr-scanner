from fastapi import APIRouter
from pynput.mouse import Controller as MouseController

from app.core.network_models.requests.mouse_position_request import MousePositionRequest
from app.logging_config import set_log_level

router = APIRouter()


@router.patch("/full-log/{state}")
def change_log_level(state: bool):
    if state:
        set_log_level("DEBUG")
    else:
        set_log_level("ERROR")

    return {'status': 'success'}


@router.post("/mouse-position")
async def mouse_position(
        request: MousePositionRequest,
):
    x = request.mouse_x
    y = request.mouse_y

    mouse = MouseController()
    mouse.position = (x, y)
