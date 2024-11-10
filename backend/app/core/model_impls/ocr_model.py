from typing import Any

from paddleocr import PaddleOCR

from app.core.interfaces.model_interface import ModelInterface


class OCRModel(ModelInterface[Any, Any]):
    """OCR model for text recognition."""

    def __init__(self):
        self.model = None

    def load(self) -> None:
        """Initialize OCR settings if necessary."""
        self.model = PaddleOCR(lang='en', show_log=False)

    def predict(self, input_data: Any) -> Any:
        """Perform OCR on the input data."""
        return self.model.ocr(input_data, cls=False)
