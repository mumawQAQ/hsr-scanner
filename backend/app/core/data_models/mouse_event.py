from enum import Enum
from typing import Optional

from pydantic import BaseModel


class MouseEventType(Enum):
    MOVE_TO = "move to"
    CLICK = "click"


class MouseModelInput(BaseModel):
    event_type: MouseEventType
    x: Optional[int] = None
    y: Optional[int] = None
