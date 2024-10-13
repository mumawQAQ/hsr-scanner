import argparse
import json
import os

import requests

ASSETS_FOLDER = os.path.join(os.path.dirname(__file__), 'app/assets')
CHECKSUM_FILE_PATH = os.path.join(ASSETS_FOLDER, 'checksum.json')
CHECKSUM_SERVER_ENDPOINT = 'https://mumas.org/backend/check_static_files'
ASSETS_ENDPOINT = 'https://mumas.org/static/'


def download_file(file: str):
    download_status = {
        'status': True,
        'errors': [],
        'files': file
    }

    # download the updated asserts
    response = requests.get(f'{ASSETS_ENDPOINT}{file}')
    current_path = os.path.join(ASSETS_FOLDER, file)
    if response.status_code == 200:
        # make sure the dir exists
        os.makedirs(os.path.dirname(current_path), exist_ok=True)
        with open(current_path, 'wb') as assert_f:
            assert_f.write(response.content)
    else:
        download_status['status'] = False
        download_status['errors'].append(f"下载资源失败: {file}")

    # check if the file path contain img_meta
    if 'img_meta' in file:
        # read all the image from the file
        with open(current_path, 'r') as f:
            for line in f:
                img_path = line.strip()
                state = download_file(img_path)
                if not state['status']:
                    download_status['status'] = False
                    download_status['errors'].extend(state['errors'])

    return download_status


def map_checksum_file_json(checksum_file_dict: dict) -> list:
    return [{'file': file, 'checksum': checksum} for file, checksum in checksum_file_dict.items()]


def check_asserts_update(is_download: bool):
    try:
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
                        errors = []

                        need_to_download = {}
                        # generate the diff between the checksum file and the new checksum
                        for file, checksum in data.items():
                            if file not in checksum_file_map or checksum_file_map[file] != checksum:
                                need_to_download[file] = checksum
                                break

                        if is_download:
                            for file, checksum in need_to_download.items():
                                download_state = download_file(file)
                                if download_state['status']:
                                    checksum_file_map[file] = checksum
                                else:
                                    errors.extend(download_state['errors'])

                            # clear the file
                            f.seek(0)
                            f.truncate()
                            # write the new checksum file
                            f.write(json.dumps(map_checksum_file_json(checksum_file_map)))

                        result = {
                            'update_needed': True if is_download else False,
                            'files': list(need_to_download.keys()) if not is_download else [],
                            'errors': errors
                        }
                    else:
                        result = {
                            'update_needed': False,
                            'files': [],
                            'errors': []
                        }
            else:
                result = {
                    'update_needed': False,
                    'files': [],
                    'errors': [f"获取资源更新失败: {response.text}"]
                }
    except Exception as e:
        result = {
            'update_needed': False,
            'files': [],
            'errors': [f"获取资源更新失败: {str(e)}"]
        }

    print(json.dumps(result))


def main():
    parser = argparse.ArgumentParser(description='Check asserts update.')
    parser.add_argument('--download', type=bool, required=True, help='whether to download the updated asserts')

    args = parser.parse_args()

    check_asserts_update(args.download)
