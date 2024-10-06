import base64
import json
import uuid
import zlib

from app.constant import RELIC_SETS_FILE, CHARACTERS_FILE, RELIC_MAIN_STATS_FILE, RELIC_SUB_STATS_FILE
from app.logging_config import logger
from app.models.common.rating_rule import RatingRuleSubStats
from app.models.response.rating_rule import RatingRule
from app.models.response.rating_template import RatingTemplate


class TemplateEnDecoder:
    def __init__(self):
        self.mappings = {
            'relic_set': self._load_mapping(RELIC_SETS_FILE),
            'character': self._load_mapping(CHARACTERS_FILE),
            'relic_main_stat': self._load_mapping(RELIC_MAIN_STATS_FILE),
            'relic_sub_stat': self._load_mapping(RELIC_SUB_STATS_FILE)
        }

    def _load_mapping(self, file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                forward = {key: index for index, key in enumerate(data.keys())}
                backward = {index: key for index, key in enumerate(data.keys())}
                return {'forward': forward, 'backward': backward}
        except Exception as e:
            logger.error(f"Failed to initialize export tool file: {e}")
            raise e

    def encode(self, template: RatingTemplate, rules: list[RatingRule]):
        result = {
            'name': template.name,
            'description': template.description,
            'author': template.author,
            'rules': [self._encode_rule(rule) for rule in rules]
        }

        json_str = json.dumps(result, separators=(',', ':'))
        compressed = zlib.compress(json_str.encode('utf-8'), level=9)

        # print the size
        print(f"Size of the compressed data: {len(compressed)} bytes")

        return base64.urlsafe_b64encode(compressed).decode('utf-8')

    def _encode_rule(self, rule: RatingRule):
        return {
            # set_names -> a
            'a': [self.mappings['relic_set']['forward'][name] for name in rule.set_names],
            # valuable_mains -> b
            'b': {
                key: [self.mappings['relic_main_stat']['forward'][main] for main in mains]
                for key, mains in rule.valuable_mains.items()
                if mains
            },
            # valuable_subs -> c
            'c': [
                [self.mappings['relic_sub_stat']['forward'][sub.name], sub.rating_scale]
                for sub in rule.valuable_subs
            ],
            # fit_characters -> d
            'd': [self.mappings['character']['forward'][char] for char in rule.fit_characters]
        }

    def decode(self, data_url: str):
        try:
            # Decode base64
            compressed = base64.urlsafe_b64decode(data_url)

            # Decompress
            json_str = zlib.decompress(compressed).decode('utf-8')

            # Parse JSON
            data = json.loads(json_str)

            # generate a new uuid for the template
            template_id = str(uuid.uuid4())

            # Convert the data to RatingTemplate and RatingRule objects
            template = RatingTemplate(
                id=template_id,
                name=data['name'],
                description=data['description'],
                author=data['author'],
                in_use=False
            )

            rules = [self._decode_rule(rule_data, template_id) for rule_data in data['rules']]

            return template, rules
        except Exception as e:
            logger.error(f"Error decoding template: {e}")
            raise

    def _decode_rule(self, rule_data, template_id):
        return RatingRule(
            id=str(uuid.uuid4()),
            template_id=template_id,
            set_names=[self.mappings['relic_set']['backward'][id] for id in rule_data['a']],
            valuable_mains={
                key: [self.mappings['relic_main_stat']['backward'][id] for id in mains]
                for key, mains in rule_data['b'].items()
            },
            valuable_subs=[
                RatingRuleSubStats(name=self.mappings['relic_sub_stat']['backward'][sub[0]], rating_scale=sub[1])
                for sub in rule_data['c']
            ],
            fit_characters=[self.mappings['character']['backward'][id] for id in rule_data['d']]
        )


def get_template_en_decoder():
    return TemplateEnDecoder()
