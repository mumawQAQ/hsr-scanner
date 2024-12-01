from app.core.data_models.mouse_event import MouseEventType, MouseModelInput
from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_enums import GameRecognitionStage
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.base.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.logging_config import logging


class RelicDiscardStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return GameRecognitionStage.RELIC_DISCARD.value

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            screenshot = context.data.get(GameRecognitionStage.SCREENSHOT.value)
            detection = context.data.get(GameRecognitionStage.DETECTION.value)
            relic_analysis = context.data.get(GameRecognitionStage.RELIC_ANALYSIS.value)
            relic_discard_score = context.meta_data.get("relic_discard_score", 0.4)
            skip_if_error = context.meta_data.get("skip_if_error", True)

            # TODO: this may need to move to a separate stage
            keyboard_model = ModelManager().get_model("keyboard")
            mouse_model = ModelManager().get_model("mouse")

            if not keyboard_model:
                raise ValueError("Keyboard model not found.")

            if not screenshot:
                raise ValueError("Screenshot data not found.")

            if relic_analysis is None:
                if skip_if_error:
                    keyboard_model.predict("d")
                raise ValueError("Relic analysis data not found.")

            if detection is None or 'discard-icon' not in detection:
                if skip_if_error:
                    keyboard_model.predict("d")
                raise ValueError("Detection discard icon data not found.")

            if len(relic_analysis) == 0 or relic_analysis[0].score < relic_discard_score:
                icon_center_x = detection['discard-icon']['box']['x_center']
                icon_center_y = detection['discard-icon']['box']['y_center']

                logging.info(f"Discard icon center: ({icon_center_x}, {icon_center_y})")

                window_left = screenshot['window']['left']
                window_top = screenshot['window']['top']

                icon_x = window_left + icon_center_x
                icon_y = window_top + icon_center_y

                logging.info(f"Discard icon screen position: ({icon_x}, {icon_y})")

                # click on the icon
                mouse_model.predict(MouseModelInput(event_type=MouseEventType.MOVE_TO, x=icon_x, y=icon_y))
                mouse_model.predict(MouseModelInput(event_type=MouseEventType.CLICK))
                # reset mouse position
                mouse_model.predict(MouseModelInput(event_type=MouseEventType.MOVE_TO, x=1, y=1))

            keyboard_model.predict("d")

            return StageResult(
                success=True,
                data=None,
            )
        except Exception as e:
            return StageResult(success=False, data=None, error=str(e))
