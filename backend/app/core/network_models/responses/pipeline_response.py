from typing import List, Dict, Any
from typing import Optional

from pydantic import BaseModel


class PipelineResponse(BaseModel):
    type: str
    stage: str
    error: Optional[str] = None
    data: Optional[Any] = None
    pipeline_id: str
    pipeline_type: str


class StartPipelineResponse(BaseModel):
    message: str
    pipeline_id: str
    pipeline_type: str


class StopPipelineResponse(BaseModel):
    message: str
    pipeline_id: str


class ActivePipelinesResponse(BaseModel):
    pipelines: List[Dict[str, Any]]


class StatusResponse(BaseModel):
    pipeline_id: str
    status: str


class ErrorResponse(BaseModel):
    message: str
