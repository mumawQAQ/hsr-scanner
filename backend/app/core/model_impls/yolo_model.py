from typing import Any

import cv2
import numpy as np
import torch
from ultralytics import YOLO

from app.core.interfaces.model_interface import ModelInterface
from app.logging_config import logger


class YOLOModel(ModelInterface[Any, Any]):
    """YOLO model for object detection."""

    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None

    def img_transform(self, img: np.ndarray, x_center: float, y_center: float, width: float, height: float, w: int,
                      h: int) -> np.ndarray:
        x1 = int((x_center - width / 2) * w)
        y1 = int((y_center - height / 2) * h)
        x2 = int((x_center + width / 2) * w)
        y2 = int((y_center + height / 2) * h)
        return img[y1:y2, x1:x2]

    def load(self) -> None:
        """Load the YOLO model."""
        self.model = YOLO(self.model_path)
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(device)
        logger.info(f"YOLO model loaded on device: {device}")

    def predict(self, input_data: Any) -> Any:
        """Perform object detection on the input data."""
        img = input_data['image']
        window_h = input_data['window']['height']
        window_w = input_data['window']['width']

        img_np = np.array(img)
        img_rgb = cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(img_rgb, (640, 640))

        detection_result = self.model.predict(source=img_resized, imgsz=640, conf=0.8, save=False, verbose=False)
        boxes = detection_result[0].boxes.xywhn if len(detection_result) > 0 else []
        classes = detection_result[0].boxes.cls if len(detection_result) > 0 else []

        sub_regions = {}

        for box, cls in zip(boxes, classes):
            x_center, y_center, width, height = box[:4]
            cls = self.model.names[int(cls)]
            sub_region_img = self.img_transform(img_np, x_center, y_center, width, height, window_w, window_h)
            logger.info(
                f"Detected {cls} with x_center: {x_center}, y_center: {y_center}, width: {width}, height: {height}")

            if cls not in sub_regions:
                sub_regions[cls] = sub_region_img

        return sub_regions
