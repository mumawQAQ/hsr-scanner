import asyncio
import threading
from contextlib import asynccontextmanager
from logging.config import dictConfig

from fastapi import FastAPI

from app.dependencies.database import Base, engine
from app.dependencies.detection import Detection
from app.dependencies.global_state import global_state
from app.dependencies.ocr import OCR
from app.dependencies.screen_shot import get_screen_shot
from app.logging_config import logging_config


def run_async(coroutine):
    asyncio.run(coroutine)


@asynccontextmanager
async def life_span(app: FastAPI):
    # TODO: since all of them rely on the global state, we should refactor this to a single coroutine
    # Apply the logging configuration
    dictConfig(logging_config)

    # Init all the tables
    Base.metadata.create_all(engine)

    # Start the screen capture coroutine in a separate thread
    screen_shot_thread = threading.Thread(target=run_async, args=(get_screen_shot(global_state),))
    screen_shot_thread.start()

    # Load the ML model
    detection = Detection(global_state)

    # Start the object detection coroutine in a separate thread
    detection_thread = threading.Thread(target=run_async, args=(detection.detect_objects(),))
    detection_thread.start()

    # Load the OCR model
    ocr = OCR(global_state)

    # Start the OCR coroutine in a separate thread
    ocr_thread = threading.Thread(target=run_async, args=(ocr.read_relic_info(),))
    ocr_thread.start()

    yield  # This yield allows the context manager to be used with 'async with'

    # Proper thread shutdown and cleanup should be managed here

    # Wait for the threads to finish
    screen_shot_thread.join()
    detection_thread.join()
    ocr_thread.join()
