import argparse
import json
import os

import requests

# Define constants
ASSETS_FOLDER = os.path.join(os.path.dirname(__file__), 'app/assets')
CHECKSUM_FILE_PATH = os.path.join(ASSETS_FOLDER, 'checksum.json')
CHECKSUM_SERVER_ENDPOINT = 'https://mumas.org/static/checksum.json'
ASSETS_ENDPOINT = 'https://mumas.org/static/'


def download_file(file: str) -> dict:
    download_status = {
        'status': True,
        'errors': [],
        'files': file
    }

    # Construct the download URL and local file path
    download_url = f'{ASSETS_ENDPOINT}{file}'
    current_path = os.path.join(ASSETS_FOLDER, file)

    try:
        # Send GET request to download the file
        response = requests.get(download_url)
        if response.status_code == 200:
            # Ensure the target directory exists
            os.makedirs(os.path.dirname(current_path), exist_ok=True)
            # Write the content to the local file
            with open(current_path, 'wb') as assert_f:
                assert_f.write(response.content)
        else:
            download_status['status'] = False
            error_msg = f"Failed to download resource: {file} (Status Code: {response.status_code})"
            download_status['errors'].append(error_msg)
    except Exception as e:
        download_status['status'] = False
        error_msg = f"Exception occurred while downloading {file}: {str(e)}"
        download_status['errors'].append(error_msg)

    return download_status


def check_asserts_update(is_download: bool):
    """
    Checks for updates by comparing local checksums with the server's checksums.
    Optionally downloads updated files if is_download is True.

    Args:
        is_download (bool): Whether to download the updated assets.
    """

    try:
        with open(CHECKSUM_FILE_PATH, 'r+') as f:
            checksum_file = f.read()
            checksum_file = json.loads(checksum_file)
            # map the checksum file
            checksum_file_map = {file['file']: file['checksum'] for file in checksum_file['files']}

            response = requests.get(CHECKSUM_SERVER_ENDPOINT)
            if response.status_code == 200:
                response_json = response.json()
                data = {file['file']: file['checksum'] for file in response_json['files']}

                files_need_update = []

                for file, checksum in data.items():
                    if checksum != checksum_file_map.get(file):
                        files_need_update.append(file)

                if files_need_update:
                    errors = []
                    if is_download:
                        for file in files_need_update:
                            download_state = download_file(file)
                            if download_state['status']:
                                checksum_file_map[file] = checksum
                            else:
                                errors.extend(download_state['errors'])

                        if len(errors) == 0:
                            # Update the checksum file if all downloads were successful
                            f.seek(0)
                            f.truncate()
                            f.write(json.dumps(response_json, ensure_ascii=False))

                        result = {
                            'update_needed': False,
                            'files': [],
                            'errors': errors
                        }
                    else:
                        # If not downloading, just list the files that need to be updated
                        result = {
                            'update_needed': True,
                            'files': files_need_update,
                            'errors': []
                        }
                else:
                    # No updates needed
                    result = {
                        'update_needed': False,
                        'files': [],
                        'errors': []
                    }

            else:
                error_msg = f"Failed to check for updates: HTTP {response.status_code} - {response.text}"
                result = {
                    'update_needed': False,
                    'files': [],
                    'errors': [error_msg]
                }
    except Exception as e:
        error_msg = f"An exception occurred: {str(e)}"
        result = {
            'update_needed': False,
            'files': [],
            'errors': [error_msg]
        }

    print(json.dumps(result, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description='Check asserts update.')
    parser.add_argument('--download', action='store_true', help='Whether to download the updated assets')

    args = parser.parse_args()

    check_asserts_update(args.download)


if __name__ == '__main__':
    main()
