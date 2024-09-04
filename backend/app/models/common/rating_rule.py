from pydantic import BaseModel


class RatingRulePart(BaseModel):
    valuable_main: list[str]
    part_type: str


class RatingRuleSubStats(BaseModel):
    sub_stat: str
    rating_scale: float
