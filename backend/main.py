import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import Server

from app.life_span import life_span
from app.logging_config import set_log_level
from app.routers import config, websocket
from app.routers import files
from app.routers import pipeline
from app.routers import rating_template
from app.routers import state

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
app.include_router(config.router, prefix="/config", tags=["Config Operations"])

if __name__ == '__main__':
    set_log_level("INFO")

    config = uvicorn.Config(app, port=0)
    server: Server = uvicorn.Server(config)
    server.run()
