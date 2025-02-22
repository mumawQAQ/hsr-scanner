from typing import ClassVar

from pydantic import BaseModel


class CachedDiscardIconPosition(BaseModel):
    name: ClassVar[str] = "cached_discard_icon_position"
    x: int
    y: int


class CachedInventoryEnhanceButtonPosition(BaseModel):
    name: ClassVar[str] = "cached_inventory_enhance_button_position"
    x: int
    y: int


class CachedRelicDetailEnhanceButtonPosition(BaseModel):
    name: ClassVar[str] = "cached_relic_detail_enhance_button_position"
    x: int
    y: int


class CachedAutoAddButtonPosition(BaseModel):
    name: ClassVar[str] = "cached_auto_add_button_position"
    x: int
    y: int
