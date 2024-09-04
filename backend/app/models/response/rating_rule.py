from pydantic import BaseModel, ConfigDict

from app.models.common.rating_rule import RatingRulePart, RatingRuleSubStats


class RatingRule(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    template_id: str
    set_names: list[str]
    part_names: dict[str, RatingRulePart]
    valuable_subs: list[RatingRuleSubStats]
    fit_characters: list[str]
