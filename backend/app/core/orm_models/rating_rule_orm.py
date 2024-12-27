from peewee import AutoField, ForeignKeyField
from playhouse.sqlite_ext import JSONField


from app.core.database import BaseModel
from app.core.orm_models.rating_template_orm import RatingTemplateORM


class RatingRuleORM(BaseModel):
    id = AutoField(primary_key=True)
    template_id = ForeignKeyField(RatingTemplateORM, field="id", index=True, on_delete="CASCADE")
    set_names = JSONField()
    valuable_mains = JSONField()
    valuable_subs = JSONField()
    fit_characters = JSONField()

    class Meta:
        table_name = "rating_rule"
