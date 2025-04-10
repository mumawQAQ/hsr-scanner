import json
from typing import Union, List

from loguru import logger
from rapidfuzz import process

from app.constant import RELIC_INNER_PARTS, RELIC_OUTER_PARTS, RELIC_STATS_MAPPING
from app.core.custom_exception import RelicMatchNotFoundException
from app.core.data_models.model_io import RelicMatcherInput, RelicMatcherInputType
from app.core.data_models.relic_info import RelicTitle, RelicMainStat, RelicSubStat
from app.core.interfaces.model_interface import ModelInterface


class RelicMatcherModel(ModelInterface[RelicMatcherInput, Union[RelicTitle, RelicMainStat, List[RelicSubStat]]]):
    @staticmethod
    def get_name() -> str:
        return "relic_matcher_model"

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
            logger.error(f"读取遗器数据失败: {e}")
            raise e

        try:
            # init the relic main stats
            with open(self.relic_main_stats_path, 'r', encoding='utf-8') as f:
                self.relic_main_stats = json.load(f)
        except Exception as e:
            logger.error(f"读取遗器主属性数据失败: {e}")
            raise e

        try:
            # init the relic sub stats
            with open(self.relic_sub_stats_path, 'r', encoding='utf-8') as f:
                self.relic_sub_stats = json.load(f)
        except Exception as e:
            logger.error(f"读取遗器副属性数据失败: {e}")
            raise e

    def predict(self, input_data: RelicMatcherInput) -> Union[RelicTitle, RelicMainStat, List[RelicSubStat]]:
        if input_data.type is RelicMatcherInputType.RELIC_TITLE:
            return self.match_relic_part(input_data.data)
        elif input_data.type is RelicMatcherInputType.RELIC_MAIN_STAT:
            return self.match_relic_main_stat(input_data.data['relic_main_stat'],
                                              input_data.data['relic_main_stat_val'])
        elif input_data.type is RelicMatcherInputType.RELIC_SUB_STAT:
            return self.match_relic_sub_stat(input_data.data)

        raise ValueError(f"未知的输入类型: {input_data.type}")

    def match_relic_part(self, relic_title: str) -> RelicTitle:
        fuzz_result = process.extractOne(relic_title, self.relic_parts.keys())
        if fuzz_result is None or fuzz_result[1] < 50:
            error = f"模糊匹配无法匹配遗器标题: {relic_title}, 匹配结果: {fuzz_result}"
            raise RelicMatchNotFoundException(error)

        relic_title = fuzz_result[0]

        matching_result = RelicTitle(title=relic_title, set_name=self.relic_parts[relic_title]['set_name'],
                                     part=self.relic_parts[relic_title]['part'])

        return matching_result

    def match_relic_main_stat(self, relic_main_stat: str, relic_main_stat_val: str) -> RelicMainStat:
        fuzz_main_stat_result = process.extractOne(relic_main_stat, self.relic_main_stats.keys())
        if fuzz_main_stat_result is None or fuzz_main_stat_result[1] < 50:
            error = f"模糊匹配无法匹配遗器主属性: {relic_main_stat}, 匹配结果: {fuzz_main_stat_result}"
            raise RelicMatchNotFoundException(error)

        main_stat_level_map = self.relic_main_stats[fuzz_main_stat_result[0]]
        # fuzz match the relic main stat value
        fuzz_main_stat_val_result = process.extractOne(relic_main_stat_val, main_stat_level_map.keys())
        if fuzz_main_stat_val_result is None or fuzz_main_stat_val_result[1] < 50:
            error = f"模糊匹配无法匹配遗器主属性值: {relic_main_stat_val}, 匹配结果: {fuzz_main_stat_val_result}"
            raise RelicMatchNotFoundException(error)

        # calculate the level and enhance level
        level = main_stat_level_map[fuzz_main_stat_val_result[0]]
        enhance_level = level // 3

        chinese_relic_main_stat = RELIC_STATS_MAPPING[fuzz_main_stat_result[0]]

        matching_result = RelicMainStat(name=chinese_relic_main_stat, number=fuzz_main_stat_val_result[0], level=level,
                                        enhance_level=enhance_level)

        return matching_result

    def match_relic_sub_stat(self, relic_sub_stats: dict) -> List[RelicSubStat]:

        matching_result: list[RelicSubStat] = []

        # fuzz match the relic sub stats name and value
        for key, value in relic_sub_stats.items():
            fuzz_sub_stat_result = process.extractOne(key, self.relic_sub_stats.keys())
            if fuzz_sub_stat_result is None or fuzz_sub_stat_result[1] < 50:
                error = f"模糊匹配无法匹配遗器副属性: {key}, 匹配结果: {fuzz_sub_stat_result}"
                raise RelicMatchNotFoundException(error)

            sub_stat_score_map = self.relic_sub_stats[fuzz_sub_stat_result[0]]
            fuzz_sub_stat_val_result = process.extractOne(value, sub_stat_score_map.keys())
            if fuzz_sub_stat_val_result is None or fuzz_sub_stat_val_result[1] < 50:
                error = f"模糊匹配无法匹配遗器副属性值: {value}, 匹配结果: {fuzz_sub_stat_val_result}"
                raise RelicMatchNotFoundException(error)

            scores = sub_stat_score_map[fuzz_sub_stat_val_result[0]]

            if type(scores) is not list:
                scores = [scores]

            chinese_relic_sub_stat = RELIC_STATS_MAPPING[fuzz_sub_stat_result[0]]
            matching_result.append(RelicSubStat(name=chinese_relic_sub_stat, number=value, score=scores))

        return matching_result
