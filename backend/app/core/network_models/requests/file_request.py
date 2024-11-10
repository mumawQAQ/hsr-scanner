from pydantic import BaseModel


class GetFileRequest(BaseModel):
    file_path: str
    file_type: str
