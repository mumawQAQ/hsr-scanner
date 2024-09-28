import asyncio

from app.dependencies.global_state import GlobalState
from app.logging_config import logger
from app.models.response.rating_rule import RatingRule


class RelicRating:
    def __init__(self, global_state: GlobalState):
        self.global_state = global_state
        self.formatted_rating_rules = {}

    def format_rating_template(self):
        if self.global_state.rules_in_use_dirty:
            logger.info("检测到模板变更，重新格式化遗器评分模板")
            # clear the formatted template
            self.formatted_rating_rules = {}

            # format the rating template from the database model to more optimized format
            if self.global_state.rules_in_use is not None:
                rules = [RatingRule.model_validate(rule) for rule in self.global_state.rules_in_use]
                for rule in rules:
                    logger.info(f"正在格式化{rule}评分规则")
            self.global_state.rules_in_use_dirty = False

    async def get_relic_rating(self):
        logger.info("开始获取遗器评分")
        while True:
            try:
                self.format_rating_template()

                # do rating stuff here

                await asyncio.sleep(0.1)
            except Exception as e:
                logger.error(f"获取遗器评分失败: {e}")
                await asyncio.sleep(1)
