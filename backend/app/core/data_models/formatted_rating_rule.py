from typing import List

from pydantic import BaseModel

from app.core.data_models.rating_rule_sub_stats import RatingRuleSubStats


class FormattedRatingRule(BaseModel):
    valuable_mains: List[str]
    valuable_subs: List[RatingRuleSubStats]
    top_4_valuable_subs: List[RatingRuleSubStats]
    fit_characters: List[str]
