from typing import Annotated

from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect
from loguru import logger

from app.core.managers.websocket_manager import WebsocketManager
from app.life_span import get_websocket_manager

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(*,
                             websocket: WebSocket,
                             _websocket_manager: Annotated[WebsocketManager, Depends(get_websocket_manager)]):
    # there will be only one client, no need to handle multiple connections
    try:
        await websocket.accept()
        await _websocket_manager.register(websocket)

        logger.info("WebSocket connection established")

        # Keep the connection alive without processing messages
        await websocket.receive_text()

    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"Unexpected error in WebSocket connection: {e}")
    finally:
        # Clean up connection
        await _websocket_manager.unregister()
        logger.info("WebSocket connection closed")
