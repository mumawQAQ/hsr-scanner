import gc
from typing import Dict, Any

from pydantic import BaseModel


class PipelineContext(BaseModel):
    """Base context holding pipeline execution data"""
    pipeline_id: str
    data: Dict[str, Any]
    meta_data: Dict[str, Any]

    def cleanup(self) -> None:
        for stage_name, resources in self.data.items():
            if isinstance(resources, dict):
                for key in list(resources.keys()):
                    del resources[key]
        gc.collect()
