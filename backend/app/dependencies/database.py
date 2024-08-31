import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_FILEPATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    'assets',
    'database',
    'scanner.db'
).replace(os.sep, '/')

SQLALCHEMY_DATABASE_URL = "sqlite:///" + DATABASE_FILEPATH

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

sessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
