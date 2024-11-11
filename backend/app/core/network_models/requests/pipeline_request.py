from typing import Optional, Dict, Any

from pydantic import BaseModel, Field


# Request Models
class StartPipelineRequest(BaseModel):
    pipeline_name: str
    initial_data: Optional[Dict[str, Any]] = Field(default_factory=dict)


class StopPipelineRequest(BaseModel):
    pipeline_id: str
