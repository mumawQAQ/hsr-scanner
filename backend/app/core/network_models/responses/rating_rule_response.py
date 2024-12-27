from pydantic import BaseModel, ConfigDict

from app.core.data_models.rating_rule_sub_stats import RatingRuleSubStats


class RatingRuleIdsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    template_id: str


class CreateRatingRuleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    template_id: int
    set_names: list[str]
    valuable_mains: dict[str, list[str]]
    valuable_subs: list[RatingRuleSubStats]
    fit_characters: list[str]


class GetRatingRuleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    template_id: int
    set_names: list[str]
    valuable_mains: dict[str, list[str]]
    valuable_subs: list[RatingRuleSubStats]
