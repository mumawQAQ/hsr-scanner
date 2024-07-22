import uvicorn
from fastapi import FastAPI
from uvicorn import Server

from app.routers import websocket

app = FastAPI()

# include all the routers here
app.include_router(websocket.router)


def server_started(server):
    for server in server.servers:
        for socket in server.sockets:
            # write to a json file about the host and port
            with open('server.json', 'w') as f:
                f.write(f'{{"host": "{socket.getsockname()[0]}", "port": {socket.getsockname()[1]}}}')


if __name__ == '__main__':
    config = uvicorn.Config(app, port=0)
    server: Server = uvicorn.Server(config)

    orig_log_started_message = server._log_started_message


    def patch_log_started_message(listeners):
        orig_log_started_message(listeners)
        server_started(server)


    server._log_started_message = patch_log_started_message

    server.run()
