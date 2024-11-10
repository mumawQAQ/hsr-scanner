from pydantic import BaseModel


class CreateRatingTemplateRequest(BaseModel):
    id: str
    name: str
    description: str
    author: str
