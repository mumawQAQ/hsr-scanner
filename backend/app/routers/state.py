import logging
from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.global_state import GlobalState, get_global_state
from app.logging_config import logger

router = APIRouter()


@router.patch("/scan-interval/{interval}")
def change_scan_interval(interval: int,
                         global_state: Annotated[GlobalState, Depends(get_global_state)]):
    global_state.interval = interval
    return {'status': 'success'}


@router.patch("/scan-state/{state}")
def change_scan_state(state: bool,
                      global_state: Annotated[GlobalState, Depends(get_global_state)]):
    global_state.scan_state = state
    return {'status': 'success'}


@router.patch("/log-level/{level}")
def change_log_level(level: str):
    console_handler = None
    for handler in logging.getLogger().handlers:
        print(handler.get_name())
        if handler.get_name() == 'console':
            console_handler = handler

    if console_handler is None:
        logger.error("无法找到控制台日志处理器")
        return {'status': 'failed'}

    if level == 'DEBUG':
        console_handler.setLevel(logging.DEBUG)
    elif level == 'ERROR':
        console_handler.setLevel(logging.ERROR)

    return {'status': 'success'}
