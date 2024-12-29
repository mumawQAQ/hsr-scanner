from peewee import AutoField, CharField, BooleanField

from app.core.database import BaseModel


class RatingTemplateORM(BaseModel):
    id = AutoField(primary_key=True)
    name = CharField(index=True)
    description = CharField()
    author = CharField()

    in_use = BooleanField(default=False)

    class Meta:
        table_name = "rating_template"
