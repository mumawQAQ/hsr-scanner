from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.rating_template import RatingTemplate, get_rating_template
from app.models.response.rating_template import RatingTemplate as RatingTemplateResponse

router = APIRouter()


@router.patch("/rating-template/use/{template_id}")
def use_rating_template(template_id: str,
                        rating_template: Annotated[RatingTemplate, Depends(get_rating_template)]):
    db_template = rating_template.use_template(template_id)
    if db_template is None:
        return {
            'status': 'failed',
            'message': 'Template not found'
        }

    user_data = RatingTemplateResponse.model_validate(db_template)
    return {
        'status': 'success',
        'data': user_data
    }
