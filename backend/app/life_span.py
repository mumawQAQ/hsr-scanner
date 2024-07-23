import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.dependencies.detection import Detection
from app.dependencies.global_state import global_state
from app.dependencies.screen_shot import get_screen_shot


@asynccontextmanager
async def life_span(app: FastAPI):
    # start the screen capture thread here
    screen_shot_task = asyncio.create_task(get_screen_shot(global_state))
    # load the ml model here
    detection = Detection(global_state)
    # start the object detection thread here
    detection_task = asyncio.create_task(detection.detect_objects())
    # load the ocr model here
    yield
    screen_shot_task.cancel()
    detection_task.cancel()
    detection.destroy()
