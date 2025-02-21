from abc import ABC

from app.core.interfaces.pipeline_stage_interface import PipelineStageInterface


class BasePipelineStage(ABC, PipelineStageInterface):
    pass
