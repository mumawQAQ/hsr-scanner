from pydantic import BaseModel


class BoxPosition(BaseModel):
    x: int
    y: int
    w: int
    h: int
