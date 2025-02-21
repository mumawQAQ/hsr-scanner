from pydantic import BaseModel


class WindowInfo(BaseModel):
    width: int
    height: int
    left: int
    top: int
