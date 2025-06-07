from pydantic import BaseModel
from datetime import datetime
from typing import List

class UserFileBase(BaseModel):
    user_id: int
    file_id: int

class UserFileCreate(UserFileBase):
    pass

class UserFileResponse(UserFileBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserFileList(BaseModel):
    items: List[UserFileResponse]
    total: int 