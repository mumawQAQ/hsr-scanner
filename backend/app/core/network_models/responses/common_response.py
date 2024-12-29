from typing import TypeVar, Generic

from pydantic import BaseModel

T = TypeVar("T")


class ErrorResponse(BaseModel):
    status: str
    message: str


class SuccessResponse(BaseModel, Generic[T]):
    status: str
    data: T
