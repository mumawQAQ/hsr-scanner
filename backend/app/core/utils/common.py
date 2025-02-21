from typing import Any, Optional

from loguru import logger

from app.core.data_models.stage_result import StageResult


def validate_none(data: Any, error_msg: str) -> Optional[StageResult]:
    if not data:
        logger.error(error_msg)
        return StageResult(success=False, error=error_msg, data=None)

    return None
