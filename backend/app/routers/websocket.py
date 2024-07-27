import asyncio
import json
from typing import Annotated

from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect

from app.dependencies.connection_manager import ConnectionManager, get_connection_manager
from app.dependencies.global_state import GlobalState, get_global_state

router = APIRouter()


@router.websocket("/relic-info")
async def websocket_endpoint(websocket: WebSocket,
                             manager: Annotated[ConnectionManager, Depends(get_connection_manager)],
                             global_state: Annotated[GlobalState, Depends(get_global_state)]):
    await manager.connect(websocket)

    try:
        while True:
            if not global_state.relic_info:
                error_message = json.dumps({'status': 'error', 'message': 'No relic info found'})
                if manager.relic_info_last_sent_message != error_message:
                    manager.relic_info_last_sent_message = error_message
                    await manager.send_message(error_message)
                await asyncio.sleep(0.1)
                continue

            current_message = global_state.relic_info.model_dump_json()
            if manager.relic_info_last_sent_message != current_message:
                manager.relic_info_last_sent_message = current_message
                await manager.send_message(json.dumps({
                    'status': 'success',
                    'message': current_message
                }))
            await asyncio.sleep(0.1)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
