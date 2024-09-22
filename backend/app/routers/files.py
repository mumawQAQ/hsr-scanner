import base64
import json
import os

from fastapi import APIRouter

from app.models.requests.files import GetFile

router = APIRouter()

FILE_FOLDER_PATH = os.path.join(os.path.dirname(__file__), '../assets')


@router.post("/files")
def get_files(request: GetFile):
    file_path = os.path.join(FILE_FOLDER_PATH, request.file_path)
    if not os.path.exists(file_path):
        return {'status': 'failed', 'message': f"File {file_path} not found"}

    # base on the file type, return the file content
    if request.file_type == 'img':
        with open(file_path, 'rb') as f:
            img_data = f.read()
        base64_data = base64.b64encode(img_data).decode('utf-8')
        data_url = f'data:image/png;base64,{base64_data}'
        return {'status': 'success', 'data': data_url}
    elif request.file_type == 'json':
        with open(file_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        return {'status': 'success', 'data': json.dumps(json_data)}
    else:
        return {'status': 'failed', 'message': 'Invalid file type'}
