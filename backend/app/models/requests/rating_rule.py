from pydantic import BaseModel

from app.models.common.rating_rule import RatingRulePart, RatingRuleSubStats


class CreateRatingRule(BaseModel):
    template_id: str
    rule_id: str


class UpdateRatingRule(BaseModel):
    id: str
    template_id: str
    set_names: list[str]
    part_names: dict[str, RatingRulePart]
    valuable_subs: list[RatingRuleSubStats]
    fit_characters: list[str]
