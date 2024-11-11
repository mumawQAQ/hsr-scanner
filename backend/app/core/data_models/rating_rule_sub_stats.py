from pydantic import BaseModel


class RatingRuleSubStats(BaseModel):
    name: str
    rating_scale: float

    def __lt__(self, other):
        return self.rating_scale < other.rating_scale

    def __eq__(self, other):
        return self.name == other.name
