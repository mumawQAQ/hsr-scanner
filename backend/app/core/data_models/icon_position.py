from pydantic import BaseModel


class IconPosition(BaseModel):
    x: int
    y: int
