from peewee import AutoField, ForeignKeyField
from playhouse.sqlite_ext import JSONField

from app.core.database import BaseModel
from app.core.orm_models.rating_template_orm import RatingTemplateORM


class RatingRuleORM(BaseModel):
    id = AutoField(primary_key=True)
    template_id = ForeignKeyField(RatingTemplateORM, field="id", index=True, on_delete="CASCADE", lazy_load=False)
    set_names = JSONField(default=[])
    valuable_mains = JSONField(default={})
    valuable_subs = JSONField(default=[])
    fit_characters = JSONField(default=[])

    class Meta:
        table_name = "rating_rule"
