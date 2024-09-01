from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.rating_template import RatingTemplate as RatingTemplateDependency, get_rating_template
from app.models.database.rating_rule import RatingRule
from app.models.database.rating_template import RatingTemplate as RatingTemplateDBModel
from app.models.requests.rating_rule import CreateRatingRule
from app.models.requests.rating_template import CreateRatingTemplate
from app.models.response.rating_rule import RatingRule as RatingRuleResponse
from app.models.response.rating_template import RatingTemplate as RatingTemplateResponse

router = APIRouter()


@router.patch("/rating-template/use/{template_id}")
def use_rating_template(template_id: str,
                        rating_template_dependency: Annotated[RatingTemplateDependency, Depends(get_rating_template)]):
    db_template = rating_template_dependency.use_template(template_id)
    if db_template is None:
        return {
            'status': 'failed',
            'message': 'Template not found'
        }

    result = RatingTemplateResponse.model_validate(db_template)
    return {
        'status': 'success',
        'data': result
    }


@router.get("/rating-template/list")
def get_rating_template_list(
        rating_template_dependency: Annotated[RatingTemplateDependency, Depends(get_rating_template)]):
    db_templates = rating_template_dependency.get_template_list()

    if not db_templates:
        return {
            'status': 'failed',
            'message': 'No templates found'
        }

    results = [RatingTemplateResponse.model_validate(template) for template in db_templates]

    return {
        'status': 'success',
        'data': results
    }


@router.put("/rating-template/create")
def create_rating_template(new_template: CreateRatingTemplate,
                           rating_template_dependency: Annotated[
                               RatingTemplateDependency, Depends(get_rating_template)]):
    new_db_template = RatingTemplateDBModel(
        id=new_template.id,
        name=new_template.name,
        description=new_template.description,
        author=new_template.author
    )

    db_template = rating_template_dependency.create_template(new_db_template)

    if db_template is None:
        return {
            'status': 'failed',
            'message': 'Failed to create template'
        }

    result = RatingTemplateResponse.model_validate(db_template)

    return {
        'status': 'success',
        'data': result
    }


@router.delete("/rating-template/delete/{template_id}")
def delete_rating_template(template_id: str,
                           rating_template_dependency: Annotated[
                               RatingTemplateDependency, Depends(get_rating_template)]):
    result = rating_template_dependency.delete_template(template_id)

    if not result:
        return {
            'status': 'failed',
            'message': 'Failed to delete template'
        }

    return {
        'status': 'success',
        'message': 'Template deleted'
    }


@router.put("/rating-template/rule/create")
def create_rating_template_rule(new_rule: CreateRatingRule,
                                rating_template_dependency: Annotated[
                                    RatingTemplateDependency, Depends(get_rating_template)]):
    new_db_rule = RatingRule(
        id=new_rule.rule_id,
        template_id=new_rule.template_id,
    )

    db_rule = rating_template_dependency.create_template_rule(new_db_rule)

    if db_rule is None:
        return {
            'status': 'failed',
            'message': 'Failed to create rule'
        }

    result = RatingRuleResponse.model_validate(db_rule)

    return {
        'status': 'success',
        'data': result
    }
