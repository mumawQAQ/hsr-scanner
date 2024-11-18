from typing import Type, List

from app.core.interfaces.pipeline_interface import PipelineProtocol
from app.core.interfaces.pipeline_stage_interface import PipelineStageProtocol
from app.core.pipeline_stage_impls.detection_stage import DetectionStage
from app.core.pipeline_stage_impls.ocr_stage import OCRStage
from app.core.pipeline_stage_impls.relic_analysis_stage import RelicAnalysisStage
from app.core.pipeline_stage_impls.relic_discard_stage import RelicDiscardStage
from app.core.pipeline_stage_impls.screenshot_stage import ScreenshotStage


class AutoRelicAnalysisPipeline(PipelineProtocol):
    """Pipeline for game state recognition"""

    @classmethod
    def get_stages(cls) -> List[Type[PipelineStageProtocol]]:
        return [
            ScreenshotStage,
            DetectionStage,
            OCRStage,
            RelicAnalysisStage,
            RelicDiscardStage
        ]

    @classmethod
    def get_pipeline_name(cls) -> str:
        return cls.__name__
