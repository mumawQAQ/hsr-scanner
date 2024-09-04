from pydantic import BaseModel


class CreateRatingTemplate(BaseModel):
    id: str
    name: str
    description: str
    author: str
