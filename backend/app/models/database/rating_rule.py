from sqlalchemy import Column, String, JSON, ForeignKey

from app.dependencies.database import Base


class RatingRule(Base):
    __tablename__ = "rating_rule"

    id = Column(String, primary_key=True, index=True)
    template_id = Column(String, ForeignKey('rating_template.id'), index=True)
    set_names = Column(JSON, default=list)
    part_names = Column(JSON, default=dict)
    valuable_subs = Column(JSON, default=list)
    fit_characters = Column(JSON, default=list)
