import json
import os
from typing import Optional

from app.logging_config import logger

RELIC_DATA_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'relic')
RELIC_SETS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_sets.json')
RELIC_MAIN_STATS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_main_stats.json')
RELIC_INNER_PARTS = ['head', 'hand', 'body', 'feet']


class RelicMatch:
    def __init__(self):
        self.relic_parts = {}
        self.relic_main_stats = {}
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

    def match_relic_part(self, relic_title: str) -> Optional[dict]:
        if relic_title in self.relic_parts:
            return {
                'title': relic_title,
                'set_name': self.relic_parts[relic_title]['set_name'],
                'part': self.relic_parts[relic_title]['part']
            }
        else:
            logger.error(f"未找到对应遗器部位名称: {relic_title}")
            return None

    def match_relic_main_stat(self, relic_main_stat: str, relic_main_stat_val: str) -> Optional[dict]:

        # trim all the spaces
        relic_main_stat = relic_main_stat.strip().replace(' ', '')

        # value can be a number or percentage % in the end
        if relic_main_stat in ['生命值', '攻击力', '防御力'] and relic_main_stat_val.endswith('%'):
            relic_main_stat += '百分比'

        if relic_main_stat_val.endswith('%'):
            relic_main_stat_val_num = float(relic_main_stat_val[:-1]) / 100
        else:
            relic_main_stat_val_num = float(relic_main_stat_val)

        if relic_main_stat in self.relic_main_stats:
            logger.info(f"relic_main_stat_val_num: {relic_main_stat}")

            base = self.relic_main_stats[relic_main_stat]['base']
            step = self.relic_main_stats[relic_main_stat]['step']

            # calculate the level and enhance level
            level = round((relic_main_stat_val_num - base) / step)
            enhance_level = level // 3

            return {
                'name': relic_main_stat,
                'number': relic_main_stat_val,
                'level': level,
                'enhance_level': enhance_level,
            }

        else:
            logger.error(f"未找到对应遗器主属性名称: {relic_main_stat}")
            return None
