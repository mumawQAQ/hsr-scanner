import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.dependencies.database import Base, engine
from app.dependencies.detection import Detection
from app.dependencies.global_state import global_state
from app.dependencies.ocr import OCR
from app.dependencies.relic_rating import RelicRating
from app.dependencies.screen_shot import get_screen_shot


@asynccontextmanager
async def life_span(app: FastAPI):
    # TODO: since all of them rely on the global state, we should refactor this to a single coroutine

    # Init all the tables
    Base.metadata.create_all(engine)

    # Start the screen capture coroutine in a separate thread
    screen_shot_task = asyncio.create_task(get_screen_shot(global_state))

    # Load the ML model
    detection = Detection(global_state)
    detection_task = asyncio.create_task(detection.detect_objects())

    # Load the OCR model
    ocr = OCR(global_state)
    # Start the OCR coroutine in a separate thread
    ocr_task = asyncio.create_task(ocr.read_relic_info())

    # Load the relic rating model
    relic_rating = RelicRating(global_state)
    relic_rating_task = asyncio.create_task(relic_rating.get_relic_rating())

    yield  # This yield allows the context manager to be used with 'async with'

    # Proper thread shutdown and cleanup should be managed here
    screen_shot_task.cancel()

    detection_task.cancel()
    detection.destroy()

    ocr_task.cancel()

    relic_rating_task.cancel()
