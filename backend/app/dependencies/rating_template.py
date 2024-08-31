from app.dependencies import database
from app.models.database.rating_template import RatingTemplate as RatingTemplateModel


class RatingTemplate:
    def __init__(self):
        # load the sqlite database
        self.db = database.sessionLocal()

    def use_template(self, template_id: str):
        # Find any template that is currently in use
        current_template = self.db.query(RatingTemplateModel).filter(
            RatingTemplateModel.in_use == True).first()

        if current_template:
            if current_template.id == template_id:
                # The requested template is already in use
                return None
            # Set the current template to not in use
            current_template.in_use = False

        # Set the requested template to in use
        matched_rows = self.db.query(RatingTemplateModel).filter(
            RatingTemplateModel.id == template_id).update({"in_use": True})

        if matched_rows:
            self.db.commit()
            # Query again to return the newly updated template
            new_template = self.db.query(RatingTemplateModel).filter(
                RatingTemplateModel.id == template_id).first()
            return new_template
        else:
            self.db.rollback()  # Rollback if no rows are matched
            return None


rating_template = RatingTemplate()


def get_rating_template():
    return rating_template
