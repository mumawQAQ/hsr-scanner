import json
import os
from logging.config import dictConfig

import requests
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import Server

from app.life_span import life_span
from app.logging_config import logger
from app.logging_config import logging_config
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


def map_checksum_file_dict(checksum_file) -> dict:
    return {file['file']: file['checksum'] for file in checksum_file}


def map_checksum_file_json(checksum_file_dict) -> list:
    return [{'file': file, 'checksum': checksum} for file, checksum in checksum_file_dict.items()]


def check_asserts_update():
    with open(CHECKSUM_FILE_PATH, 'r+') as f:
        checksum_file = f.read()
        checksum_file = json.loads(checksum_file)
        # map the checksum file
        checksum_file_map = {file['file']: file['checksum'] for file in checksum_file}
        response = requests.post(CHECKSUM_SERVER_ENDPOINT, json={'file_with_checksum': checksum_file_map})
        if response.status_code == 200:
            response_json = response.json()
            if response_json['status'] == 'success':
                data = response_json['data']
                if data:
                    for file, checksum in data.items():
                        checksum_file_map[file] = checksum
                        # download the updated asserts
                        response = requests.get(f'{ASSETS_ENDPOINT}{file}')
                        if response.status_code == 200:
                            current_path = os.path.join(ASSETS_FOLDER, file)
                            # make sure the dir exists
                            os.makedirs(os.path.dirname(current_path), exist_ok=True)
                            with open(current_path, 'wb') as assert_f:
                                assert_f.write(response.content)
                            logger.info(f"Updated {file}")
                        else:
                            logger.error(f"Failed to download {file}: {response.text}")

                    # clear the file
                    f.seek(0)
                    f.truncate()
                    # write the new checksum file
                    f.write(json.dumps(map_checksum_file_json(checksum_file_map)))
                else:
                    logger.info("No asserts update")


        else:
            logger.error(f"Failed to check the asserts update: {response.text}")


if __name__ == '__main__':
    # Apply the logging configuration
    dictConfig(logging_config)
    # before running the server, make sure the assets are updated
    check_asserts_update()

    config = uvicorn.Config(app, port=0)
    server: Server = uvicorn.Server(config)
    server.run()
