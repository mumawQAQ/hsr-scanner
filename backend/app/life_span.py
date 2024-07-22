import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.dependencies.global_state import global_state
from app.dependencies.screen_shot import get_screen_shot


@asynccontextmanager
async def life_span(app: FastAPI):
    # load the ml model here
    # load the ocr model here
    # start the screen capture thread here
    screen_shot_task = asyncio.create_task(get_screen_shot(global_state))
    yield
    screen_shot_task.cancel()
