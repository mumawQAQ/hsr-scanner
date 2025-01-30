import socketio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import Server

from app.core.state_machines.pipeline_state_machine import PipelineStateMachine
from app.life_span import life_span
from app.routers import config
from app.routers import files
from app.routers import rating_template
from app.routers import state

app = FastAPI(lifespan=life_span)
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=[])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(state.router)
app.include_router(rating_template.router)
app.include_router(files.router)
app.include_router(config.router, prefix="/config", tags=["Config Operations"])
app.mount("/", socketio.ASGIApp(sio))

current_runners = {}


@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")


@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    runner = current_runners.get(sid)
    if runner:
        await runner.handle_stop_pipeline()
        del current_runners[sid]


@sio.event
async def start_pipeline(sid, data):
    config_name = data.get("config_name")
    meta_data = data.get("meta_data")

    # Stop existing pipeline if running
    existing_runner = current_runners.get(sid)
    if existing_runner:
        await existing_runner.handle_stop_pipeline()

    # Create and start a new pipeline
    new_runner = PipelineStateMachine(config_name, meta_data, sio, sid)
    current_runners[sid] = new_runner
    await new_runner.handle_run_pipeline()


@sio.event
async def stop_pipeline(sid, data):
    runner = current_runners.get(sid)
    if runner:
        await runner.handle_stop_pipeline()
        del current_runners[sid]


if __name__ == '__main__':
    config = uvicorn.Config(app, port=0)
    server: Server = uvicorn.Server(config)
    server.run()
