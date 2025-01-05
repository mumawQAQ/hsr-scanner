import sys

from loguru import logger


def set_log_level(log_level):
    logger.configure(
        handlers=[
            {
                "sink": sys.stderr,
                "level": log_level,
                "format": "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level:<8}</level> | <cyan>{name}:{function}:{line}</cyan> - <level>{message}</level>",
                "colorize": True,
            }
        ]
    )
