import asyncio
import base64
import os
import re

import cv2
import numpy as np
import pytesseract

from app.dependencies.global_state import GlobalState
from app.dependencies.img_preprocess import pp_relic_title_img, pp_relic_main_img, pp_relic_sub_img
from app.dependencies.relic_match import RelicMatch
from app.logging_config import logger
from app.models.relic_info import RelicInfo, RelicImg
from app.models.yolo_box import YoloCls

EASYOCR_MODEL = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'easy_ocr_model')
CUSTOM_CONFIG = r'--oem 3 --psm 6'


class OCR:
    def __init__(self, global_state: GlobalState):
        self.global_state = global_state
        self.relic_match = RelicMatch()

    @staticmethod
    def __format_relic_title__(self, relic_title_ocr_result: str):
        # format the relic title
        extracted_texts = ''.join(relic_title_ocr_result)
        extracted_texts = re.sub(r"[^a-zA-Z- ']", "", extracted_texts)

        if len(extracted_texts) == 0:
            logger.error(f"未能正确识别遗器标题, 当前OCR结果{relic_title_ocr_result}")
            return None

        return extracted_texts

    @staticmethod
    def __format_relic_main_stat__(self, relic_main_stat_name_ocr_result: str,
                                   relic_main_stat_val_ocr_result: str) -> [str, str]:

        # format the relic main stat
        if len(relic_main_stat_name_ocr_result) < 1:
            logger.error(f"未能正确识别遗器主属性名称, 当前OCR结果{relic_main_stat_name_ocr_result}")
            return None

        if len(relic_main_stat_val_ocr_result) < 1:
            logger.error(f"未能正确识别遗器主属性数值, 当前OCR结果{relic_main_stat_val_ocr_result}")
            return None

        # trim all the spaces
        relic_main_stat = relic_main_stat_name_ocr_result.strip().replace(' ', '')
        relic_main_stat_val = relic_main_stat_val_ocr_result.strip().replace(' ', '')

        # value can be a number or percentage % in the end
        if relic_main_stat in ['HP', 'ATK', 'DEF'] and relic_main_stat_val.endswith('%'):
            relic_main_stat += 'Percentage'

        return [relic_main_stat, relic_main_stat_val]

    @staticmethod
    def __format_relic_sub_stat__(self, relic_sub_stat_name_ocr_result: str, relic_sub_stat_val_ocr_result: str):
        relic_sub_stat_name_ocr_result_list = re.split(r'\n+', relic_sub_stat_name_ocr_result.strip())
        relic_sub_stat_val_ocr_result_list = re.split(r'\n+', relic_sub_stat_val_ocr_result.strip())

        # format the relic sub stat
        min_result_count = 3
        max_result_count = 4

        if len(relic_sub_stat_name_ocr_result_list) < min_result_count or len(
                relic_sub_stat_name_ocr_result_list) > max_result_count:
            logger.error(f"未能正确识别遗器副属性名称, 当前OCR结果{relic_sub_stat_name_ocr_result_list}")
            return None

        if len(relic_sub_stat_val_ocr_result_list) < min_result_count or len(
                relic_sub_stat_val_ocr_result_list) > max_result_count:
            logger.error(f"未能正确识别遗器副属性数值, 当前OCR结果{relic_sub_stat_val_ocr_result_list}")
            return None

        if len(relic_sub_stat_name_ocr_result_list) != len(relic_sub_stat_val_ocr_result_list):
            logger.error(
                f"遗器副属性名称和数值数量不匹配, 当前OCR结果{relic_sub_stat_name_ocr_result_list}, {relic_sub_stat_val_ocr_result_list}")
            return None

        format_result = {}
        for name, val in zip(relic_sub_stat_name_ocr_result_list, relic_sub_stat_val_ocr_result_list):
            format_name = name.strip().replace(' ', '')
            format_val = val.strip().replace(' ', '')
            if format_name in ['HP', 'ATK', 'DEF'] and format_val.endswith('%'):
                format_name += 'Percentage'
            format_result[format_name] = format_val

        return format_result

    def __match_relic_title__(self, relic_title_region):
        # match the relic title
        result = pytesseract.image_to_string(relic_title_region, lang='eng', config=CUSTOM_CONFIG)

        format_result = self.__format_relic_title__(self, result)
        if format_result is None:
            return None

        logger.info(f"识别到遗器标题: {format_result}")

        matching_result = self.relic_match.match_relic_part(format_result)

        return matching_result

    def __match_relic_main_stat__(self, relic_main_stat_name_region, relic_main_stat_val_region):
        relic_main_stat_region_name_result = pytesseract.image_to_string(relic_main_stat_name_region, lang='eng',
                                                                         config=CUSTOM_CONFIG)
        relic_main_stat_region_val_result = pytesseract.image_to_string(relic_main_stat_val_region, lang='eng',
                                                                        config=CUSTOM_CONFIG)

        format_result = self.__format_relic_main_stat__(self, relic_main_stat_region_name_result,
                                                        relic_main_stat_region_val_result)
        if format_result is None:
            return None

        logger.info(f"识别到遗器主属性: [{format_result}]")

        matching_result = self.relic_match.match_relic_main_stat(format_result[0], format_result[1])

        return matching_result

    def __match_relic_sub_stat__(self, relic_sub_stat_names_region, relic_sub_stat_vals_region):
        relic_sub_stat_region_names_result = pytesseract.image_to_string(relic_sub_stat_names_region, lang='eng',
                                                                         config=CUSTOM_CONFIG)
        relic_sub_stat_region_vals_result = pytesseract.image_to_string(relic_sub_stat_vals_region, lang='eng',
                                                                        config=CUSTOM_CONFIG)

        format_result = self.__format_relic_sub_stat__(self, relic_sub_stat_region_names_result,
                                                       relic_sub_stat_region_vals_result)
        if format_result is None:
            return []

        logger.info(f"识别到遗器副属性: [{format_result}]")

        matching_result = self.relic_match.match_relic_sub_stat(format_result)

        return matching_result

    def __build_relic_info__(self, relic_title, relic_main_stat, relic_sub_stats):
        if relic_title is not None and relic_main_stat is not None and len(relic_sub_stats) > 0:
            self.global_state.relic_info = RelicInfo(title=relic_title,
                                                     main_stat=relic_main_stat,
                                                     sub_stats=relic_sub_stats)
        else:
            logger.error(f"未能识别到完整遗器信息: {relic_title}, {relic_main_stat}, {relic_sub_stats}")
            self.global_state.relic_info = None

    def __array_to_data_url__(self, image_array):
        if image_array is None:
            return ''
        # Convert the image array to a byte array
        _, buffer = cv2.imencode('.png', image_array)
        byte_array = buffer.tobytes()

        # Encode the byte array to Base64
        base64_string = base64.b64encode(byte_array).decode('utf-8')

        # Create the data URL
        data_url = f"data:image/png;base64,{base64_string}"

        return data_url

    def __build_relic_img__(self, relic_title_array, relic_main_stat_name_region, relic_main_stat_val_region,
                            relic_sub_stats_name_region, relic_sub_stats_val_region):

        # join the relic main stat image
        relic_main_stat_array = np.hstack((relic_main_stat_name_region, relic_main_stat_val_region))
        # join the relic sub stat image
        relic_sub_stats_array = np.hstack((relic_sub_stats_name_region, relic_sub_stats_val_region))

        relic_title_img = self.__array_to_data_url__(relic_title_array)
        relic_main_stat_img = self.__array_to_data_url__(relic_main_stat_array)
        relic_sub_stat_img = self.__array_to_data_url__(relic_sub_stats_array)

        self.global_state.relic_img = RelicImg(title_img=relic_title_img,
                                               main_stat_img=relic_main_stat_img,
                                               sub_stat_img=relic_sub_stat_img)

    async def read_relic_info(self):
        logger.info("开始识别遗器信息")
        while True:
            if not self.global_state.scan_state:
                await asyncio.sleep(0.1)
                continue

            try:
                # wait for the object to be detected
                if self.global_state.yolo_boxes is None or len(self.global_state.yolo_boxes) == 0:
                    await asyncio.sleep(0.1)
                    continue

                yolo_boxes = self.global_state.yolo_boxes

                relic_title = None
                relic_main_stat = None
                relic_sub_stats = []

                relic_title_region = None
                relic_main_stat_name_region = None
                relic_main_stat_val_region = None
                relic_sub_stats_name_region = None
                relic_sub_stats_val_region = None

                for yolo_box in yolo_boxes:
                    if yolo_box.cls == YoloCls.RELIC_TITLE:
                        # pre-process the relic title region
                        relic_title_region = pp_relic_title_img(self.global_state.screen_rgb,
                                                                yolo_box.x1, yolo_box.y1, yolo_box.x2, yolo_box.y2)

                        relic_title = self.__match_relic_title__(
                            relic_title_region
                        )
                    elif yolo_box.cls == YoloCls.RELIC_MAIN_STAT:
                        # pre-process the relic main stat region
                        relic_main_stat_name_region, relic_main_stat_val_region = pp_relic_main_img(
                            self.global_state.screen_rgb, yolo_box.x1, yolo_box.y1, yolo_box.x2, yolo_box.y2)
                        relic_main_stat = self.__match_relic_main_stat__(
                            relic_main_stat_name_region, relic_main_stat_val_region
                        )
                    elif yolo_box.cls == YoloCls.RELIC_SUB_STAT:
                        # pre-process the relic sub stat region
                        relic_sub_stats_name_region, relic_sub_stats_val_region = pp_relic_sub_img(
                            self.global_state.screen_rgb, yolo_box.x1, yolo_box.y1, yolo_box.x2, yolo_box.y2
                        )
                        relic_sub_stats = self.__match_relic_sub_stat__(
                            relic_sub_stats_name_region, relic_sub_stats_val_region
                        )

                self.__build_relic_info__(relic_title, relic_main_stat, relic_sub_stats)
                self.__build_relic_img__(relic_title_region, relic_main_stat_name_region, relic_main_stat_val_region,
                                         relic_sub_stats_name_region, relic_sub_stats_val_region)

                await asyncio.sleep(0.1)
            except Exception as e:
                logger.error(f"识别遗器信息失败: {e}")
                await asyncio.sleep(0.1)
