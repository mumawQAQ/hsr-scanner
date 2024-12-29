from http import HTTPStatus

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.constant import RELIC_BOX_TYPES, AUTO_DETECT_DISCARD_ICON, AUTO_DETECT_RELIC_BOX, DISCARD_ICON_POSITION
from app.core.data_models.icon_position import IconPosition
from app.core.network_models.requests.discard_icon_position_request import UpdateDiscardIconPositionRequest
from app.core.network_models.requests.relic_box_position_request import UpdateRelicBoxPositionRequest
from app.core.network_models.responses.common_response import SuccessResponse, ErrorResponse
from app.core.network_models.responses.discard_icon_position_response import GetDiscardIconPositionResponse
from app.core.network_models.responses.relic_box_position_response import GetRelicBoxPositionResponse, BoxPosition
from app.core.orm_models.config_orm import ConfigORM
from app.logging_config import logger

router = APIRouter()


@router.patch("/auto-detect-discard-icon/{state}",
              response_model=SuccessResponse[str],
              status_code=HTTPStatus.OK)
def change_auto_detect_discard_icon(state: bool):
    db_config = ConfigORM.select().where(ConfigORM.key == AUTO_DETECT_DISCARD_ICON).first()

    # if there is no config, create a new one
    if not db_config:
        new_db_config = ConfigORM(key=AUTO_DETECT_DISCARD_ICON, value=state)
        new_db_config.save()

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'message': "Config created"
            }
        )

    # if there is a config, update it
    db_config.value = state
    db_config.save()

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={
            'status': 'success',
            'message': "Config updated"
        }
    )


@router.get("/auto-detect-discard-icon",
            response_model=SuccessResponse[bool],
            status_code=HTTPStatus.OK)
def get_auto_detect_discard_icon():
    db_config = ConfigORM.select().where(ConfigORM.key == AUTO_DETECT_DISCARD_ICON).first()

    if not db_config:
        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'data': True
            }
        )

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={'status': 'success', 'data': db_config.value}
    )


@router.get("/discard-icon-position",
            response_model=SuccessResponse[GetDiscardIconPositionResponse],
            status_code=HTTPStatus.OK)
def get_discard_icon_position():
    db_config = ConfigORM.select().where(ConfigORM.key == DISCARD_ICON_POSITION).first()

    if not db_config:
        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'data': GetDiscardIconPositionResponse(id=0, key=DISCARD_ICON_POSITION,
                                                       value=IconPosition(x=0, y=0)).model_dump()
            }
        )

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={
            'status': 'success',
            'data': GetDiscardIconPositionResponse.model_validate(db_config).model_dump()
        }
    )


@router.post("/discard-icon-position",
             response_model=SuccessResponse[bool],
             status_code=HTTPStatus.OK)
def set_discard_icon_position(req: UpdateDiscardIconPositionRequest):
    db_config = ConfigORM.select().where(ConfigORM.key == DISCARD_ICON_POSITION).first()

    if not db_config:
        new_db_config = ConfigORM(key=DISCARD_ICON_POSITION, value=req.model_dump())
        new_db_config.save()

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'message': "Config created"
            }
        )

    db_config.value = req.model_dump()
    db_config.save()

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={
            'status': 'success',
            'message': "Config updated"
        }
    )


@router.patch("/auto-detect-relic-box/{state}",
              response_model=SuccessResponse[str],
              status_code=HTTPStatus.OK)
def change_auto_detect_relic_box(state: bool):
    db_config = ConfigORM.select().where(ConfigORM.key == AUTO_DETECT_RELIC_BOX).first()

    # if there is no config, create a new one
    if not db_config:
        new_db_config = ConfigORM(key=AUTO_DETECT_RELIC_BOX, value=state)
        new_db_config.save()

        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'message': "Config created"
            }
        )

    # if there is a config, update it
    db_config.value = state
    db_config.save()

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={
            'status': 'success',
            'message': "Config updated"
        }
    )


@router.get("/auto-detect-relic-box",
            response_model=SuccessResponse[str],
            status_code=HTTPStatus.OK)
def get_auto_detect_relic_box():
    db_config = ConfigORM.select().where(ConfigORM.key == AUTO_DETECT_RELIC_BOX).first()

    if not db_config:
        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'data': True
            }
        )

    return JSONResponse(
        status_code=HTTPStatus.OK,
        content={'status': 'success', 'data': db_config.value}
    )


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


@router.get("/relic-box-position/{relic_box_type}",
            response_model=SuccessResponse[GetRelicBoxPositionResponse],
            responses={
                HTTPStatus.NOT_FOUND: {"model": ErrorResponse}
            },
            status_code=HTTPStatus.OK)
def get_relic_box_config(relic_box_type: str):
    db_config = ConfigORM.select().where(ConfigORM.key == relic_box_type).first()

    if not db_config and relic_box_type in RELIC_BOX_TYPES:
        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={
                'status': 'success',
                'data': GetRelicBoxPositionResponse(
                    id=0,
                    key=relic_box_type,
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
        logger.error(f"Config not found: {relic_box_type}")
        return JSONResponse(
            status_code=HTTPStatus.NOT_FOUND,
            content={
                'status': 'failed',
                'message': 'Config not found'
            }
        )
