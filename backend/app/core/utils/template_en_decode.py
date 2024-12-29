import base64
import json
import lzma
from typing import Dict, List

import msgpack

from app.constant import RELIC_SETS_FILE, CHARACTERS_FILE, RELIC_MAIN_STATS_FILE, RELIC_SUB_STATS_FILE
from app.core.network_models.responses.rating_rule_response import GetRatingRuleResponse
from app.core.network_models.responses.rating_template_response import GetRatingTemplateResponse
from app.core.orm_models.rating_rule_orm import RatingRuleORM
from app.core.orm_models.rating_template_orm import RatingTemplateORM
from app.logging_config import logger


# TODO: this can optimize by using a more efficient encoding method
class TemplateEnDecoder:
    def __init__(self):
        self.mappings = {
            'relic_set': self._load_mapping(RELIC_SETS_FILE),
            'character': self._load_mapping(CHARACTERS_FILE),
            'relic_main_stat': self._load_mapping(RELIC_MAIN_STATS_FILE),
            'relic_sub_stat': self._load_mapping(RELIC_SUB_STATS_FILE)
        }

    def _load_mapping(self, file_path: str) -> Dict[str, Dict[str, int]]:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                forward = {key: index for index, key in enumerate(data.keys())}
                backward = {index: key for index, key in enumerate(data.keys())}
                return {'forward': forward, 'backward': backward}
        except Exception as e:
            logger.error(f"Failed to initialize export tool file: {e}")
            raise e

    def encode(self, template: GetRatingTemplateResponse, rules: List[GetRatingRuleResponse]) -> str:
        result = {
            'n': template.name,
            'd': template.description,
            'a': template.author,
            'r': [self._encode_rule(rule) for rule in rules]
        }

        packed = msgpack.packb(result, use_bin_type=True)
        compressed = lzma.compress(packed, preset=9)

        return base64.urlsafe_b64encode(compressed).decode('utf-8')

    def _encode_rule(self, rule: GetRatingRuleResponse) -> Dict:
        return {
            'a': [self.mappings['relic_set']['forward'][name] for name in rule.set_names],
            'b': {k: [self.mappings['relic_main_stat']['forward'][m] for m in v] for k, v in rule.valuable_mains.items()
                  if v},
            'c': [[self.mappings['relic_sub_stat']['forward'][sub.name], sub.rating_scale] for sub in
                  rule.valuable_subs],
            'd': [self.mappings['character']['forward'][char] for char in rule.fit_characters]
        }

    def decode_and_save(self, data_url: str):
        try:
            compressed = base64.urlsafe_b64decode(data_url)
            decompressed = lzma.decompress(compressed)
            data = msgpack.unpackb(decompressed, raw=False)

            template = RatingTemplateORM(
                name=data['n'],
                description=data['d'],
                author=data['a'],
                in_use=False
            )

            template.save()
            rules = [self._decode_rule(rule_data, template.id) for rule_data in data['r']]
            RatingRuleORM.bulk_create(rules)

        except Exception as e:
            logger.error(f"Error decoding template: {e}")
            raise e

    def _decode_rule(self, rule_data: Dict, template_id: int) -> RatingRuleORM:
        return RatingRuleORM(
            template_id=template_id,
            set_names=[self.mappings['relic_set']['backward'][id] for id in rule_data['a']],
            valuable_mains={k: [self.mappings['relic_main_stat']['backward'][id] for id in v] for k, v in
                            rule_data['b'].items()},
            valuable_subs=[
                {"name": self.mappings['relic_sub_stat']['backward'][sub[0]], "rating_scale": sub[1]} for
                sub in rule_data['c']],
            fit_characters=[self.mappings['character']['backward'][id] for id in rule_data['d']]
        )
