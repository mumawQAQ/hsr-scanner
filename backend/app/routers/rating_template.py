from http import HTTPStatus
from typing import Annotated, List

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from loguru import logger

from app.core.managers.global_state_manager import GlobalStateManager
from app.core.network_models.requests.rating_rule_request import CreateRatingRuleRequest, UpdateRatingRuleRequest, \
    ImportRatingRuleRequest
from app.core.network_models.requests.rating_template_request import CreateRatingTemplateRequest
from app.core.network_models.responses.common_response import SuccessResponse, ErrorResponse
from app.core.network_models.responses.rating_rule_response import CreateRatingRuleResponse, GetRatingRuleResponse
from app.core.network_models.responses.rating_template_response import CreateRatingTemplateResponse, \
    GetRatingTemplateResponse
from app.core.orm_models.rating_rule_orm import RatingRuleORM
from app.core.orm_models.rating_template_orm import RatingTemplateORM
from app.core.utils.formatter import Formatter
from app.core.utils.template_en_decode import TemplateEnDecoder
from app.life_span import get_formatter, get_template_en_decoder, get_global_state_manager

router = APIRouter()


@router.get("/rating-template/init",
            response_model=SuccessResponse[str],
            status_code=HTTPStatus.OK)
def init_rating_template(
        formatter: Annotated[Formatter, Depends(get_formatter)],
        global_state_manager: Annotated[GlobalStateManager, Depends(get_global_state_manager)]
):
    """
    This function should be called once at the start of the app, it helps init the current used rating template from database to global state
    """
    # get the current used template from database
    current_used_template = RatingTemplateORM.select().where(RatingTemplateORM.in_use == True).first()

    if not current_used_template:
        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'message': 'No template in use'
            }
        )

    # get all the rules and format them
    db_rules = RatingRuleORM.select().where(RatingRuleORM.template_id == current_used_template.id)
    formatted_rules = formatter.format_rating_template(db_rules)

    # update the global state
    global_state_manager.update_state({
        'current_used_template_id': current_used_template.id,
        'formatted_rules': formatted_rules
    })

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={
            'status': 'success',
            'data': 'Template inited'
        }
    )


@router.post("/rating-template/import",
             response_model=SuccessResponse[str],
             status_code=HTTPStatus.OK)
def import_rating_template(
        request: ImportRatingRuleRequest,
        rating_template_en_decoder: Annotated[TemplateEnDecoder, Depends(get_template_en_decoder)]
):
    rating_template_en_decoder.decode_and_save(request.qr_code)

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={
            'status': 'success',
            'data': 'Template imported'
        }
    )


@router.get("/rating-template/export/{template_id}",
            response_model=SuccessResponse[str],
            status_code=HTTPStatus.OK,
            responses={
                HTTPStatus.NOT_FOUND: {"model": ErrorResponse}
            })
def export_rating_template(
        template_id: int,
        rating_template_en_decoder: Annotated[TemplateEnDecoder, Depends(get_template_en_decoder)]
):
    try:
        db_template = RatingTemplateORM.get_by_id(template_id)
        db_template_rules = RatingRuleORM.select().where(RatingRuleORM.template_id == template_id)

        if not db_template_rules:
            return JSONResponse(
                status_code=HTTPStatus.NOT_FOUND,
                content={
                    'status': 'failed',
                    'message': 'No rules to export'
                }
            )

        template = GetRatingTemplateResponse.model_validate(db_template)
        rules = [GetRatingRuleResponse.model_validate(rule) for rule in db_template_rules]

        encoded_template = rating_template_en_decoder.encode(template, rules)

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'data': encoded_template
            }
        )


    except RatingTemplateORM.DoesNotExist:
        logger.error(f"Template not found: {template_id}")
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={
                'status': 'failed',
                'message': 'Template not found'
            }
        )


@router.patch("/rating-template/stop-use/{template_id}",
              response_model=SuccessResponse[str],
              status_code=HTTPStatus.OK,
              responses={
                  HTTPStatus.NOT_FOUND: {"model": ErrorResponse}
              })
def stop_use_rating_template(
        template_id: int,
        global_state_manager: Annotated[GlobalStateManager, Depends(get_global_state_manager)]
):
    # check if the current template is in use
    global_state_manager_state = global_state_manager.get_state()

    current_used_template_id = global_state_manager_state.get('current_used_template_id', None)

    if not current_used_template_id:
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={
                'status': 'failed',
                'message': 'No template in use'
            }
        )

    try:
        db_template = RatingTemplateORM.get_by_id(template_id)
        db_template.in_use = False
        db_template.save()

        # update the global state
        global_state_manager.update_state({
            'current_used_template_id': None,
            'formatted_rules': []
        })

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'message': 'Template stopped'
            }
        )

    except RatingTemplateORM.DoesNotExist:
        logger.error(f"Template not found: {template_id}")
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={
                'status': 'failed',
                'message': "Template not found"
            }
        )


@router.patch("/rating-template/use/{template_id}",
              response_model=SuccessResponse[GetRatingTemplateResponse],
              status_code=HTTPStatus.OK,
              responses={
                  HTTPStatus.NOT_FOUND: {"model": ErrorResponse}
              })
def use_rating_template(
        template_id: int,
        formatter: Annotated[Formatter, Depends(get_formatter)],
        global_state_manager: Annotated[GlobalStateManager, Depends(get_global_state_manager)]
):
    try:
        db_template = RatingTemplateORM.get_by_id(template_id)
        db_rules = RatingRuleORM.select().where(RatingRuleORM.template_id == template_id)

        # check if the template is already in use
        if db_template.in_use:
            return JSONResponse(
                status_code=HTTPStatus.OK,
                content={
                    'status': 'success',
                    'data': GetRatingTemplateResponse.model_validate(db_template).model_dump()
                }
            )

        # get all the in used templates
        in_used_templates = RatingTemplateORM.select().where(RatingTemplateORM.in_use == True)

        # stop using all the in used templates
        for template in in_used_templates:
            template.in_use = False
            template.save()

        # start using the template
        db_template.in_use = True
        db_template.save()

        # update the global state
        formatted_rules = formatter.format_rating_template(db_rules)
        global_state_manager.update_state({'formatted_rules': formatted_rules})
        global_state_manager.update_state({'current_used_template_id': template_id})

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'data': GetRatingTemplateResponse.model_validate(db_template).model_dump()
            }
        )

    except RatingTemplateORM.DoesNotExist:
        logger.error(f"Template not found: {template_id}")
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={
                'status': 'failed',
                'message': 'Template not found'
            }
        )


@router.get("/rating-template/list",
            response_model=SuccessResponse[List[GetRatingTemplateResponse]],
            status_code=HTTPStatus.OK)
def get_rating_template_list():
    db_templates = RatingTemplateORM.select()
    results = [GetRatingTemplateResponse.model_validate(template).model_dump() for template in db_templates]

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={
            'status': 'success',
            'data': results
        }
    )


@router.put("/rating-template/create",
            response_model=SuccessResponse[CreateRatingTemplateResponse],
            status_code=HTTPStatus.CREATED)
def create_rating_template(req: CreateRatingTemplateRequest):
    new_db_template = RatingTemplateORM(
        name=req.name,
        description=req.description,
        author=req.author
    )

    new_db_template.save()

    return JSONResponse(
        status_code=HTTPStatus.CREATED,
        content={
            'status': 'success',
            'data': CreateRatingTemplateResponse.model_validate(new_db_template).model_dump()
        }
    )


@router.delete("/rating-template/delete/{template_id}",
               response_model=SuccessResponse[str],
               responses={
                   HTTPStatus.NOT_FOUND: {"model": ErrorResponse}
               },
               status_code=HTTPStatus.OK)
def delete_rating_template(
        template_id: int
):
    try:
        RatingTemplateORM.get_by_id(template_id).delete_instance()
        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'message': 'Template deleted'
            }
        )
    except RatingTemplateORM.DoesNotExist:
        logger.error(f"Template not found: {template_id}")
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={
                'status': 'failed',
                'message': 'Template not found'
            }
        )


@router.put("/rating-template/rule/create",
            response_model=SuccessResponse[CreateRatingRuleResponse],
            status_code=HTTPStatus.CREATED)
def create_rating_template_rule(
        req: CreateRatingRuleRequest,
):
    new_db_rule = RatingRuleORM(
        template_id=req.template_id,
    )

    new_db_rule.save()

    return JSONResponse(
        status_code=HTTPStatus.CREATED,
        content={
            'status': 'success',
            'data': CreateRatingRuleResponse.model_validate(new_db_rule).model_dump()
        }
    )


@router.delete("/rating-template/rule/delete/{rule_id}",
               response_model=SuccessResponse[str],
               responses={
                   HTTPStatus.NOT_FOUND: {"model": ErrorResponse}
               },
               status_code=HTTPStatus.OK)
def delete_rating_template_rule(
        rule_id: int,
):
    try:
        RatingRuleORM.get_by_id(rule_id).delete_instance()

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'message': 'Rule deleted'
            }
        )

    except RatingRuleORM.DoesNotExist:
        logger.error(f"Rule not found: {rule_id}")
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={
                'status': 'failed',
                'message': 'Rule not found'
            }
        )


@router.post("/rating-template/rule/update",
             response_model=SuccessResponse[str],
             status_code=HTTPStatus.OK)
def update_rating_template_rule(
        updated_rule: UpdateRatingRuleRequest,
):
    RatingRuleORM(
        id=updated_rule.id,
        set_names=updated_rule.set_names,
        valuable_mains=updated_rule.valuable_mains,
        valuable_subs=[value.model_dump() for value in updated_rule.valuable_subs],
        fit_characters=updated_rule.fit_characters
    ).save()

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={
            'status': 'success',
            'message': 'Rule updated'
        }
    )


@router.get("/rating-template/rule/list/{template_id}",
            response_model=SuccessResponse[List[GetRatingRuleResponse]],
            status_code=HTTPStatus.OK,
            responses={
                HTTPStatus.NOT_FOUND: {"model": ErrorResponse}
            })
def get_rating_template_rule_list(
        template_id: int,
):
    try:
        template = RatingTemplateORM.get_by_id(template_id)
        db_rules = RatingRuleORM.select().where(RatingRuleORM.template_id == template.id)
        results = [GetRatingRuleResponse.model_validate(rule).model_dump() for rule in db_rules]

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'data': results
            }
        )

    except RatingTemplateORM.DoesNotExist:
        logger.error(f"Template not found: {template_id}")
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={
                'status': 'failed',
                'message': 'Template not found'
            }
        )


@router.get("/rating-template/rule/{rule_id}",
            response_model=SuccessResponse[GetRatingRuleResponse],
            status_code=HTTPStatus.OK,
            responses={
                HTTPStatus.NOT_FOUND: {"model": ErrorResponse}
            })
def get_rating_template_rule(
        rule_id: int,
):
    try:
        db_rule = RatingRuleORM.get_by_id(rule_id)

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'data': GetRatingRuleResponse.model_validate(db_rule).model_dump()
            }
        )

    except RatingRuleORM.DoesNotExist:
        logger.error(f"Rule not found: {rule_id}")
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={
                'status': 'failed',
                'message': 'Rule not found'
            }
        )
