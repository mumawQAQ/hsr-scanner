from sqlalchemy import Column, String, JSON, ForeignKey

from app.dependencies.database import Base


class RatingRule(Base):
    __tablename__ = "rating_rule"

    id = Column(String, primary_key=True, index=True)
    template_id = Column(String, ForeignKey('rating_template.id'), index=True)
    set_names = Column(JSON)
    part_names = Column(JSON)
    valuable_subs = Column(JSON)
    fit_characters = Column(JSON)
