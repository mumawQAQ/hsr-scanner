from app.core.database import db
from app.core.orm_models.rating_rule_orm import RatingRuleORM
from app.core.orm_models.rating_template_orm import RatingTemplateORM


def init_db():
    db.connect()
    db.create_tables([RatingTemplateORM, RatingRuleORM], safe=True)


def close_db():
    db.close()