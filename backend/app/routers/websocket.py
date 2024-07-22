from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect

from app.dependencies.connection_manager import ConnectionManager, get_connection_manager

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, manager: ConnectionManager = Depends(get_connection_manager)):
    await manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_message(data)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
