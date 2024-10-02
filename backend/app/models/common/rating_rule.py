from pydantic import BaseModel


class RatingRulePart(BaseModel):
    valuable_main: list[str]
    part_type: str


class RatingRuleSubStats(BaseModel):
    sub_stat: str
    rating_scale: float

    def __lt__(self, other):
        return self.rating_scale < other.rating_scale

    def __eq__(self, other):
        return self.sub_stat == other.sub_stat
