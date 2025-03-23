from enum import Enum
from typing import Optional, Union, Dict, Any

import numpy as np
from pydantic import BaseModel


class IconMatcherInput(BaseModel):
    image: np.ndarray
    icon_name: str
    threshold: float
    scale: Optional[float]

    class Config:
        arbitrary_types_allowed = True


class IconMatcherOutput(BaseModel):
    x_center: int
    y_center: int

    width: float
    height: float
    left: float
    top: float


class WindowInfoOutput(BaseModel):
    width: int
    height: int
    left: int
    top: int


class RelicMatcherInputType(Enum):
    RELIC_TITLE = "relic_title"
    RELIC_SUB_STAT = "relic-sub-stat"
    RELIC_MAIN_STAT = "relic-main-stat"


class RelicMatcherInput(BaseModel):
    type: RelicMatcherInputType
    data: Union[str, Dict[str, Any]]
