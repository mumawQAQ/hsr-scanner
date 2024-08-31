from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.rating_template import RatingTemplate as RatingTemplateDependency, get_rating_template
from app.models.database.rating_template import RatingTemplate as RatingTemplateDBModel
from app.models.requests.rating_template import CreateRatingTemplate
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
