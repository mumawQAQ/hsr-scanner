from typing import Optional

from fastapi import WebSocket

from app.logging_config import logger


class WebsocketManager:
    """Manages a single WebSocket connection, allowing messages to be sent to the client."""

    def __init__(self):
        self.connection: Optional[WebSocket] = None

    async def register(self, websocket: WebSocket):
        """Register a WebSocket connection."""
        self.connection = websocket
        logger.info("WebSocket connection established.")

    async def unregister(self):
        """Unregister the WebSocket connection."""
        if self.connection:
            logger.info("WebSocket connection closed.")
        self.connection = None

    async def send_message(self, message: str):
        """Send a message to the connected WebSocket."""
        if self.connection:
            try:
                await self.connection.send_text(message)
                logger.debug(f"Sent message to client: {message}")
            except Exception as e:
                logger.error(f"Error sending message to WebSocket: {e}")
        else:
            logger.warning("No active WebSocket connection to send messages.")
