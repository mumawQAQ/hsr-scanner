import uvicorn
from fastapi import FastAPI
from uvicorn import Server

from app.life_span import life_span
from app.routers import websocket, state

app = FastAPI(lifespan=life_span)

# include all the routers here
app.include_router(websocket.router)
app.include_router(state.router)

if __name__ == '__main__':
    config = uvicorn.Config(app, port=0)
    server: Server = uvicorn.Server(config)
    server.run()
