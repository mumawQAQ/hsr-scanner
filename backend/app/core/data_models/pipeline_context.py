import gc
from typing import Dict, Any

from pydantic import BaseModel

from app.core.custom_exception import StageDateNotFoundException


class PipelineContext(BaseModel):
    """Base context holding pipeline execution data"""
    pipeline_id: str
    data: Dict[str, Any] = {}
    meta_data: Dict[str, Any]
    cache: Dict[str, Any] = {}

    def get_stage_data(self, stage_name: str) -> Any:
        if stage_name not in self.data:
            raise StageDateNotFoundException(f"无法获取到stage:{stage_name}数据, 请查看日志")
        return self.data[stage_name]

    def cleanup(self) -> None:
        for stage_name, resources in self.data.items():
            if isinstance(resources, dict):
                for key in list(resources.keys()):
                    del resources[key]
        gc.collect()
