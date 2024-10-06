from pydantic import BaseModel

from app.models.common.rating_rule import RatingRuleSubStats


class CreateRatingRule(BaseModel):
    template_id: str
    rule_id: str


class UpdateRatingRule(BaseModel):
    id: str
    set_names: list[str]
    valuable_mains: dict[str, list[str]]
    valuable_subs: list[RatingRuleSubStats]
    fit_characters: list[str]


class ImportRatingRule(BaseModel):
    qr_code: str
