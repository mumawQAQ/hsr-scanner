import logging

from fastapi import APIRouter

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
