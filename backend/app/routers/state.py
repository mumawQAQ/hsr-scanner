from fastapi import APIRouter, Depends

from app.dependencies.global_state import GlobalState, get_global_state

router = APIRouter()


@router.patch("/scan-interval/{interval}")
def change_scan_interval(interval: int, global_state: GlobalState = Depends(get_global_state)):
    global_state.interval = interval
    return {'status': 'success'}
