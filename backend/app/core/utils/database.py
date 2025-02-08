from app.constant import AUTO_DETECT_RELIC_BOX, RELIC_TITLE, RELIC_MAIN_STAT, RELIC_SUB_STAT, AUTO_DETECT_DISCARD_ICON, \
    DISCARD_ICON_POSITION, RELIC_DISCARD_SCORE, ANALYSIS_FAIL_SKIP
from app.core.database import db
from app.core.orm_models.config_orm import ConfigORM
from app.core.orm_models.rating_rule_orm import RatingRuleORM
from app.core.orm_models.rating_template_orm import RatingTemplateORM


def init_db():
    db.connect()
    db.create_tables([RatingTemplateORM, RatingRuleORM, ConfigORM], safe=True)


def close_db():
    db.close()


def get_pipeline_config(config_name: str):
    # get the common config for single and auto pipeline

    try:
        auto_detect_relic_box = ConfigORM.get(ConfigORM.key == AUTO_DETECT_RELIC_BOX).value
    except ConfigORM.DoesNotExist:
        auto_detect_relic_box = True

    try:
        relic_title_box = ConfigORM.get(ConfigORM.key == RELIC_TITLE).value
    except ConfigORM.DoesNotExist:
        relic_title_box = {
            'x': 0,
            'y': 0,
            'w': 0,
            'h': 0
        }

    try:
        relic_main_stat_box = ConfigORM.get(ConfigORM.key == RELIC_MAIN_STAT).value
    except ConfigORM.DoesNotExist:
        relic_main_stat_box = {
            'x': 0,
            'y': 0,
            'w': 0,
            'h': 0
        }

    try:
        relic_sub_stat_box = ConfigORM.get(ConfigORM.key == RELIC_SUB_STAT).value
    except ConfigORM.DoesNotExist:
        relic_sub_stat_box = {
            'x': 0,
            'y': 0,
            'w': 0,
            'h': 0
        }

    try:
        auto_detect_discard_icon = ConfigORM.get(ConfigORM.key == AUTO_DETECT_DISCARD_ICON).value
    except ConfigORM.DoesNotExist:
        auto_detect_discard_icon = True

    try:
        discard_icon_position = ConfigORM.get(ConfigORM.key == DISCARD_ICON_POSITION).value
    except ConfigORM.DoesNotExist:
        discard_icon_position = {
            'x': 0,
            'y': 0,
        }

    try:
        discard_score = ConfigORM.get(ConfigORM.key == RELIC_DISCARD_SCORE).value
    except ConfigORM.DoesNotExist:
        discard_score = 40

    try:
        analysis_fail_skip = ConfigORM.get(ConfigORM.key == ANALYSIS_FAIL_SKIP).value
    except ConfigORM.DoesNotExist:
        analysis_fail_skip = True

    if config_name == 'SingleRelicAnalysisPipeline':
        return {
            AUTO_DETECT_RELIC_BOX: auto_detect_relic_box,
            RELIC_TITLE: relic_title_box,
            RELIC_MAIN_STAT: relic_main_stat_box,
            RELIC_SUB_STAT: relic_sub_stat_box,
        }
    elif config_name == 'AutoRelicAnalysisPipeline':
        return {
            AUTO_DETECT_RELIC_BOX: auto_detect_relic_box,
            ANALYSIS_FAIL_SKIP: analysis_fail_skip,
            RELIC_TITLE: relic_title_box,
            RELIC_MAIN_STAT: relic_main_stat_box,
            RELIC_SUB_STAT: relic_sub_stat_box,
            AUTO_DETECT_DISCARD_ICON: auto_detect_discard_icon,
            DISCARD_ICON_POSITION: discard_icon_position,
            RELIC_DISCARD_SCORE: discard_score
        }
