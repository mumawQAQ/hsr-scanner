from typing import Union, List

from app.constant import Relic_Sub_Stats_Total_Acquire_Scale, \
    Relic_Sub_Stats_Acquire_Scale
from app.core.interfaces.model_interface import ModelInterface
from app.core.managers.global_state_manager import GlobalStateManager
from app.core.network_models.responses.relic_analysis_response import RelicScoreResponse
from app.core.network_models.responses.relic_ocr_response import RelicOCRResponse


class RelicRatingModel(ModelInterface[RelicOCRResponse, Union[None, List[RelicScoreResponse]]]):
    def __init__(self, global_state_manager: GlobalStateManager):
        self.global_state_manager = global_state_manager

    def load(self) -> None:
        pass

    def predict(self, input_data: RelicOCRResponse) -> Union[None, List[RelicScoreResponse]]:
        global_state = self.global_state_manager.get_state()

        if 'formatted_rules' not in global_state.keys():
            raise ValueError("Template rules are not found, make sure you have active a template")

        if not input_data.relic_main_stat:
            raise ValueError("Relic main stat is not found")

        if not input_data.relic_sub_stat:
            raise ValueError("Relic sub stat is not found")

        if not input_data.relic_title:
            raise ValueError("Relic title is not found")

        rules = global_state['formatted_rules'][input_data.relic_title.title]

        # TODO: handle the case where level is none will cause an error
        score_type = "potential" if input_data.relic_main_stat.level < 15 else "actual"
        new_rating = []

        for rule in rules:
            if input_data.relic_main_stat.name not in rule.valuable_mains:
                continue

            max_enhance_times = 5
            max_probability = 0.25
            max_sub_stat_rating_scale = rule.top_4_valuable_subs[0].rating_scale
            ideal_base_potential_score = sum(sub_stat.rating_scale for sub_stat in rule.top_4_valuable_subs)
            ideal_cur_potential_score = max_sub_stat_rating_scale * input_data.relic_main_stat.enhance_level
            ideal_remaining_potential_score = max_probability * (
                    max_enhance_times - input_data.relic_main_stat.enhance_level) * max_sub_stat_rating_scale

            actual_base_potential_score = 0
            actual_exist_remaining_potential_score = 0
            actual_non_exist_remaining_potential_score = 0

            valuable_sub_count = 0
            valuable_sub_sum_rating_scale = 0

            # calculate the base potential score
            for sub_stat in input_data.relic_sub_stat:
                result = None
                for valuable_sub in rule.valuable_subs:
                    if valuable_sub.name == sub_stat.name:
                        result = valuable_sub
                        break
                if not result:
                    continue
                valuable_sub_rating_scale = result.rating_scale

                valuable_sub_count += 1
                valuable_sub_sum_rating_scale += valuable_sub_rating_scale

                # if the sub stat is speed, it can contain a list of score, we only calculate the max score
                actual_base_potential_score += (valuable_sub_rating_scale * max(sub_stat.score))

            # calculate the possibility of enhancing the existing valuable sub stats
            if valuable_sub_count:
                # if current sub stats is less than 4, means we can only enhance 4 times
                if len(input_data.relic_sub_stat) < 4:
                    actual_exist_remaining_potential_score = max_probability * 4 * (
                            valuable_sub_sum_rating_scale / valuable_sub_count)
                else:
                    actual_exist_remaining_potential_score = max_probability * (
                            max_enhance_times - input_data.relic_main_stat.enhance_level) * (
                                                                     valuable_sub_sum_rating_scale / valuable_sub_count)

            # calculate the possibility of non yet existed sub stats to be valuable
            if len(input_data.relic_sub_stat) < 4:
                remain_valuable_subs = [sub_stat for sub_stat in rule.valuable_subs if
                                        sub_stat.name not in input_data.relic_sub_stat]
                cur_total_acquired_scale = Relic_Sub_Stats_Total_Acquire_Scale
                cur_total_possible_acquired_scale = sum([
                    sub_stat.rating_scale * Relic_Sub_Stats_Acquire_Scale[sub_stat.name] for sub_stat in
                    remain_valuable_subs])

                # if the main stat is in the sub stats, we need to subtract the main stat scale
                if input_data.relic_main_stat.name in Relic_Sub_Stats_Acquire_Scale.keys():
                    cur_total_acquired_scale -= Relic_Sub_Stats_Acquire_Scale[
                        input_data.relic_main_stat.name]

                # subtract the current sub stats scale
                for sub_stat in input_data.relic_sub_stat:
                    cur_total_acquired_scale -= Relic_Sub_Stats_Acquire_Scale[sub_stat.name]

                actual_non_exist_remaining_potential_score = cur_total_possible_acquired_scale / cur_total_acquired_scale

            ideal_total = ideal_base_potential_score + ideal_cur_potential_score + ideal_remaining_potential_score
            actual_total = actual_base_potential_score + actual_exist_remaining_potential_score + actual_non_exist_remaining_potential_score

            score = actual_total / ideal_total
            if score != 0:
                new_rating.append(RelicScoreResponse(score=score, characters=rule.fit_characters, type=score_type))

        # sort the rating by score
        new_rating.sort(key=lambda x: x.score, reverse=True)

        return new_rating
