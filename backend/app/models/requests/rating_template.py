from pydantic import BaseModel


class CreateRatingTemplate(BaseModel):
    id: str
    name: str
    description: str
    author: str


class RatingRulePart(BaseModel):
    valuable_main: list[str]
    part_type: str


class RatingRuleSubStats(BaseModel):
    sub_stat: str
    rating_scale: float


class CreateRatingRule(BaseModel):
    template_id: str


class UpdateRatingRule(BaseModel):
    template_id: str
    rating_rule_id: str
    set_names: list[str]
    part_names: dict[str, RatingRulePart]
    valuable_sub: list[RatingRuleSubStats]
    fit_characters: list[str]
