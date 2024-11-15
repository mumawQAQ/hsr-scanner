from pydantic import BaseModel, ConfigDict


class RatingTemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str
    author: str
    in_use: bool
