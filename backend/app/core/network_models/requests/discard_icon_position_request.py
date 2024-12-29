from pydantic import BaseModel


class UpdateDiscardIconPositionRequest(BaseModel):
    x: int
    y: int
