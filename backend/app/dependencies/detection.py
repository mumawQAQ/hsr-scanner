import asyncio
import os

import cv2
import numpy as np
import torch
from ultralytics import YOLO

from app.dependencies.global_state import GlobalState
from app.logging_config import logger
from app.models.yolo_box import YoloBox, get_yolo_cls

# path to the yolo model, should be in the parent directory
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'yolo_model', 'best.pt')


class Detection:
    def __init__(self, global_state: GlobalState):
        # check whether the model file exists
        if not os.path.exists(MODEL_PATH):
            logger.error("yolo模型文件不存在")
            raise FileNotFoundError("yolo模型文件不存在")

        # Load the YOLO model
        model = YOLO(MODEL_PATH)
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = model.to(device)

        self.global_state = global_state
        self.prev_screen = None

    def destroy(self):
        self.model.close()

    async def detect_objects(self):
        logger.info("开始检测匹配模型")
        while True:
            if not self.global_state.scan_state:
                await asyncio.sleep(0.1)
                continue

            # wait for the screen to be captured
            if self.global_state.screen_rgb is None:
                await asyncio.sleep(0.1)
                continue

            # only detect when the screen changes
            if np.array_equal(self.prev_screen, self.global_state.screen_rgb):
                await asyncio.sleep(0.1)
                continue

            self.prev_screen = self.global_state.screen_rgb
            self.global_state.yolo_boxes = []

            # Resize for YOLO model
            img_det = cv2.resize(self.global_state.screen_rgb, (640, 640))

            # Perform object detection
            result = self.model.predict(source=img_det, imgsz=640, conf=0.8, save=False, verbose=False)
            boxes = result[0].boxes.xywhn if len(result) > 0 else []
            classes = result[0].boxes.cls if len(result) > 0 else []

            for box, cls in zip(boxes, classes):
                x_center, y_center, width, height = box[:4]
                cur_yolo_box = YoloBox(
                    x_center,
                    y_center,
                    width,
                    height,
                    cls=get_yolo_cls(self.model.names[int(cls)]),
                    w=self.global_state.window['width'],
                    h=self.global_state.window['height']
                )
                self.global_state.yolo_boxes.append(cur_yolo_box)

            if self.global_state.yolo_boxes:
                logger.info(f"检测到[{[str(box) for box in self.global_state.yolo_boxes]}]")

            await asyncio.sleep(0.1)
