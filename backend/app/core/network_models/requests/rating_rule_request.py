from pydantic import BaseModel

from app.core.data_models.rating_rule_sub_stats import RatingRuleSubStats


class CreateRatingRuleRequest(BaseModel):
    template_id: str
    rule_id: str


class UpdateRatingRuleRequest(BaseModel):
    id: str
    set_names: list[str]
    valuable_mains: dict[str, list[str]]
    valuable_subs: list[RatingRuleSubStats]
    fit_characters: list[str]


class ImportRatingRuleRequest(BaseModel):
    qr_code: str
