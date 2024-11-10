from app.core import database
from app.core.orm_models.rating_rule_orm import RatingRuleORM
from app.core.orm_models.rating_template_orm import RatingTemplateORM
from app.life_span import get_formatter, get_global_state_manager
from app.logging_config import logger


class RatingTemplateRepository:
    def __init__(self):
        # load the sqlite database
        self.db = database.sessionLocal()

        # check if there is a template in use
        in_use_template = self.db.query(RatingTemplateORM).filter(
            RatingTemplateORM.in_use == True).first()

        if in_use_template:
            # Query all the rules associated with the template
            rules = self.db.query(RatingRuleORM).filter(
                RatingRuleORM.template_id == in_use_template.id).all()

            formatter = get_formatter()
            formatted_rules = formatter.format_rating_template(rules)

            global_state_manager = get_global_state_manager()
            global_state_manager.update_state({'formatted_rules': formatted_rules})

    def import_template(self, new_template: RatingTemplateORM, rules: list[RatingRuleORM]):
        try:
            self.db.add(new_template)
            for rule in rules:
                self.db.add(rule)
            self.db.commit()

            return True
        except Exception as e:
            logger.error(f"Failed to import template: {e}")
            self.db.rollback()
            return False

    def stop_use_template(self, template_id: str):
        try:
            # Find any template that is currently in use
            current_template = self.db.query(RatingTemplateORM).filter(
                RatingTemplateORM.in_use == True).first()

            if current_template:
                if current_template.id == template_id:
                    # Set the current template to not in use
                    current_template.in_use = False
                    self.db.commit()
                    return True
            return False

        except Exception as e:
            logger.error(f"Failed to stop using template: {e}")
            self.db.rollback()
            return False

    def use_template(self, template_id: str):
        # Find any template that is currently in use
        current_template = self.db.query(RatingTemplateORM).filter(
            RatingTemplateORM.in_use == True).first()

        if current_template:
            if current_template.id == template_id:
                # The requested template is already in use
                return current_template
            # Set the current template to not in use
            current_template.in_use = False

        # Set the requested template to in use
        matched_rows = self.db.query(RatingTemplateORM).filter(
            RatingTemplateORM.id == template_id).update({"in_use": True})

        if matched_rows:
            self.db.commit()
            # Query again to return the newly updated template
            new_template = self.db.query(RatingTemplateORM).filter(
                RatingTemplateORM.id == template_id).first()

            # Query all the rules associated with the template
            rules = self.db.query(RatingRuleORM).filter(
                RatingRuleORM.template_id == template_id).all()

            return new_template, rules
        else:
            self.db.rollback()  # Rollback if no rows are matched
            return None, None

    def get_template_list(self):
        return self.db.query(RatingTemplateORM).all()

    def get_template(self, template_id: str) -> RatingTemplateORM:
        return self.db.query(RatingTemplateORM).filter(
            RatingTemplateORM.id == template_id).first()

    def create_template(self, new_template: RatingTemplateORM):
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
            self.db.query(RatingTemplateORM).filter(
                RatingTemplateORM.id == template_id).delete()

            # delete the rules associated with the template
            self.db.query(RatingRuleORM).filter(
                RatingRuleORM.template_id == template_id).delete()

            self.db.commit()

            # TODO: handle the case where the template is in use

            return True

        except Exception as e:
            logger.error(f"Failed to delete template: {e}")
            self.db.rollback()
            return False

    def create_template_rule(self, new_rule: RatingRuleORM):
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
            self.db.query(RatingRuleORM).filter(
                RatingRuleORM.id == rule_id).delete()
            self.db.commit()
            return True
        except Exception as e:
            logger.error(f"Failed to delete rule: {e}")
            self.db.rollback()
            return False

    def update_template_rule(self, update_rule: RatingRuleORM):
        try:
            old_rule = self.db.query(RatingRuleORM).filter(
                RatingRuleORM.id == update_rule.id
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
        return self.db.query(RatingRuleORM.id, RatingRuleORM.template_id).filter(
            RatingRuleORM.template_id == template_id).all()

    def get_template_rule(self, rule_id: str):
        return self.db.query(RatingRuleORM).filter(
            RatingRuleORM.id == rule_id).first()

    def get_template_rules(self, template_id: str) -> list[RatingRuleORM]:
        return self.db.query(RatingRuleORM).filter(
            RatingRuleORM.template_id == template_id).all()
