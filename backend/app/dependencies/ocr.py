import asyncio
import re

import cv2
import easyocr

from app.dependencies.global_state import GlobalState
from app.dependencies.relic_match import RelicMatch
from app.logging_config import logger
from app.models.yolo_box import YoloCls


class OCR:
    def __init__(self, global_state: GlobalState):
        self.reader = easyocr.Reader(['en'])
        self.global_state = global_state
        self.relic_match = RelicMatch()

    @staticmethod
    def __format_relic_title__(self, relic_title_ocr_result: list):
        # format the relic title
        # example: ['1', "Musketeer's", 'Rivets Riding Boots']

        extracted_texts = ''.join(relic_title_ocr_result)
        extracted_texts = re.sub(r"[^a-zA-Z- ']", "", extracted_texts)

        if len(extracted_texts) == 0:
            logger.error(f"未能正确识别遗器标题, 当前OCR结果{relic_title_ocr_result}")
            return None

        return extracted_texts

    @staticmethod
    def __format_relic_main_stat__(self, relic_main_stat_name_ocr_result: list,
                                   relic_main_stat_val_ocr_result: list) -> [str, str, float]:

        # format the relic main stat
        if len(relic_main_stat_name_ocr_result) < 1:
            logger.error(f"未能正确识别遗器主属性名称, 当前OCR结果{relic_main_stat_name_ocr_result}")
            return None

        if len(relic_main_stat_val_ocr_result) < 1:
            logger.error(f"未能正确识别遗器主属性数值, 当前OCR结果{relic_main_stat_val_ocr_result}")
            return None

        relic_main_stat = ''.join(relic_main_stat_name_ocr_result)
        relic_main_stat_val = ''.join(relic_main_stat_val_ocr_result)

        # trim all the spaces
        relic_main_stat = relic_main_stat.strip().replace(' ', '')
        relic_main_stat_val = relic_main_stat_val.strip().replace(' ', '')

        # value can be a number or percentage % in the end
        if relic_main_stat in ['HP', 'ATK', 'DEF'] and relic_main_stat_val.endswith('%'):
            relic_main_stat += 'Percentage'

        if relic_main_stat_val.endswith('%'):
            relic_main_stat_val_num = float(relic_main_stat_val[:-1]) / 100
        else:
            relic_main_stat_val_num = float(relic_main_stat_val)

        return [relic_main_stat, relic_main_stat_val, relic_main_stat_val_num]

    @staticmethod
    def __format_relic_sub_stat__(self, relic_sub_stat_name_ocr_result: list, relic_sub_stat_val_ocr_result: list):
        # format the relic sub stat
        min_result_count = 3
        max_result_count = 4

        if len(relic_sub_stat_name_ocr_result) < min_result_count or len(
                relic_sub_stat_name_ocr_result) > max_result_count:
            logger.error(f"未能正确识别遗器副属性名称, 当前OCR结果{relic_sub_stat_name_ocr_result}")
            return None

        if len(relic_sub_stat_val_ocr_result) < min_result_count or len(
                relic_sub_stat_val_ocr_result) > max_result_count:
            logger.error(f"未能正确识别遗器副属性数值, 当前OCR结果{relic_sub_stat_val_ocr_result}")
            return None

        if len(relic_sub_stat_name_ocr_result) != len(relic_sub_stat_val_ocr_result):
            logger.error(
                f"遗器副属性名称和数值数量不匹配, 当前OCR结果{relic_sub_stat_name_ocr_result}, {relic_sub_stat_val_ocr_result}")
            return None

        format_result = {}
        for name, val in zip(relic_sub_stat_name_ocr_result, relic_sub_stat_val_ocr_result):
            format_name = name.strip().replace(' ', '')
            format_val = val.strip().replace(' ', '')
            if format_name in ['HP', 'ATK', 'DEF'] and format_val.endswith('%'):
                format_name += 'Percentage'
            format_result[format_name] = format_val

        return format_result

    def __match_relic_title__(self, relic_title_region):
        # resize the region to 10 times to get a better OCR result
        relic_title_region = cv2.resize(relic_title_region, None, fx=10, fy=10, interpolation=cv2.INTER_CUBIC)

        # match the relic title
        result = self.reader.readtext(relic_title_region, detail=0)

        format_result = self.__format_relic_title__(self, result)
        if format_result is None:
            return None

        logger.info(f"识别到遗器标题: {format_result}")

        matching_result = self.relic_match.match_relic_part(format_result)

        if matching_result is None:
            return None

        return matching_result

    def __match_relic_main_stat__(self, relic_main_stat_region):
        # resize the region to 10 times to get a better OCR result
        relic_main_stat_region = cv2.resize(relic_main_stat_region, None, fx=10, fy=10, interpolation=cv2.INTER_CUBIC)

        # crop the image to two parts, one for the main stat name and one for the main stat value
        relic_main_stat_region_name = relic_main_stat_region[:, : int(relic_main_stat_region.shape[1] * 0.8)]
        relic_main_stat_region_val = relic_main_stat_region[:, int(relic_main_stat_region.shape[1] * 0.8):]

        relic_main_stat_region_name_result = self.reader.readtext(relic_main_stat_region_name, detail=0)
        relic_main_stat_region_val_result = self.reader.readtext(relic_main_stat_region_val, detail=0)

        format_result = self.__format_relic_main_stat__(self, relic_main_stat_region_name_result,
                                                        relic_main_stat_region_val_result)
        if format_result is None:
            return None

        logger.info(f"识别到遗器主属性: [{format_result}]")

        matching_result = self.relic_match.match_relic_main_stat(format_result[0], format_result[1], format_result[2])

        if matching_result is None:
            return None

        return matching_result

    def __match_relic_sub_stat__(self, relic_sub_stat_region):
        # resize the region to 10 times to get a better OCR result
        # relic_sub_stat_region = cv2.resize(relic_sub_stat_region, None, fx=5, fy=5, interpolation=cv2.INTER_CUBIC)

        # crop the image to two parts, one for the main stat name and one for the main stat value
        relic_sub_stat_region_names = relic_sub_stat_region[:, : int(relic_sub_stat_region.shape[1] * 0.8)]
        relic_sub_stat_region_vals = relic_sub_stat_region[:, int(relic_sub_stat_region.shape[1] * 0.8):]

        relic_sub_stat_region_names_result = self.reader.readtext(relic_sub_stat_region_names, detail=0)
        relic_sub_stat_region_vals_result = self.reader.readtext(relic_sub_stat_region_vals, detail=0)

        format_result = self.__format_relic_sub_stat__(self, relic_sub_stat_region_names_result,
                                                       relic_sub_stat_region_vals_result)
        if format_result is None:
            return None

        logger.info(f"识别到遗器副属性: [{format_result}]")

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

                for yolo_box in yolo_boxes:
                    if yolo_box.cls == YoloCls.RELIC_TITLE:
                        self.__match_relic_title__(
                            self.global_state.screen_rgb[yolo_box.y1:yolo_box.y2, yolo_box.x1:yolo_box.x2]
                        )
                    elif yolo_box.cls == YoloCls.RELIC_MAIN_STAT:
                        self.__match_relic_main_stat__(
                            self.global_state.screen_rgb[yolo_box.y1:yolo_box.y2, yolo_box.x1:yolo_box.x2]
                        )
                    elif yolo_box.cls == YoloCls.RELIC_SUB_STAT:
                        self.__match_relic_sub_stat__(
                            self.global_state.screen_rgb[yolo_box.y1:yolo_box.y2, yolo_box.x1:yolo_box.x2]
                        )

                await asyncio.sleep(0)
            except Exception as e:
                logger.error(f"识别遗器信息失败: {e}")
                await asyncio.sleep(0)
