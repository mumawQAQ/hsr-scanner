import json
from typing import Optional

from rapidfuzz import process

from app.constant import RELIC_STATS_MAPPING, RELIC_INNER_PARTS, RELIC_OUTER_PARTS, RELIC_SETS_FILE, \
    RELIC_MAIN_STATS_FILE, RELIC_SUB_STATS_FILE
from app.logging_config import logger
from app.models.relic_info import RelicSubStat, RelicMainStat, RelicTitle


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

        if fuzz_result is None or fuzz_result[1] < 50:
            logger.error(f"模糊匹配未找到对应遗器部位名称: {relic_title}, 匹配结果: {fuzz_result}")
            return None

        relic_title = fuzz_result[0]

        matching_result = RelicTitle(title=relic_title, set_name=self.relic_parts[relic_title]['set_name'],
                                     part=self.relic_parts[relic_title]['part'])

        logger.info(f"匹配到遗器部位: {matching_result}")

        return matching_result

    def match_relic_main_stat(self, relic_main_stat: str, relic_main_stat_val: str) -> Optional[RelicMainStat]:

        # fuzz match the relic main stat
        fuzz_main_stat_result = process.extractOne(relic_main_stat, self.relic_main_stats.keys())
        if fuzz_main_stat_result is None or fuzz_main_stat_result[1] < 50:
            logger.error(f"模糊匹配未找到对应遗器主属性名称: {relic_main_stat}， 匹配结果: {fuzz_main_stat_result}")
            return None

        main_stat_level_map = self.relic_main_stats[fuzz_main_stat_result[0]]
        # fuzz match the relic main stat value
        fuzz_main_stat_val_result = process.extractOne(relic_main_stat_val, main_stat_level_map.keys())
        if fuzz_main_stat_val_result is None or fuzz_main_stat_val_result[1] < 50:
            logger.error(
                f"模糊匹配未找到对应遗器主属性值: {relic_main_stat_val}， 匹配结果: {fuzz_main_stat_val_result}")
            return None

        # calculate the level and enhance level
        level = main_stat_level_map[fuzz_main_stat_val_result[0]]
        enhance_level = level // 3

        chinese_relic_main_stat = RELIC_STATS_MAPPING[fuzz_main_stat_result[0]]

        matching_result = RelicMainStat(name=chinese_relic_main_stat, number=fuzz_main_stat_val_result[0], level=level,
                                        enhance_level=enhance_level)

        logger.info(f"匹配到遗器主属性: {matching_result}")

        return matching_result

    def match_relic_sub_stat(self, relic_sub_stats: dict) -> list[RelicSubStat]:

        matching_result: list[RelicSubStat] = []

        # fuzz match the relic sub stats name and value
        for key, value in relic_sub_stats.items():
            fuzz_sub_stat_result = process.extractOne(key, self.relic_sub_stats.keys())
            if fuzz_sub_stat_result is None or fuzz_sub_stat_result[1] < 50:
                logger.error(f"模糊匹配未找到对应遗器副属性名称: {key}，匹配结果: {fuzz_sub_stat_result}")
                return []

            sub_stat_score_map = self.relic_sub_stats[fuzz_sub_stat_result[0]]
            fuzz_sub_stat_val_result = process.extractOne(value, sub_stat_score_map.keys())
            if fuzz_sub_stat_val_result is None or fuzz_sub_stat_val_result[1] < 50:
                logger.error(f"模糊匹配未找到对应遗器副属性值: {value}，匹配结果: {fuzz_sub_stat_val_result}")
                return []

            scores = sub_stat_score_map[fuzz_sub_stat_val_result[0]]

            if type(scores) is not list:
                scores = [scores]

            chinese_relic_sub_stat = RELIC_STATS_MAPPING[fuzz_sub_stat_result[0]]
            matching_result.append(RelicSubStat(name=chinese_relic_sub_stat, number=value, score=scores))

        logger.info(f"匹配到遗器副属性: {matching_result}")

        return matching_result
