import json
import os

from app.logging_config import logging

RELIC_DATA_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'relic')
RELIC_SETS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_sets.json')
RELIC_INNER_PARTS = ['head', 'hand', 'body', 'feet']


class RelicMatch:
    def __init__(self):
        self.relic_parts = {}
        try:
            # init the relic_parts
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
            logging.error(f"读取遗器部位数据失败: {e}")
            raise e

    def match_relic_part(self, relic_title: str):
        if relic_title in self.relic_parts:
            return self.relic_parts[relic_title]
        else:
            logging.error(f"未找到对应遗器部位名称: {relic_title}")
            return None
