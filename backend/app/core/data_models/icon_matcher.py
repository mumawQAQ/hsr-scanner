from enum import Enum
from typing import Any

from pydantic import BaseModel


class IconType(Enum):
    DISCARD = "discard"


class IconMatcherInput(BaseModel):
    source_image_bgr: Any  # this should be a numpy array
    icon_type: IconType


class IconMatcherOutput(BaseModel):
    x_center: int
    y_center: int
