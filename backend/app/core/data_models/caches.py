from typing import ClassVar

from pydantic import BaseModel


class CachedDiscardIconPosition(BaseModel):
    name: ClassVar[str] = "cached_discard_icon_position"
    x: int
    y: int
