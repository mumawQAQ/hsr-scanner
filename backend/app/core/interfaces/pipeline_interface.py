from abc import abstractmethod
from typing import runtime_checkable, Protocol, List, Type

from app.core.interfaces.pipeline_stage_interface import PipelineStageProtocol


@runtime_checkable
class PipelineProtocol(Protocol):
    """Protocol defining what a pipeline must implement"""

    @classmethod
    @abstractmethod
    def get_stages(cls) -> List[Type[PipelineStageProtocol]]:
        pass

    @classmethod
    @abstractmethod
    def get_pipeline_name(cls) -> str:
        pass
