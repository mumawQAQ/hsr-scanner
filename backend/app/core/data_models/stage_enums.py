from enum import Enum


class GameRecognitionStage(str, Enum):
    SCREENSHOT = "screenshot"
    DETECTION = "detection"
    OCR = "ocr"
    RELIC_ANALYSIS = "relic_analysis"
    RELIC_DISCARD = "relic_discard"
