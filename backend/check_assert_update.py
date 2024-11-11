import argparse
import json
import os

import requests

# Define constants
ASSETS_FOLDER = os.path.join(os.path.dirname(__file__), 'app/assets')
CHECKSUM_FILE_PATH = os.path.join(ASSETS_FOLDER, 'checksum.json')
CHECKSUM_SERVER_ENDPOINT = 'https://mumas.org/backend/check_static_files'
ASSETS_ENDPOINT = 'https://mumas.org/static/'


def download_file(file: str) -> dict:
    """
    Downloads a file from the ASSETS_ENDPOINT and saves it to the ASSETS_FOLDER.
    If the file name contains 'img_meta', it recursively downloads the listed image files.

    Args:
        file (str): The relative path of the file to download.

    Returns:
        dict: A dictionary containing the download status, any errors, and the list of files processed.
    """
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

    # If the file is an img_meta file, recursively download listed images
    if 'img_meta' in file:
        try:
            with open(current_path, 'r', encoding='utf-8') as f:
                for line in f:
                    img_path = line.strip()
                    if img_path:
                        state = download_file(img_path)
                        if not state['status']:
                            download_status['status'] = False
                            download_status['errors'].extend(state['errors'])
        except Exception as e:
            download_status['status'] = False
            error_msg = f"Failed to process img_meta file {current_path}: {str(e)}"
            download_status['errors'].append(error_msg)

    return download_status


def map_checksum_file_json(checksum_file_dict: dict) -> list:
    """
    Converts the checksum dictionary to a list of dictionaries suitable for JSON serialization.

    Args:
        checksum_file_dict (dict): A dictionary mapping file names to their checksums.

    Returns:
        list: A list of dictionaries with 'file' and 'checksum' keys.
    """
    return [{'file': file, 'checksum': checksum} for file, checksum in checksum_file_dict.items()]


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
            checksum_file_map = {file['file']: file['checksum'] for file in checksum_file}
            response = requests.post(CHECKSUM_SERVER_ENDPOINT, json={'file_with_checksum': checksum_file_map})
            if response.status_code == 200:
                response_json = response.json()
                if response_json['status'] == 'success':
                    data = response_json['data']
                    if data:
                        errors = []
                        if is_download:
                            for file, checksum in data.items():
                                download_state = download_file(file)
                                if download_state['status']:
                                    checksum_file_map[file] = checksum
                                else:
                                    errors.extend(download_state['errors'])

                            # Update the checksum file if downloads were successful
                            f.seek(0)
                            f.truncate()
                            f.write(
                                json.dumps(map_checksum_file_json(checksum_file_map), ensure_ascii=False))

                            result = {
                                'update_needed': False,
                                'files': [],
                                'errors': errors
                            }
                        else:
                            # If not downloading, just list the files that need to be updated
                            result = {
                                'update_needed': True,
                                'files': list(data.keys()),
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
                    error_msg = f"Server responded with failure status: {response_json.get('message', 'No message provided')}"
                    result = {
                        'update_needed': False,
                        'files': [],
                        'errors': [error_msg]
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
