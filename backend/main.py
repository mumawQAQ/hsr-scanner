import os
from logging.config import dictConfig

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import Server

from app.life_span import life_span
from app.logging_config import logging_config
from app.routers import files
from app.routers import rating_template
from app.routers import state
from app.routers import websocket

ASSETS_FOLDER = os.path.join(os.path.dirname(__file__), 'app/assets')
CHECKSUM_FILE_PATH = os.path.join(ASSETS_FOLDER, 'checksum.json')
CHECKSUM_SERVER_ENDPOINT = 'https://mumas.org/backend/check_static_files'
ASSETS_ENDPOINT = 'https://mumas.org/static/'

app = FastAPI(lifespan=life_span)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(state.router)
app.include_router(websocket.router)
app.include_router(rating_template.router)
app.include_router(files.router)

if __name__ == '__main__':
    # Apply the logging configuration
    dictConfig(logging_config)

    config = uvicorn.Config(app, port=0)
    server: Server = uvicorn.Server(config)
    server.run()
