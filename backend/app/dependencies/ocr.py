import asyncio
from typing import Optional

import easyocr

from app.dependencies.global_state import GlobalState
from app.logging_config import logging
from app.models.relic_info import RelicTitle
from app.models.yolo_box import YoloCls


class OCR:
    def __init__(self, global_state: GlobalState):
        self.reader = easyocr.Reader(['en'])
        self.global_state = global_state

    def __match_relic_title__(self, relic_title_region) -> Optional[RelicTitle]:
        # match the relic title
        result = self.reader.readtext(relic_title_region, detail=0)
        print(result)
        if len(result) == 0:
            logging.error("未能识别遗器标题")
            return None

        logging.info(f"识别到遗器标题: {result[0]}")
        return RelicTitle(title=result[0])

    def __match_relic_main_stat__(self, relic_main_stat_region):
        result = self.reader.readtext(relic_main_stat_region, detail=0)
        print(result)
        if len(result) == 0:
            logging.error("未能识别遗器主属性")
            return None

        logging.info(f"识别到遗器主属性: [{str(result)}]")

    def __match_relic_sub_stat__(self, relic_sub_stat_region):
        result = self.reader.readtext(relic_sub_stat_region, detail=0)
        print(result)
        if len(result) == 0:
            logging.error("未能识别遗器副属性")
            return None

        logging.info(f"识别到遗器副属性: [{str(result)}]")

    async def read_relic_info(self):
        logging.info("开始识别遗器信息")
        while True:
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
