from typing import Dict, Type, List

from app.core.interfaces.pipeline_interface import PipelineProtocol
from app.core.pipeline_factory import PIPELINE_TYPE
from app.logging_config import logger


class PipelineManager:
    """Manager for managing available pipeline types"""

    def __init__(self):
        self._pipelines: Dict[str, Type[PIPELINE_TYPE]] = {}

    def register_pipeline(self, pipeline_class: Type[PIPELINE_TYPE]) -> None:
        """Register a new pipeline type"""
        if not issubclass(pipeline_class, PipelineProtocol):
            raise TypeError(f"{pipeline_class.__name__} does not implement PipelineProtocol.")
        self._pipelines[pipeline_class.get_pipeline_name()] = pipeline_class
        logger.info(f"Registered pipeline: {pipeline_class.get_pipeline_name()}")

    def get_pipeline(self, pipeline_name: str) -> Type[PIPELINE_TYPE]:
        """Get pipeline class by name"""
        if pipeline_name not in self._pipelines:
            raise ValueError(f"Pipeline '{pipeline_name}' not found")
        return self._pipelines[pipeline_name]

    def get_available_pipelines(self) -> List[str]:
        """Get list of available pipeline names"""
        return list(self._pipelines.keys())
