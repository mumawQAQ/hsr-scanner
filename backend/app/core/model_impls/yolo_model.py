from typing import Any

import torch
from loguru import logger
from ultralytics import YOLO

from app.core.interfaces.model_interface import ModelInterface


class YOLOModel(ModelInterface[Any, Any]):
    """YOLO model for object detection."""

    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None

    def load(self) -> None:
        """Load the YOLO model."""
        self.model = YOLO(self.model_path)
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(device)
        logger.info(f"YOLO model loaded on device: {device}")

    def predict(self, input_data: Any) -> Any:
        """Perform object detection on the input data."""
        img_np = input_data['image']
        window_h = input_data['window']['height']
        window_w = input_data['window']['width']

        detection_result = self.model.predict(source=img_np, imgsz=640, conf=0.8, save=False, verbose=False)
        boxes = detection_result[0].boxes.xywhn if len(detection_result) > 0 else []
        classes = detection_result[0].boxes.cls if len(detection_result) > 0 else []

        sub_regions = {}

        for box, cls in zip(boxes, classes):
            x_center, y_center, width, height = box[:4]
            cls = self.model.names[int(cls)]

            # Transform image using original dimensions
            x1 = int((x_center - width / 2) * window_w)
            y1 = int((y_center - height / 2) * window_h)
            x2 = int((x_center + width / 2) * window_w)
            y2 = int((y_center + height / 2) * window_h)

            x_center = int(x_center * window_w)
            y_center = int(y_center * window_h)
            width = int(width * window_w)
            height = int(height * window_h)

            sub_region_img = img_np[y1:y2, x1:x2]

            logger.info(
                f"Detected {cls} with x_center: {x_center}, y_center: {y_center}, width: {width}, height: {height}")

            if cls not in sub_regions:
                sub_regions[cls] = {
                    'image': sub_region_img,
                    'box': {
                        'x_center': x_center,
                        'y_center': y_center,
                        'width': width,
                        'height': height
                    }
                }

        return sub_regions
