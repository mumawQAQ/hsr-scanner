import json
from collections import defaultdict

from loguru import logger

from app.constant import RELIC_SETS_FILE, RELIC_STATS_MAPPING
from app.core.data_models.formatted_rating_rule import FormattedRatingRule
from app.core.data_models.rating_rule_sub_stats import RatingRuleSubStats
from app.core.network_models.responses.rating_rule_response import GetRatingRuleResponse
from app.core.singleton import singleton


@singleton
class Formatter:
    def __init__(self):
        self.relic_parts = {}

        try:
            # init the relic parts
            with open(RELIC_SETS_FILE, 'r', encoding='utf-8') as f:
                relic_sets = json.load(f)

                for relic_set_name, details in relic_sets.items():
                    self.relic_parts[relic_set_name] = details['parts']

        except Exception as e:
            logger.error(f"reading relic set failed: {e}")
            raise e

    def format_rating_template(self, rules):
        formatted_rating_rules = defaultdict(list)

        if not rules:
            return {}

        rules = [GetRatingRuleResponse.model_validate(rule) for rule in rules]

        for rule in rules:
            # check if the rule is valid
            if not rule.set_names or not rule.fit_characters or not rule.valuable_mains or not rule.valuable_subs:
                continue

            for main_stat_key, valuable_mains in rule.valuable_mains.items():
                """
                {   
                    main_stat_key: [valuable_mains],
                    "hand": ["HP", "ATK"], -> this is valid since it contains valuable_mains, so we process it
                    "head": [] -> this is invalid since it does not contain valuable_mains, so we skip it
                }
                """
                if not valuable_mains:
                    continue

                for set_name in rule.set_names:
                    if main_stat_key not in self.relic_parts[set_name]:
                        continue

                    chinese_valuable_mains = [RELIC_STATS_MAPPING[main_stat_key] for main_stat_key in valuable_mains]
                    chinese_valuable_subs = [RatingRuleSubStats(
                        name=RELIC_STATS_MAPPING[sub_stat.name],
                        rating_scale=sub_stat.rating_scale
                    ) for sub_stat in rule.valuable_subs]
                    chinese_top_4_valuable_subs = sorted(chinese_valuable_subs, reverse=True)[:4]

                    # convert ths stats to chinese
                    formatted_rule = FormattedRatingRule(
                        valuable_mains=chinese_valuable_mains,
                        valuable_subs=chinese_valuable_subs,
                        top_4_valuable_subs=chinese_top_4_valuable_subs,
                        fit_characters=rule.fit_characters
                    )

                    formatted_rating_rules[self.relic_parts[set_name][main_stat_key]].append(formatted_rule)

                    logger.info(f"formatting relic rating template success: {formatted_rule}")

        return formatted_rating_rules
