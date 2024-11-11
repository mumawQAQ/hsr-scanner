from logging.config import dictConfig

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import Server

from app.life_span import life_span
from app.logging_config import logging_config
from app.routers import files
from app.routers import pipeline
from app.routers import rating_template
from app.routers import state
from app.routers import websocket

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
app.include_router(pipeline.router, prefix="/pipeline", tags=["Pipeline Operations"])

if __name__ == '__main__':
    # Apply the logging configuration
    dictConfig(logging_config)

    config = uvicorn.Config(app, port=0)
    server: Server = uvicorn.Server(config)
    server.run()
