from typing import Any, Optional, Union, List

from paddleocr import PaddleOCR

from app.constant import PADDLE_DET_FOLDER, PADDLE_CLS_FOLDER, PADDLE_REC_FOLDER
from app.core.interfaces.model_interface import ModelInterface


class OCRModel(ModelInterface[Any, Union[List[Union[None, List[List], List]], List]]):
    @staticmethod
    def get_name() -> str:
        return "ocr_model"

    def __init__(self):
        self.model: Optional[PaddleOCR] = None

    def load(self) -> None:
        """Initialize OCR settings if necessary."""
        self.model = PaddleOCR(
            lang='en',
            show_log=False,
            det_model_dir=PADDLE_DET_FOLDER,
            cls_model_dir=PADDLE_CLS_FOLDER,
            rec_model_dir=PADDLE_REC_FOLDER
        )

    def predict(self, input_data: Any) -> Union[List[Union[None, List[List], List]], List]:
        """Perform OCR on the input data."""
        return self.model.ocr(input_data, cls=False)
