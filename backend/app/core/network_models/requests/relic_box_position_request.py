from pydantic import BaseModel

from app.core.data_models.relic_box_position import BoxPosition


class GetRelicBoxPositionRequest(BaseModel):
    type: str


class UpdateRelicBoxPositionRequest(BaseModel):
    type: str
    box: BoxPosition
