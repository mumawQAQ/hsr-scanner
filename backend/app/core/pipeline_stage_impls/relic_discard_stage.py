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
            # TODO: need to check whether the relic need to be discarded or not
            screenshot = context.data.get(GameRecognitionStage.SCREENSHOT.value)
            icon_matcher_model = ModelManager().get_model("icon_matcher")

            # TODO: this may need to move to a separate stage
            keyboard_model = ModelManager().get_model("keyboard")

            if not screenshot:
                raise ValueError("Screenshot data not found.")

            if not icon_matcher_model:
                raise ValueError("Icon matcher model not found.")

            if not keyboard_model:
                raise ValueError("Keyboard model not found.")

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
