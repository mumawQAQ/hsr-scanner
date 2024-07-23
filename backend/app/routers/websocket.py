from typing import Annotated

from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect

from app.dependencies.connection_manager import ConnectionManager, get_connection_manager
from app.dependencies.global_state import GlobalState, get_global_state

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket,
                             manager: Annotated[ConnectionManager, Depends(get_connection_manager)],
                             global_state: Annotated[GlobalState, Depends(get_global_state)]):
    await manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_message(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
