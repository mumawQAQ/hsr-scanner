import pyautogui as pg
from loguru import logger

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager


class RelicDiscardStage(BasePipelineStage):

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            screenshot = context.data.get("screenshot_stage")
            detection = context.data.get("detection_stage")
            relic_analysis = context.data.get("relic_analysis_stage")
            relic_discard_score = context.meta_data.get("relic_discard_score", 40) / 100
            skip_if_error = context.meta_data.get("analysis_fail_skip", True)
            auto_detect_discard_icon = context.meta_data.get("auto_detect_discard_icon", True)
            discard_icon_x = context.meta_data.get("discard_icon_x", 0)
            discard_icon_y = context.meta_data.get("discard_icon_y", 0)

            # TODO: this may need to move to a separate stage
            keyboard_model = ModelManager().get_model("keyboard")

            if not keyboard_model:
                error_msg = "Keyboard model not found. This error should not happen. please contact the developer."
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            if not screenshot:
                error_msg = "Screenshot data not found. Make sure the game is running and the language is set to English."
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            if relic_analysis is None:
                if skip_if_error:
                    keyboard_model.predict("d")

                error_msg = "Relic analysis data not found."
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            # use the user set mouse position if available
            if not auto_detect_discard_icon:
                icon_center_x = discard_icon_x
                icon_center_y = discard_icon_y
            else:
                if detection is None or 'discard-icon' not in detection:
                    if skip_if_error:
                        keyboard_model.predict("d")

                    error_msg = "Discard icon data not found. Yolo model not able to detect the positions :( make be try to manually set the positions?"
                    logger.error(error_msg)
                    return StageResult(
                        success=False,
                        data=None,
                        error=error_msg
                    )

                icon_center_x = detection['discard-icon']['box']['x_center']
                icon_center_y = detection['discard-icon']['box']['y_center']

            logger.info(f"Discard icon center: ({icon_center_x}, {icon_center_y})")

            if len(relic_analysis) == 0 or relic_analysis[0].score < relic_discard_score:
                window_left = screenshot['window']['left']
                window_top = screenshot['window']['top']

                icon_x = window_left + icon_center_x
                icon_y = window_top + icon_center_y

                logger.info(f"Discard icon screen position: ({icon_x}, {icon_y})")

                # click on the icon
                pg.click(icon_x, icon_y)
                # reset mouse position
                pg.moveTo(1, 1)

            keyboard_model.predict("d")

            return StageResult(
                success=True,
                data=None,
            )
        except Exception as e:
            logger.exception(f"Error in relic discard stage")
            return StageResult(success=False, data=None, error=str(e))
