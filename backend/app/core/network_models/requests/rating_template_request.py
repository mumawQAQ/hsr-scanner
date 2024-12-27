from pydantic import BaseModel


class CreateRatingTemplateRequest(BaseModel):
    name: str
    description: str
    author: str


class DeleteRatingTemplateRequest(BaseModel):
    template_id: int
