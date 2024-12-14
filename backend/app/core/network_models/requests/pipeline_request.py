from typing import Optional, Dict, Any

from pydantic import BaseModel


# Request Models
class StartPipelineRequest(BaseModel):
    pipeline_name: str
    meta_data: Optional[Dict[str, Any]]


class StopPipelineRequest(BaseModel):
    pipeline_id: str
