from pydantic import BaseModel, ConfigDict


class CreateRatingTemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    author: str
    in_use: bool


class GetRatingTemplateResponse(CreateRatingTemplateResponse):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    author: str
    in_use: bool
