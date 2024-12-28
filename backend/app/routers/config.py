from http import HTTPStatus

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.constant import RELIC_BOX_TYPES
from app.core.network_models.requests.relic_box_position_request import GetRelicBoxPositionRequest, \
    UpdateRelicBoxPositionRequest
from app.core.network_models.responses.common_response import SuccessResponse, ErrorResponse
from app.core.network_models.responses.relic_box_position_response import GetRelicBoxPositionResponse, BoxPosition
from app.core.orm_models.config_orm import ConfigORM
from app.logging_config import logger

router = APIRouter()


@router.post("/relic-box-position",
             response_model=SuccessResponse[str],
             responses={
                 HTTPStatus.BAD_REQUEST: {"model": ErrorResponse}
             },
             status_code=HTTPStatus.OK)
def set_relic_box_config(req: UpdateRelicBoxPositionRequest):
    if req.type not in RELIC_BOX_TYPES:
        return JSONResponse(
            status_code=HTTPStatus.BAD_REQUEST,
            content={
                'status': 'failed',
                'message': 'Invalid type'
            }
        )

    # get the existing config
    db_config = ConfigORM.select().where(ConfigORM.key == req.type).first()

    if not db_config:
        # create a new config
        new_db_config = ConfigORM(key=req.type, value=req.box.model_dump())
        new_db_config.save()

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'message': "Config created"
            }
        )

    # update the existing config
    db_config.value = req.box.model_dump()
    db_config.save()

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={
            'status': 'success',
            'message': "Config updated"
        }
    )


@router.get("/relic-box-position",
            response_model=SuccessResponse[GetRelicBoxPositionResponse],
            responses={
                HTTPStatus.NOT_FOUND: {"model": ErrorResponse}
            },
            status_code=HTTPStatus.OK)
def get_relic_box_config(req: GetRelicBoxPositionRequest):
    db_config = ConfigORM.select().where(ConfigORM.key == req.type).first()

    if not db_config and req.type in RELIC_BOX_TYPES:
        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'data': GetRelicBoxPositionResponse(
                    id=0,
                    key=req.type,
                    value=BoxPosition(x=0, y=0, w=0, h=0)
                ).model_dump()
            }
        )
    elif db_config:
        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'data': GetRelicBoxPositionResponse.model_validate(db_config).model_dump()
            }
        )
    else:
        logger.error(f"Config not found: {req.type}")
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={
                'status': 'failed',
                'message': 'Config not found'
            }
        )
