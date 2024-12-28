from pydantic import BaseModel, ConfigDict

from app.core.data_models.relic_box_position import BoxPosition


class GetRelicBoxPositionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    key: str
    value: BoxPosition
