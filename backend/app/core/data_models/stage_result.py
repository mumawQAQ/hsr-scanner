from typing import Any, Optional

from pydantic import BaseModel, Field


class StageResultMetaData(BaseModel):
    """Metadata for stage results"""
    send_to_frontend: bool = False
    stop_when_failed: bool = False


class StageResult(BaseModel):
    """Base result model for all stages"""
    success: bool
    data: Any
    error: Optional[str] = None
    metadata: StageResultMetaData = Field(default_factory=StageResultMetaData)
