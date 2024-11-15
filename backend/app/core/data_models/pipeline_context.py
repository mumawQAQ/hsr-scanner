from typing import Dict, Any

from pydantic import BaseModel, Field


class PipelineContext(BaseModel):
    """Base context holding pipeline execution data"""
    pipeline_id: str
    pipeline_type: str
    data: Dict[str, Any] = Field(default_factory=dict)
    meta_data: Dict[str, Any] = Field(default_factory=dict)
