from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.managers.global_state_manager import GlobalStateManager
from app.core.network_models.requests.rating_rule_request import CreateRatingRuleRequest, UpdateRatingRuleRequest, \
    ImportRatingRuleRequest
from app.core.network_models.requests.rating_template_request import CreateRatingTemplateRequest
from app.core.network_models.responses.rating_rule_response import RatingRuleResponse, RatingRuleIdsResponse
from app.core.network_models.responses.rating_template_response import RatingTemplateResponse
from app.core.orm_models.rating_rule_orm import RatingRuleORM
from app.core.orm_models.rating_template_orm import RatingTemplateORM
from app.core.repositories.rating_template_repo import RatingTemplateRepository
from app.core.utils.formatter import Formatter
from app.core.utils.template_en_decode import TemplateEnDecoder
from app.life_span import get_formatter, get_template_en_decoder, get_rating_template_repository, \
    get_global_state_manager

router = APIRouter()


@router.post("/rating-template/import")
def import_rating_template(
        request: ImportRatingRuleRequest,
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)],
        rating_template_en_decoder: Annotated[TemplateEnDecoder, Depends(get_template_en_decoder)]
):
    template, rules = rating_template_en_decoder.decode(request.qr_code)

    import_template_result = rating_template_repository.import_template(template, rules)

    if not import_template_result:
        return {
            'status': 'failed',
            'message': 'Failed to import template'
        }

    return {
        'status': 'success',
        'data': 'Template imported'
    }


@router.get("/rating-template/export/{template_id}")
def export_rating_template(
        template_id: str,
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)],
        rating_template_en_decoder: Annotated[TemplateEnDecoder, Depends(get_template_en_decoder)]
):
    # get the template from the database
    db_template_rules = rating_template_repository.get_template_rules(template_id)
    db_template = rating_template_repository.get_template(template_id)

    if db_template is None:
        return {
            'status': 'failed',
            'message': 'Template not found'
        }

    if db_template_rules is None:
        return {
            'status': 'failed',
            'message': 'Rules not found / No rules to export'
        }

    # convert the template to pydantic model
    template = RatingTemplateResponse.model_validate(db_template)
    rules = [RatingRuleResponse.model_validate(rule) for rule in db_template_rules]

    # encode the template and rules
    encoded_template = rating_template_en_decoder.encode(template, rules)

    return {
        'status': 'success',
        'data': encoded_template
    }


@router.patch("/rating-template/stop-use/{template_id}")
def stop_use_rating_template(
        template_id: str,
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)],
        global_state_manager: Annotated[GlobalStateManager, Depends(get_global_state_manager)]
):
    result = rating_template_repository.stop_use_template(template_id)

    if not result:
        return {
            'status': 'failed',
            'message': 'Failed to stop using template'
        }

    global_state_manager.update_state({'formatted_rules': []})

    return {
        'status': 'success',
        'message': 'Template stopped'
    }


@router.patch("/rating-template/use/{template_id}")
def use_rating_template(
        template_id: str,
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)],
        formatter: Annotated[Formatter, Depends(get_formatter)],
        global_state_manager: Annotated[GlobalStateManager, Depends(get_global_state_manager)]
):
    db_template, db_rules = rating_template_repository.use_template(template_id)
    if db_template is None:
        return {
            'status': 'failed',
            'message': 'Template not found'
        }

    formatted_rules = formatter.format_rating_template(db_rules)
    global_state_manager.update_state({'formatted_rules': formatted_rules})

    result = RatingTemplateResponse.model_validate(db_template)
    return {
        'status': 'success',
        'data': result
    }


@router.get("/rating-template/list")
def get_rating_template_list(
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)]):
    db_templates = rating_template_repository.get_template_list()

    if not db_templates:
        return {
            'status': 'success',
            'data': []
        }

    results = [RatingTemplateResponse.model_validate(template) for template in db_templates]

    return {
        'status': 'success',
        'data': results
    }


@router.put("/rating-template/create")
def create_rating_template(
        new_template: CreateRatingTemplateRequest,
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)]
):
    new_db_template = RatingTemplateORM(
        id=new_template.id,
        name=new_template.name,
        description=new_template.description,
        author=new_template.author
    )

    db_template = rating_template_repository.create_template(new_db_template)

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
def delete_rating_template(
        template_id: str,
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)]
):
    result = rating_template_repository.delete_template(template_id)

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
def create_rating_template_rule(
        new_rule: CreateRatingRuleRequest,
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)]
):
    new_db_rule = RatingRuleORM(
        id=new_rule.rule_id,
        template_id=new_rule.template_id,
    )

    db_rule = rating_template_repository.create_template_rule(new_db_rule)

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


@router.delete("/rating-template/rule/delete/{rule_id}")
def delete_rating_template_rule(
        rule_id: str,
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)]
):
    result = rating_template_repository.delete_template_rule(rule_id)

    if not result:
        return {
            'status': 'failed',
            'message': 'Failed to delete rule'
        }

    return {
        'status': 'success',
        'message': 'Rule deleted'
    }


@router.post("/rating-template/rule/update")
def update_rating_template_rule(
        updated_rule: UpdateRatingRuleRequest,
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)]
):
    db_rule = RatingRuleORM(
        id=updated_rule.id,
        set_names=updated_rule.set_names,
        valuable_mains=updated_rule.valuable_mains,
        valuable_subs=[value.model_dump() for value in updated_rule.valuable_subs],
        fit_characters=updated_rule.fit_characters
    )

    result = rating_template_repository.update_template_rule(db_rule)

    if not result:
        return {
            'status': 'failed',
            'message': 'Failed to update rule'
        }

    return {
        'status': 'success',
        'message': 'Rule updated'
    }


@router.get("/rating-template/rule/list/{template_id}")
def get_rating_template_rule_list(
        template_id: str,
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)]
):
    db_rules = rating_template_repository.get_template_rule_list(template_id)

    if not db_rules:
        return {
            'status': 'success',
            'data': []
        }

    results = [RatingRuleIdsResponse.model_validate(rule) for rule in db_rules]

    return {
        'status': 'success',
        'data': results
    }


@router.get("/rating-template/rule/{rule_id}")
def get_rating_template_rule(
        rule_id: str,
        rating_template_repository: Annotated[RatingTemplateRepository, Depends(get_rating_template_repository)]
):
    db_rule = rating_template_repository.get_template_rule(rule_id)

    if db_rule is None:
        return {
            'status': 'failed',
            'message': 'Rule not found'
        }

    result = RatingRuleResponse.model_validate(db_rule)

    return {
        'status': 'success',
        'data': result
    }
