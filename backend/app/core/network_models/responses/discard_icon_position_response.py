from pydantic import BaseModel, ConfigDict

from app.core.data_models.icon_position import IconPosition


class GetDiscardIconPositionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    key: str
    value: IconPosition
