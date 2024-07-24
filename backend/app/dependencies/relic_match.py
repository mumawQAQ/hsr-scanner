import json
import os
from typing import Optional

from app.logging_config import logger
from app.models.relic_info import RelicSubStat, RelicMainStat, RelicTitle

RELIC_DATA_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'relic')
RELIC_SETS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_sets.json')
RELIC_MAIN_STATS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_main_stats.json')
RELIC_SUB_STATS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_sub_stats.json')
RELIC_INNER_PARTS = ['head', 'hand', 'body', 'feet']


class RelicMatch:
    def __init__(self):
        self.relic_parts = {}
        self.relic_main_stats = {}
        self.relic_sub_stats = {}
        try:
            # init the relic parts
            with open(RELIC_SETS_FILE, 'r', encoding='utf-8') as f:
                relic_sets = json.load(f)
                for relic_set_name in relic_sets:
                    # an outer relic set should contain head, hand, body, feet
                    if not relic_sets[relic_set_name]['isInner']:
                        parts = relic_sets[relic_set_name]['parts']
                        for part in RELIC_INNER_PARTS:
                            part_model = {
                                'set_name': relic_set_name,
                                'part': part
                            }

                            self.relic_parts[parts[part]] = part_model
        except Exception as e:
            logger.error(f"读取遗器部位数据失败: {e}")
            raise e

        try:
            # init the relic main stats
            with open(RELIC_MAIN_STATS_FILE, 'r', encoding='utf-8') as f:
                self.relic_main_stats = json.load(f)
        except Exception as e:
            logger.error(f"读取遗器主属性数据失败: {e}")
            raise e

        try:
            # init the relic sub stats
            with open(RELIC_SUB_STATS_FILE, 'r', encoding='utf-8') as f:
                self.relic_sub_stats = json.load(f)
        except Exception as e:
            logger.error(f"读取遗器副属性数据失败: {e}")
            raise e

    def match_relic_part(self, relic_title: str) -> Optional[RelicTitle]:
        if relic_title in self.relic_parts:
            matching_result = RelicTitle(title=relic_title, set_name=self.relic_parts[relic_title]['set_name'],
                                         part=self.relic_parts[relic_title]['part'])

            logger.info(f"匹配到遗器部位: {matching_result}")

            return matching_result
        else:
            logger.error(f"未找到对应遗器部位名称: {relic_title}")
            return None

    def match_relic_main_stat(self, relic_main_stat: str, relic_main_stat_val: str, relic_main_stat_val_num: float) -> \
            Optional[RelicMainStat]:

        if relic_main_stat in self.relic_main_stats:

            base = self.relic_main_stats[relic_main_stat]['base']
            step = self.relic_main_stats[relic_main_stat]['step']

            # calculate the level and enhance level
            level = round((relic_main_stat_val_num - base) / step)
            enhance_level = level // 3

            matching_result = RelicMainStat(name=relic_main_stat, number=relic_main_stat_val, level=level,
                                            enhance_level=enhance_level)

            logger.info(f"匹配到遗器主属性: {matching_result}")

            return matching_result

        else:
            logger.error(f"未找到对应遗器主属性名称: {relic_main_stat}")
            return None

    def match_relic_sub_stat(self, relic_sub_stats: dict) -> list[RelicSubStat]:

        matching_result: list[RelicSubStat] = []

        # format the relic sub stats
        for key, value in relic_sub_stats.items():
            if key in self.relic_sub_stats:
                matching_scores = self.relic_sub_stats[key]
                if value in matching_scores:
                    scores = matching_scores[value]
                    if type(scores) is not list:
                        scores = [scores]
                    matching_result.append(RelicSubStat(name=key, number=value, scores=scores))

        if len(matching_result) == 0:
            logger.error(f"未找到对应遗器副属性名称: {relic_sub_stats}")
        else:
            logger.info(f"匹配到遗器副属性: {matching_result}")

        return matching_result
