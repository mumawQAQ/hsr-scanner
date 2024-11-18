import pyautogui as pg

from app.core.data_models.icon_matcher import IconMatcherOutput, IconMatcherInput, IconType
from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_enums import GameRecognitionStage
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.base.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager


class RelicDiscardStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return GameRecognitionStage.RELIC_DISCARD.value

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            screenshot = context.data.get(GameRecognitionStage.SCREENSHOT.value)
            relic_analysis = context.data.get(GameRecognitionStage.RELIC_ANALYSIS.value)
            relic_discard_score = context.meta_data.get("relic_discard_score", 0.4)
            skip_if_error = context.meta_data.get("skip_if_error", True)

            icon_matcher_model = ModelManager().get_model("icon_matcher")

            # TODO: this may need to move to a separate stage
            keyboard_model = ModelManager().get_model("keyboard")

            if not icon_matcher_model:
                raise ValueError("Icon matcher model not found.")

            if not keyboard_model:
                raise ValueError("Keyboard model not found.")

            if not screenshot:
                raise ValueError("Screenshot data not found.")

            if relic_analysis:
                if skip_if_error:
                    keyboard_model.predict("d")
                raise ValueError("Relic analysis data not found.")

            if len(relic_analysis) == 0 or relic_analysis[0].score < relic_discard_score:
                icon_center_info: IconMatcherOutput = icon_matcher_model.predict(
                    IconMatcherInput(
                        source_image_bgr=screenshot['image_bgr'],
                        icon_type=IconType.DISCARD
                    )
                )

                icon_center_x = icon_center_info.x_center
                icon_center_y = icon_center_info.y_center

                window_left = screenshot['window']['left']
                window_top = screenshot['window']['top']

                icon_x = window_left + icon_center_x
                icon_y = window_top + icon_center_y

                # click on the icon
                pg.click(icon_x, icon_y)

            keyboard_model.predict("d")

            return StageResult(
                success=True,
                data=None,
            )
        except Exception as e:
            return StageResult(success=False, data=None, error=str(e))
