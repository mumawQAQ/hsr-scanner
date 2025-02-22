import asyncio
from typing import Optional, Union, List, Dict, Tuple

import pyautogui as pg
from loguru import logger
from pynput.keyboard import Key

from app.constant import AUTO_ENHANCE, RELIC_ENHANCE_SCORE
from app.core.custom_exception import StageResultNotFoundException, ModelNotFoundException
from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.managers.model_manager import ModelManager
from app.core.model_impls.keyboard_model import KeyboardModel
from app.core.model_impls.ocr_model import OCRModel
from app.core.model_impls.screenshot_model import ScreenshotModel
from app.core.model_impls.window_info_model import WindowInfoModel
from app.core.network_models.responses.relic_analysis_response import RelicScoreResponse
from app.core.network_models.responses.relic_ocr_response import RelicOCRResponse
from app.core.pipeline_stage_impls.ocr_stage import OCRStage
from app.core.pipeline_stage_impls.relic_analysis_stage import RelicAnalysisStage
from app.core.pipeline_stage_impls.relic_discard_stage import RelicDiscardStage
from app.core.utils.common import validate_none


class RelicEnhanceStage(BasePipelineStage):

    @staticmethod
    def get_name() -> str:
        return "relic_enhance_stage"

    # TODO: cached the icon positions
    async def process(self, context: PipelineContext) -> StageResult:
        try:
            relic_discard_stage_result = context.get_stage_result(RelicDiscardStage.get_name())
            auto_enhance = context.meta_data.get(AUTO_ENHANCE, True)
            if not auto_enhance:
                logger.info("自动强化未开启, 跳过自动强化阶段")
                return StageResult(success=True, data={
                    'next_relic': True
                })

            if relic_discard_stage_result.get('is_discarded', False):
                logger.info("遗器已弃置, 跳过自动强化阶段")
                return StageResult(success=True, data={
                    'next_relic': True
                })

            relic_enchant_score = context.meta_data.get(RELIC_ENHANCE_SCORE, 70) / 100
            ocr_stage_result: Optional[RelicOCRResponse] = context.get_stage_result(OCRStage.get_name())
            relic_analysis_stage_result: Union[None, List[RelicScoreResponse]] = context.get_stage_result(
                RelicAnalysisStage.get_name())

            logger.info(
                f"遗器等级: {ocr_stage_result.relic_main_stat.level}, 遗器强化分数: {relic_analysis_stage_result}")

            if len(relic_analysis_stage_result) == 0 or relic_analysis_stage_result[0].score < relic_enchant_score:
                logger.info("遗器强化分数不满足条件, 跳过自动强化阶段")
                return StageResult(success=True, data={
                    'next_relic': True
                })
            elif ocr_stage_result.relic_main_stat.level >= 15:
                logger.info("遗器强化等级已满, 跳过自动强化阶段")
                return StageResult(success=True, data={
                    'next_relic': True
                })
            else:
                window_info_model = ModelManager().get_model(WindowInfoModel)
                screenshot_model = ModelManager().get_model(ScreenshotModel)
                ocr_model = ModelManager().get_model(OCRModel)
                keyboard_model = ModelManager().get_model(KeyboardModel)

                window_info = window_info_model.predict(None)
                error = validate_none(window_info, "未检测到游戏窗口, 请检查游戏是否运行中, 语言是否设置为英文")
                if error:
                    return error

                screenshot_result = screenshot_model.predict(window_info)
                ocr_result = ocr_model.predict(screenshot_result)
                location_results = self.find_words_location(ocr_result, ["Enhance"])
                error = validate_none(location_results.get("Enhance", None),
                                      "未检测到遗器强化按钮")
                if error:
                    logger.error(error)
                    return error

                # calculate the center of the word "Enhance"
                enhance_word_center_x, enhance_word_center_y = self.get_xy_center(location_results["Enhance"])
                pg.click(enhance_word_center_x, enhance_word_center_y)
                await asyncio.sleep(0.5)

                # screenshot again
                screenshot_result = screenshot_model.predict(window_info)
                ocr_result = ocr_model.predict(screenshot_result)
                location_results = self.find_words_location(ocr_result, ["Enhance", "Auto-Add"])

                error = validate_none(location_results.get("Enhance", None),
                                      "未检测到遗器强化按钮")
                if error:
                    logger.error(error)
                    return error

                error = validate_none(location_results.get("Auto-Add", None),
                                      "未检测到遗器自动增加按钮")
                if error:
                    logger.error(error)
                    return error

                enhance_word_center_x, enhance_word_center_y = self.get_xy_center(location_results["Enhance"])
                auto_add_word_center_x, auto_add_word_center_y = self.get_xy_center(location_results["Auto-Add"])

                pg.click(auto_add_word_center_x, auto_add_word_center_y)
                await asyncio.sleep(0.2)
                pg.click(enhance_word_center_x, enhance_word_center_y)
                await asyncio.sleep(2)

                keyboard_model.predict(Key.esc)
                await asyncio.sleep(1)
                keyboard_model.predict(Key.esc)
                await asyncio.sleep(2)

            return StageResult(success=True, data={
                'next_relic': False
            })

        except StageResultNotFoundException as e:
            logger.exception(e.message)
            return StageResult(success=False, data=None, error=e.message)
        except ModelNotFoundException as e:
            logger.exception(e.message)
            return StageResult(success=False, data=None, error=e.message)
        except Exception as e:
            logger.exception(f"遗器强化阶段异常")
            return StageResult(success=False, data=None, error=str(e))

    def find_words_location(self, ocr_data: Union[List[Union[None, List[List], List]], List], words: List[str]) -> Dict[
        str, List[List]]:
        result = {}
        for detection in ocr_data:
            for t in detection:
                box, detail = t
                if detail[0] in words:
                    result[detail[0]] = box

        return result

    def get_xy_center(self, locations: List[List]) -> Tuple[int, int]:
        x_center = (locations[0][0] + locations[2][0]) / 2
        y_center = (locations[0][1] + locations[2][1]) / 2

        return x_center, y_center
