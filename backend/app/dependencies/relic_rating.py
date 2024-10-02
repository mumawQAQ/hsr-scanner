import asyncio
import json
from collections import defaultdict

from app.constant import RELIC_SETS_FILE, RELIC_STATS_MAPPING, Relic_Sub_Stats_Total_Acquire_Scale, \
    Relic_Sub_Stats_Acquire_Scale
from app.dependencies.global_state import GlobalState
from app.logging_config import logger
from app.models.common.rating_rule import RatingRuleSubStats
from app.models.response.rating_rule import RatingRule, FormattedRatingRule


class RelicRating:
    def __init__(self, global_state: GlobalState):
        self.global_state = global_state
        self.formatted_rating_rules: dict[str, list[FormattedRatingRule]] = {}
        self.relic_parts = {}

        try:
            # init the relic parts
            with open(RELIC_SETS_FILE, 'r', encoding='utf-8') as f:
                relic_sets = json.load(f)

                for relic_set_name, details in relic_sets.items():
                    self.relic_parts[relic_set_name] = details['parts']

        except Exception as e:
            logger.error(f"读取遗器部位数据失败: {e}")
            raise e

    def format_rating_template(self):
        if not self.global_state.rules_in_use_dirty:
            return

        logger.info("检测到模板变更，重新格式化遗器评分模板")
        self.formatted_rating_rules = defaultdict(list)

        if self.global_state.rules_in_use is None:
            logger.info("无可用规则，格式化完成")
            self.global_state.rules_in_use_dirty = False
            return

        rules = [RatingRule.model_validate(rule) for rule in self.global_state.rules_in_use]

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
                        sub_stat=RELIC_STATS_MAPPING[sub_stat.sub_stat],
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

                    self.formatted_rating_rules[self.relic_parts[set_name][main_stat_key]].append(formatted_rule)

                    logger.info(f"格式化遗器评分模板成功: {formatted_rule}")

        logger.info(f"遗器评分模板格式化完成,{self.formatted_rating_rules}")
        self.global_state.rules_in_use_dirty = False

    def calculate_potential_rating(self):
        # get the rules base on the relic info
        rules = self.formatted_rating_rules[self.global_state.relic_info.main_stat.name]
        new_rating = []

        for rule in rules:
            if self.global_state.relic_info.main_stat.name not in rule.valuable_mains:
                continue

            max_enhance_times = 5
            max_probability = 0.25
            max_sub_stat_rating_scale = rule.top_4_valuable_subs[0].rating_scale
            ideal_base_potential_score = sum(sub_stat.rating_scale for sub_stat in rule.top_4_valuable_subs)
            ideal_cur_potential_score = max_sub_stat_rating_scale * self.global_state.relic_info.main_stat.enhance_level
            ideal_remaining_potential_score = max_probability * (
                    max_enhance_times - self.global_state.relic_info.main_stat.enhance_level) * max_sub_stat_rating_scale

            actual_base_potential_score = 0
            actual_exist_remaining_potential_score = 0
            actual_non_exist_remaining_potential_score = 0

            valuable_sub_count = 0
            valuable_sub_sum_rating_scale = 0

            # calculate the base potential score
            for sub_stat in self.global_state.relic_info.sub_stats:
                idx = rule.valuable_subs.index(sub_stat.sub_stat)
                if idx < 0:
                    continue
                valuable_sub_rating_scale = rule.valuable_subs[idx].rating_scale

                valuable_sub_count += 1
                valuable_sub_sum_rating_scale += valuable_sub_rating_scale

                # if the sub stat is speed, it can contain a list of score, we only calculate the max score
                actual_base_potential_score += (valuable_sub_rating_scale * max(sub_stat.score))

            # calculate the possibility of enhancing the existing valuable sub stats
            if valuable_sub_count:
                # if current sub stats is less than 4, means we can only enhance 4 times
                if len(self.global_state.relic_info.sub_stats) < 4:
                    actual_exist_remaining_potential_score = max_probability * 4 * (
                            valuable_sub_sum_rating_scale / valuable_sub_count)
                else:
                    actual_exist_remaining_potential_score = max_probability * (
                            max_enhance_times - self.global_state.relic_info.main_stat.enhance_level) * (
                                                                     valuable_sub_sum_rating_scale / valuable_sub_count)

            # calculate the possibility of non yet existed sub stats to be valuable
            if len(self.global_state.relic_info.sub_stats) < 4:
                remain_valuable_subs = [sub_stat for sub_stat in rule.valuable_subs if
                                        sub_stat.sub_stat not in self.global_state.relic_info.sub_stats]
                cur_total_acquired_scale = Relic_Sub_Stats_Total_Acquire_Scale
                cur_total_possible_acquired_scale = sum([
                    sub_stat.rating_scale * Relic_Sub_Stats_Acquire_Scale[sub_stat.name] for sub_stat in
                    remain_valuable_subs])

                # if the main stat is in the sub stats, we need to subtract the main stat scale
                if self.global_state.relic_info.main_stat.name in Relic_Sub_Stats_Acquire_Scale.keys():
                    cur_total_acquired_scale -= Relic_Sub_Stats_Acquire_Scale[
                        self.global_state.relic_info.main_stat.name]

                # subtract the current sub stats scale
                for sub_stat in self.global_state.relic_info.sub_stats:
                    cur_total_acquired_scale -= Relic_Sub_Stats_Acquire_Scale[sub_stat.name]

                actual_non_exist_remaining_potential_score = cur_total_possible_acquired_scale / cur_total_acquired_scale

            ideal_total = ideal_base_potential_score + ideal_cur_potential_score + ideal_remaining_potential_score
            actual_total = actual_base_potential_score + actual_exist_remaining_potential_score + actual_non_exist_remaining_potential_score

            score = actual_total / ideal_total
            logger.error(f"遗器潜力分计算完成: {score}")
            logger.error(f"遗器适用角色: {rule.fit_characters}")

        self.global_state.relic_rating = new_rating

    def calculate_actual_rating(self):
        pass

    async def get_relic_rating(self):
        logger.info("开始获取遗器评分")
        while True:
            try:
                self.format_rating_template()

                if self.global_state.relic_info is not None:
                    if self.global_state.relic_info.main_stat.level < 15:
                        # if the relic info level is less than 15, calculate the potential rating
                        self.calculate_potential_rating()
                    else:
                        # if the relic info level is 15, calculate the actual rating
                        pass
                await asyncio.sleep(0.1)
            except Exception as e:
                logger.error(f"获取遗器评分失败: {e}")
                await asyncio.sleep(1)
