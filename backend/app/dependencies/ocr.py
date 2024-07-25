import asyncio

import cv2
from paddleocr import PaddleOCR

from app.dependencies.global_state import GlobalState
from app.dependencies.relic_match import RelicMatch
from app.logging_config import logger
from app.models.yolo_box import YoloCls


class OCR:
    def __init__(self, global_state: GlobalState):
        self.reader = PaddleOCR(use_angle_cls=True, lang='ch', show_log=False)
        self.global_state = global_state
        self.relic_match = RelicMatch()

    @staticmethod
    def __extract_text_from_main_sub_ocr_result__(ocr_result: list):
        extracted_texts = []
        # Loop through the outer list
        for item in ocr_result:
            # Each 'item' is a list containing sublist where the text is in a tuple as the last element
            for inner_item in item:
                # The text is the first element of the last tuple
                text = inner_item[-1][0]
                extracted_texts.append(text.replace(' ', '').strip())

        return extracted_texts

    @staticmethod
    def __extract_text_from_title_ocr_result__(ocr_result: list):
        extracted_texts = []
        # Iterate over the nested list
        for item in ocr_result:
            # Extract the text from the nested list
            extracted_texts.append(item[0][0].replace(' ', '').strip())

        return extracted_texts

    @staticmethod
    def __format_relic_title__(self, relic_title_ocr_result: list):
        # format the relic title
        # example: [[('铁骑的摧坚铁腕', 0.9655791521072388)]]
        extracted_texts = self.__extract_text_from_title_ocr_result__(relic_title_ocr_result)

        if len(extracted_texts) == 0:
            logger.error(f"未能正确识别遗器标题, 当前OCR结果{relic_title_ocr_result}")
            return None

        return extracted_texts[0]

    @staticmethod
    def __format_relic_main_stat__(self, relic_main_stat_ocr_result: list):

        # format the relic main stat
        # example: [[[[[4.0, 4.0], [72.0, 7.0], [71.0, 37.0], [3.0, 34.0]], ('攻击力', 0.9776865839958191)],
        # [[[304.0, 6.0], [333.0, 6.0], [333.0, 37.0], [304.0, 37.0]], ('56', 0.8175584077835083)]]]
        extracted_texts = self.__extract_text_from_main_sub_ocr_result__(relic_main_stat_ocr_result)

        if len(extracted_texts) != 2:
            logger.error(f"未能正确识别遗器主属性, 当前OCR结果{relic_main_stat_ocr_result}")
            return None

        relic_main_stat = extracted_texts[0]
        relic_main_stat_val = extracted_texts[1]

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
    def __format_relic_sub_stat__(self, relic_sub_stat_ocr_result: list):
        # format the relic sub stat
        # example: [[[[[5.0, 3.0], [58.0, 3.0], [58.0, 24.0], [5.0, 24.0]], ('防御力', 0.9971581101417542)],
        # [[[307.0, 4.0], [332.0, 4.0], [332.0, 24.0], [307.0, 24.0]], ('21', 0.9996477365493774)],
        # [[[3.0, 36.0], [77.0, 38.0], [76.0, 56.0], [3.0, 54.0]], ('效果抵抗', 0.9983899593353271)],
        # [[[283.0, 36.0], [333.0, 36.0], [333.0, 57.0], [283.0, 57.0]], ('4.3%', 0.9653499722480774)],
        # [[[5.0, 70.0], [76.0, 70.0], [76.0, 86.0], [5.0, 86.0]], ('击破特攻', 0.9561224579811096)],
        # [[[283.0, 68.0], [333.0, 68.0], [333.0, 89.0], [283.0, 89.0]], ('5.1%', 0.9625118374824524)]]]

        extracted_texts = self.__extract_text_from_main_sub_ocr_result__(relic_sub_stat_ocr_result)

        min_result_count = 3 * 2
        max_result_count = 4 * 2

        if len(extracted_texts) < min_result_count or len(
                extracted_texts) > max_result_count or len(extracted_texts) % 2 != 0:
            logger.error(f"未能正确识别遗器副属性, 当前OCR结果{relic_sub_stat_ocr_result}")
            return None

        format_result = {}
        for i in range(0, len(extracted_texts), 2):
            key = extracted_texts[i]
            if key in ['生命值', '攻击力', '防御力'] and extracted_texts[i + 1].endswith('%'):
                key += '百分比'

            value = extracted_texts[i + 1].strip().replace(' ', '')
            format_result[key] = value

        return format_result

    def __match_relic_title__(self, relic_title_region):
        # match the relic title
        result = self.reader.ocr(relic_title_region, det=False)

        format_result = self.__format_relic_title__(self, result)
        if format_result is None:
            return None

        logger.info(f"识别到遗器标题: {format_result}")

        matching_result = self.relic_match.match_relic_part(format_result)

        if matching_result is None:
            return None

        return matching_result

    def __match_relic_main_stat__(self, relic_main_stat_region):
        result = self.reader.ocr(relic_main_stat_region)

        format_result = self.__format_relic_main_stat__(self, result)
        if format_result is None:
            return None

        logger.info(f"识别到遗器主属性: [{format_result}]")

        matching_result = self.relic_match.match_relic_main_stat(format_result[0], format_result[1], format_result[2])

        if matching_result is None:
            return None

        return matching_result

    def __match_relic_sub_stat__(self, relic_sub_stat_region):
        result = self.reader.ocr(relic_sub_stat_region)

        format_result = self.__format_relic_sub_stat__(self, result)
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

                cv2.imwrite('test.jpg', self.global_state.screen_rgb)
                cv2.imwrite('test2.jpg', self.global_state.screen_rgb[yolo_boxes[0].y1:yolo_boxes[0].y2,
                                         yolo_boxes[0].x1:yolo_boxes[0].x2])
                cv2.imwrite('test3.jpg', self.global_state.screen_rgb[yolo_boxes[1].y1:yolo_boxes[1].y2,
                                         yolo_boxes[1].x1:yolo_boxes[1].x2])
                cv2.imwrite('test4.jpg', self.global_state.screen_rgb[yolo_boxes[2].y1:yolo_boxes[2].y2,
                                         yolo_boxes[2].x1:yolo_boxes[2].x2])

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

                await asyncio.sleep(0.05)
            except Exception as e:
                logger.error(f"识别遗器信息失败: {e}")
                await asyncio.sleep(0.05)
