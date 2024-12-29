import logging

from fastapi import APIRouter
from pynput.mouse import Controller as MouseController

from app.core.network_models.requests.mouse_position_request import MousePositionRequest
from app.logging_config import logger

router = APIRouter()


@router.patch("/full-log/{state}")
def change_log_level(state: bool):
    console_handler = None
    for handler in logging.getLogger().handlers:
        if handler.get_name() == 'console':
            console_handler = handler

    if console_handler is None:
        logger.error("无法找到控制台日志处理器")
        return {'status': 'failed'}

    if state:
        console_handler.setLevel(logging.DEBUG)
    else:
        console_handler.setLevel(logging.ERROR)

    return {'status': 'success'}


@router.post("/mouse-position")
async def mouse_position(
        request: MousePositionRequest,
):
    x = request.mouse_x
    y = request.mouse_y

    mouse = MouseController()
    mouse.position = (x, y)

    logger.info(f"Mouse moved to ({x}, {y})")
