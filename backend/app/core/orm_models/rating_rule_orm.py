from sqlalchemy import Column, String, JSON, ForeignKey

from app.core.database import Base


class RatingRuleORM(Base):
    __tablename__ = "rating_rule"

    id = Column(String, primary_key=True, index=True)
    template_id = Column(String, ForeignKey('rating_template.id'), index=True)
    set_names = Column(JSON, default=list)
    valuable_mains = Column(JSON, default=dict)
    valuable_subs = Column(JSON, default=list)
    fit_characters = Column(JSON, default=list)
