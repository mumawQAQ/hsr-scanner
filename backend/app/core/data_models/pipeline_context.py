from typing import Dict, Any

from pydantic import BaseModel


class PipelineContext(BaseModel):
    """Base context holding pipeline execution data"""
    pipeline_id: str
    data: Dict[str, Any]
    meta_data: Dict[str, Any]
