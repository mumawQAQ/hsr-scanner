from sqlalchemy import Column, String, Boolean

from app.dependencies.database import Base


class RatingTemplate(Base):
    __tablename__ = "rating_template"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    author = Column(String)
    # need to make sure only one row is in use
    in_use = Column(Boolean, default=False)
