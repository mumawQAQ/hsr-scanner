from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.global_state import GlobalState, get_global_state

router = APIRouter()


@router.patch("/scan-interval/{interval}")
def change_scan_interval(interval: int,
                         global_state: Annotated[GlobalState, Depends(get_global_state)]):
    global_state.interval = interval
    return {'status': 'success'}


@router.patch("/scan-state/{state}")
def change_scan_state(state: bool,
                      global_state: Annotated[GlobalState, Depends(get_global_state)]):
    global_state.scan_state = state
    return {'status': 'success'}
