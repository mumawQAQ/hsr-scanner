import asyncio
from typing import Optional

import cv2
import easyocr

from app.dependencies.global_state import GlobalState
from app.dependencies.relic_match import RelicMatch
from app.logging_config import logger
from app.models.relic_info import RelicTitle
from app.models.yolo_box import YoloCls


class OCR:
    def __init__(self, global_state: GlobalState):
        self.reader = easyocr.Reader(['ch_sim', 'en'])
        self.global_state = global_state
        self.relic_match = RelicMatch()

    @staticmethod
    def __format_relic_main_stat__(relic_main_stat_ocr_result: list):
        relic_main_stat = relic_main_stat_ocr_result[0]
        relic_main_stat_val = relic_main_stat_ocr_result[1]

        # trim all the spaces
        relic_main_stat_val = relic_main_stat_val.strip().replace(' ', '')

        # value can be a number or percentage % in the end
        if relic_main_stat in ['生命值', '攻击力', '防御力'] and relic_main_stat_val.endswith('%'):
            relic_main_stat += '百分比'

        if relic_main_stat_val.endswith('%'):
            relic_main_stat_val_num = float(relic_main_stat_val[:-1]) / 100
        else:
            relic_main_stat_val_num = float(relic_main_stat_val)

        return [relic_main_stat, relic_main_stat_val, relic_main_stat_val_num]

    @staticmethod
    def __format_relic_sub_stat__(relic_sub_stat_ocr_result: list):
        format_result = {}
        for i in range(0, len(relic_sub_stat_ocr_result), 2):
            key = relic_sub_stat_ocr_result[i]
            if key in ['生命值', '攻击力', '防御力'] and relic_sub_stat_ocr_result[i + 1].endswith('%'):
                key += '百分比'

            value = relic_sub_stat_ocr_result[i + 1].strip().replace(' ', '')
            format_result[key] = value

        return format_result

    def __match_relic_title__(self, relic_title_region) -> Optional[RelicTitle]:
        # match the relic title
        result = self.reader.readtext(relic_title_region, detail=0)
        if len(result) == 0:
            logger.error("未能正确识别遗器标题")
            return None

        logger.info(f"识别到遗器标题: {result[0]}")

        matching_result = self.relic_match.match_relic_part(result[0])

        if matching_result is None:
            return None

        return matching_result

    def __match_relic_main_stat__(self, relic_main_stat_region):
        result = self.reader.readtext(relic_main_stat_region, detail=0)
        if len(result) != 2:
            logger.error("未能正确识别遗器主属性")
            return None

        logger.info(f"识别到遗器主属性: [{str(result)}]")

        format_result = self.__format_relic_main_stat__(result)

        matching_result = self.relic_match.match_relic_main_stat(format_result[0], format_result[1], format_result[2])

        if matching_result is None:
            return None

        return matching_result

    def __match_relic_sub_stat__(self, relic_sub_stat_region):
        result = self.reader.readtext(relic_sub_stat_region, detail=0)
        min_result_count = 3 * 2
        max_result_count = 4 * 2

        if len(result) < min_result_count or len(result) > max_result_count or len(result) % 2 != 0:
            logger.error("未能正确识别遗器副属性")
            return None

        logger.info(f"识别到遗器副属性: [{str(result)}]")

        format_result = self.__format_relic_sub_stat__(result)

        matching_result = self.relic_match.match_relic_sub_stat(format_result)

        if matching_result is None:
            return None

        logger.info(f"匹配到遗器副属性: {matching_result}")

    async def read_relic_info(self):
        logger.info("开始识别遗器信息")
        while True:
            try:
                # wait for the object to be detected
                if self.global_state.yolo_boxes is None or len(self.global_state.yolo_boxes) == 0:
                    await asyncio.sleep(0.1)
                    continue

                yolo_boxes = self.global_state.yolo_boxes

                screen_grey = cv2.cvtColor(self.global_state.screen_rgb, cv2.COLOR_RGB2GRAY)

                for yolo_box in yolo_boxes:
                    if yolo_box.cls == YoloCls.RELIC_TITLE:
                        self.__match_relic_title__(
                            screen_grey[yolo_box.y1:yolo_box.y2, yolo_box.x1:yolo_box.x2]
                        )
                    elif yolo_box.cls == YoloCls.RELIC_MAIN_STAT:
                        self.__match_relic_main_stat__(
                            screen_grey[yolo_box.y1:yolo_box.y2, yolo_box.x1:yolo_box.x2]
                        )
                    elif yolo_box.cls == YoloCls.RELIC_SUB_STAT:
                        self.__match_relic_sub_stat__(
                            screen_grey[yolo_box.y1:yolo_box.y2, yolo_box.x1:yolo_box.x2]
                        )

                await asyncio.sleep(0.05)
            except Exception as e:
                logger.error(f"识别遗器信息失败: {e}")
                await asyncio.sleep(0.05)
