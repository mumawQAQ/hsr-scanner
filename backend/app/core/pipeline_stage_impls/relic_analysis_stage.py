import asyncio

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_enums import GameRecognitionStage
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.base.base_pipeline_stage import BasePipelineStage
from app.logging_config import logger


class RelicAnalysisStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return GameRecognitionStage.RELIC_ANALYSIS.value

    async def analyze_game_state(self, ocr_data: str) -> str:
        await asyncio.sleep(1)  # Simulate processing time
        return "game_state_data"

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            ocr_data = context.data.get(GameRecognitionStage.OCR.value)
            if not ocr_data:
                raise ValueError("OCR data not found.")
            game_state = await self.analyze_game_state(ocr_data)
            return StageResult(
                success=True,
                data=game_state,
                metadata={"state": "active"}
            )
        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))
