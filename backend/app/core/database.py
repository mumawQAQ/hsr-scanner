from peewee import Model
from playhouse.sqliteq import SqliteExtDatabase

from app.constant import DATABASE_FILEPATH

db = SqliteExtDatabase(DATABASE_FILEPATH, pragmas={
    'journal_mode': 'wal',
    'cache_size': -1 * 64000,  # 64MB
    'foreign_keys': 1,
    'ignore_check_constraints': 0,
    'synchronous': 0})


class BaseModel(Model):
    class Meta:
        database = db
