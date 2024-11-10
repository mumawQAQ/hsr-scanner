from typing import List, TypeVar, Type

from app.core.interfaces.pipeline_interface import PipelineStageProtocol, PipelineProtocol
from app.core.managers.websocket_manager import WebsocketManager

PIPELINE_TYPE = TypeVar('PIPELINE_TYPE', bound=PipelineProtocol)


class PipelineFactory:
    """Factory for creating pipeline instances"""

    def __init__(self, websocket_manager: WebsocketManager):
        self.websocket_manager = websocket_manager

    def create_pipeline_stages(self, pipeline_type: Type[PIPELINE_TYPE]) -> List[PipelineStageProtocol]:
        """Create instances of all stages for a given pipeline type"""
        stages = pipeline_type.get_stages()
        # Ensure all stages conform to PipelineStageProtocol
        for stage_cls in stages:
            if not issubclass(stage_cls, PipelineStageProtocol):
                raise TypeError(f"{stage_cls.__name__} does not implement PipelineStageProtocol.")
        return [
            stage_class(self.websocket_manager)
            for stage_class in pipeline_type.get_stages()
        ]
