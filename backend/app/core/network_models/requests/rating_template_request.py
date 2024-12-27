from pydantic import BaseModel


class CreateRatingTemplateRequest(BaseModel):
    name: str
    description: str
    author: str
