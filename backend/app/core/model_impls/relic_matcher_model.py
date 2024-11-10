import json
from enum import Enum
from typing import Any, Dict, Union, Optional, List

from pydantic import BaseModel
from rapidfuzz import process

from app.constant import RELIC_INNER_PARTS, RELIC_OUTER_PARTS, RELIC_STATS_MAPPING
from app.core.data_models.relic_info import RelicTitle, RelicMainStat, RelicSubStat
from app.core.interfaces.model_interface import ModelInterface
from app.logging_config import logger


class RelicMatcherInputType(Enum):
    RELIC_TITLE = "relic_title"
    RELIC_SUB_STAT = "relic-sub-stat"
    RELIC_MAIN_STAT = "relic-main-stat"


class RelicMatcherInput(BaseModel):
    type: RelicMatcherInputType
    data: Union[str, Dict[str, Any]]


class RelicMatcherModel(ModelInterface[RelicMatcherInput, Union[RelicTitle, RelicMainStat, List[RelicSubStat], None]]):
    def __init__(self, relic_sets_path: str, relic_main_stats_path: str, relic_sub_stats_path: str):
        self.relic_parts = {}
        self.relic_main_stats = {}
        self.relic_sub_stats = {}
        self.relic_sets_path = relic_sets_path
        self.relic_main_stats_path = relic_main_stats_path
        self.relic_sub_stats_path = relic_sub_stats_path

    def load(self) -> None:
        try:
            # init the relic parts
            with open(self.relic_sets_path, 'r', encoding='utf-8') as f:
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
            logger.error(f"read relic sets data failed: {e}")
            raise e

        try:
            # init the relic main stats
            with open(self.relic_main_stats_path, 'r', encoding='utf-8') as f:
                self.relic_main_stats = json.load(f)
        except Exception as e:
            logger.error(f"read relic main stats data failed: {e}")
            raise e

        try:
            # init the relic sub stats
            with open(self.relic_sub_stats_path, 'r', encoding='utf-8') as f:
                self.relic_sub_stats = json.load(f)
        except Exception as e:
            logger.error(f"read relic sub stats data failed: {e}")
            raise e

    def predict(self, input_data: RelicMatcherInput) -> Union[RelicTitle, None, RelicMainStat, List[RelicSubStat]]:
        if input_data.type is RelicMatcherInputType.RELIC_TITLE:
            return self.match_relic_part(input_data.data)
        elif input_data.type is RelicMatcherInputType.RELIC_MAIN_STAT:
            return self.match_relic_main_stat(input_data.data['relic_main_stat'],
                                              input_data.data['relic_main_stat_val'])
        elif input_data.type is RelicMatcherInputType.RELIC_SUB_STAT:
            return self.match_relic_sub_stat(input_data.data)

        return None

    def match_relic_part(self, relic_title: str) -> Optional[RelicTitle]:
        fuzz_result = process.extractOne(relic_title, self.relic_parts.keys())
        if fuzz_result is None or fuzz_result[1] < 50:
            logger.error(f"fuzz matching cannot match the relic part: {relic_title}, matching result: {fuzz_result}")
            return None

        relic_title = fuzz_result[0]

        matching_result = RelicTitle(title=relic_title, set_name=self.relic_parts[relic_title]['set_name'],
                                     part=self.relic_parts[relic_title]['part'])

        return matching_result

    def match_relic_main_stat(self, relic_main_stat: str, relic_main_stat_val: str) -> Optional[RelicMainStat]:
        fuzz_main_stat_result = process.extractOne(relic_main_stat, self.relic_main_stats.keys())
        if fuzz_main_stat_result is None or fuzz_main_stat_result[1] < 50:
            logger.error(
                f"fuzz matching cannot match the relic main stat: {relic_main_stat}， matching result: {fuzz_main_stat_result}")
            return None

        main_stat_level_map = self.relic_main_stats[fuzz_main_stat_result[0]]
        # fuzz match the relic main stat value
        fuzz_main_stat_val_result = process.extractOne(relic_main_stat_val, main_stat_level_map.keys())
        if fuzz_main_stat_val_result is None or fuzz_main_stat_val_result[1] < 50:
            logger.error(
                f"fuzz matching cannot match the relic main stat val: {relic_main_stat_val}， matching result: {fuzz_main_stat_val_result}")
            return None

        # calculate the level and enhance level
        level = main_stat_level_map[fuzz_main_stat_val_result[0]]
        enhance_level = level // 3

        chinese_relic_main_stat = RELIC_STATS_MAPPING[fuzz_main_stat_result[0]]

        matching_result = RelicMainStat(name=chinese_relic_main_stat, number=fuzz_main_stat_val_result[0], level=level,
                                        enhance_level=enhance_level)

        return matching_result

    def match_relic_sub_stat(self, relic_sub_stats: dict) -> Optional[List[RelicSubStat]]:

        matching_result: list[RelicSubStat] = []

        # fuzz match the relic sub stats name and value
        for key, value in relic_sub_stats.items():
            fuzz_sub_stat_result = process.extractOne(key, self.relic_sub_stats.keys())
            if fuzz_sub_stat_result is None or fuzz_sub_stat_result[1] < 50:
                logger.error(
                    f"fuzz matching cannot match relic sub stat: {key}，matching result: {fuzz_sub_stat_result}")
                return None

            sub_stat_score_map = self.relic_sub_stats[fuzz_sub_stat_result[0]]
            fuzz_sub_stat_val_result = process.extractOne(value, sub_stat_score_map.keys())
            if fuzz_sub_stat_val_result is None or fuzz_sub_stat_val_result[1] < 50:
                logger.error(
                    f"fuzz matching cannot match relic sub stat val: {value}，matching result: {fuzz_sub_stat_val_result}")
                return None

            scores = sub_stat_score_map[fuzz_sub_stat_val_result[0]]

            if type(scores) is not list:
                scores = [scores]

            chinese_relic_sub_stat = RELIC_STATS_MAPPING[fuzz_sub_stat_result[0]]
            matching_result.append(RelicSubStat(name=chinese_relic_sub_stat, number=value, score=scores))

        return matching_result
