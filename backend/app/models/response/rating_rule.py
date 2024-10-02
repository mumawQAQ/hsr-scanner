from pydantic import BaseModel, ConfigDict

from app.models.common.rating_rule import RatingRuleSubStats


class RatingRuleIds(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    template_id: str


class RatingRule(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    template_id: str
    set_names: list[str]
    valuable_mains: dict[str, list[str]]
    valuable_subs: list[RatingRuleSubStats]
    fit_characters: list[str]


class FormattedRatingRule(BaseModel):
    valuable_mains: list[str]
    valuable_subs: list[RatingRuleSubStats]
    top_4_valuable_subs: list[RatingRuleSubStats]
    fit_characters: list[str]
