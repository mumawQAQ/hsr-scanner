from app.dependencies import database
from app.dependencies.global_state import GlobalState, global_state
from app.logging_config import logger
from app.models.database.rating_rule import RatingRule
from app.models.database.rating_template import RatingTemplate as RatingTemplateDBModel


class RatingTemplate:
    def __init__(self, gs: GlobalState):
        # load the sqlite database
        self.db = database.sessionLocal()
        self.global_state = gs

    def stop_use_template(self, template_id: str):
        try:
            # Find any template that is currently in use
            current_template = self.db.query(RatingTemplateDBModel).filter(
                RatingTemplateDBModel.in_use == True).first()

            if current_template:
                if current_template.id == template_id:
                    # Set the current template to not in use
                    current_template.in_use = False
                    self.global_state.template_in_use = None
                    self.db.commit()
                    return True
            return False

        except Exception as e:
            logger.error(f"Failed to stop using template: {e}")
            self.db.rollback()
            return False

    def use_template(self, template_id: str):
        # Find any template that is currently in use
        current_template = self.db.query(RatingTemplateDBModel).filter(
            RatingTemplateDBModel.in_use == True).first()

        if current_template:
            if current_template.id == template_id:
                # The requested template is already in use
                return current_template
            # Set the current template to not in use
            current_template.in_use = False

        # Set the requested template to in use
        matched_rows = self.db.query(RatingTemplateDBModel).filter(
            RatingTemplateDBModel.id == template_id).update({"in_use": True})

        if matched_rows:
            self.db.commit()
            # Query again to return the newly updated template
            new_template = self.db.query(RatingTemplateDBModel).filter(
                RatingTemplateDBModel.id == template_id).first()
            
            self.global_state.template_in_use = template_id
            return new_template
        else:
            self.db.rollback()  # Rollback if no rows are matched
            return None

    def get_template_list(self):
        return self.db.query(RatingTemplateDBModel).all()

    def create_template(self, new_template: RatingTemplateDBModel):
        try:
            self.db.add(new_template)
            self.db.commit()
            self.db.refresh(new_template)
            return new_template
        except Exception as e:
            logger.error(f"Failed to create template: {e}")
            self.db.rollback()
            return None

    def delete_template(self, template_id: str):

        try:
            # delete the template with the given id
            self.db.query(RatingTemplateDBModel).filter(
                RatingTemplateDBModel.id == template_id).delete()

            # delete the rules associated with the template
            self.db.query(RatingRule).filter(
                RatingRule.template_id == template_id).delete()

            self.db.commit()

            return True

        except Exception as e:
            logger.error(f"Failed to delete template: {e}")
            self.db.rollback()
            return False

    def create_template_rule(self, new_rule: RatingRule):
        try:
            self.db.add(new_rule)
            self.db.commit()
            self.db.refresh(new_rule)
            return new_rule
        except Exception as e:
            logger.error(f"Failed to create rule: {e}")
            self.db.rollback()
            return None

    def delete_template_rule(self, rule_id: str):
        try:
            self.db.query(RatingRule).filter(
                RatingRule.id == rule_id).delete()
            self.db.commit()
            return True
        except Exception as e:
            logger.error(f"Failed to delete rule: {e}")
            self.db.rollback()
            return False

    def update_template_rule(self, update_rule: RatingRule):
        try:
            old_rule = self.db.query(RatingRule).filter(
                RatingRule.id == update_rule.id
            ).first()

            if not old_rule:
                return False

            old_rule.set_names = update_rule.set_names
            old_rule.valuable_mains = update_rule.valuable_mains
            old_rule.valuable_subs = update_rule.valuable_subs
            old_rule.fit_characters = update_rule.fit_characters

            self.db.commit()
            return True
        except Exception as e:
            logger.error(f"Failed to update rule: {e}")
            self.db.rollback()
            return False

    def get_template_rule_list(self, template_id: str):
        # only get the ids
        return self.db.query(RatingRule.id, RatingRule.template_id).filter(
            RatingRule.template_id == template_id).all()

    def get_template_rule(self, rule_id: str):
        return self.db.query(RatingRule).filter(
            RatingRule.id == rule_id).first()


rating_template = RatingTemplate(global_state)


def get_rating_template():
    return rating_template
