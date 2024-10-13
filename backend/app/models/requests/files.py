from pydantic import BaseModel


class GetFile(BaseModel):
    file_path: str
    file_type: str
