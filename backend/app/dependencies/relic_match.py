import json
import os
from typing import Optional

from rapidfuzz import process

from app.logging_config import logger
from app.models.relic_info import RelicSubStat, RelicMainStat, RelicTitle

RELIC_DATA_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'relic')
RELIC_SETS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_sets.json')
RELIC_MAIN_STATS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_main_stats.json')
RELIC_SUB_STATS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_sub_stats.json')
RELIC_INNER_PARTS = ['sphere', 'rope']
RELIC_OUTER_PARTS = ['head', 'hand', 'body', 'feet']

RELIC_STATS_MAPPING = {
    "DEF": "防御",
    "HP": "生命",
    "HPPercentage": "生命百分比",
    "ATK": "攻击",
    "ATKPercentage": "攻击百分比",
    "DEFPercentage": "防御百分比",
    "SPD": "速度",
    "CRITRate": "暴击率",
    "CRITDMG": "暴击伤害",
    "BreakEffect": "击破特攻",
    "EffectHitRate": "效果命中",
    "EffectRes": "效果抵抗",
    "OutgoingHealingBoost": "治疗量加成",
    "EnergyRegenerationRate": "能量回复效率",
    "PhysicalDMGBoost": "物理属性伤害提高",
    "FireDMGBoost": "火属性伤害提高",
    "IceDMGBoost": "冰属性伤害提高",
    "LightningDMGBoost": "雷属性伤害提高",
    "WindDMGBoost": "风属性伤害提高",
    "QuantumDMGBoost": "量子属性伤害提高",
    "ImaginaryDMGBoost": "虚数属性伤害提高",
}


class RelicMatch:
    def __init__(self):
        self.relic_parts = {}
        self.relic_main_stats = {}
        self.relic_sub_stats = {}
        try:
            # init the relic parts
            with open(RELIC_SETS_FILE, 'r', encoding='utf-8') as f:
                relic_sets = json.load(f)

                for relic_set_name, details in relic_sets.items():
                    # Choose the correct parts list based on whether the set is inner or outer.
                    parts_to_use = RELIC_INNER_PARTS if details['isInner'] else RELIC_OUTER_PARTS

                    # Process the parts based on the selected list.
                    for part in parts_to_use:
                        part_model = {
                            'set_name': relic_set_name,
                            'part': part
                        }
                        self.relic_parts[details['parts'][part]] = part_model

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

        # fuzz match the relic title
        fuzz_result = process.extractOne(relic_title, self.relic_parts.keys())

        if fuzz_result is None or fuzz_result[1] < 80:
            logger.error(f"模糊匹配未找到对应遗器部位名称: {relic_title}")
            return None

        relic_title = fuzz_result[0]

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

            chinese_relic_main_stat = RELIC_STATS_MAPPING[relic_main_stat]

            matching_result = RelicMainStat(name=chinese_relic_main_stat, number=relic_main_stat_val, level=level,
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

                    chinese_relic_sub_stat = RELIC_STATS_MAPPING[key]
                    matching_result.append(RelicSubStat(name=chinese_relic_sub_stat, number=value, scores=scores))

        if len(matching_result) == 0:
            logger.error(f"未找到对应遗器副属性名称: {relic_sub_stats}")
        else:
            logger.info(f"匹配到遗器副属性: {matching_result}")

        return matching_result
