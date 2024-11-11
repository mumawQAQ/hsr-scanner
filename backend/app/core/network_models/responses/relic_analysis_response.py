from typing import List

from pydantic import BaseModel


class RelicScoreResponse(BaseModel):
    score: float
    characters: List[str]
    type: str
