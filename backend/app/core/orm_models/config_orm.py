from peewee import AutoField, TextField
from playhouse.sqlite_ext import JSONField

from app.core.database import BaseModel


class ConfigORM(BaseModel):
    id = AutoField(primary_key=True)
    key = TextField(unique=True, index=True)
    value = JSONField()

    class Meta:
        table_name = "config"
