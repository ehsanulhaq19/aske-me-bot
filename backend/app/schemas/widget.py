from pydantic import BaseModel, EmailStr
from typing import List, Optional
from app.schemas.file import FileOut

class WidgetCreate(BaseModel):
    name: str
    description: str
    type: str
    prompt: str
    file_ids: List[int]

class WidgetResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    prompt: Optional[str] = None
    type: str
    class Config:
        from_attributes = True

class WidgetList(BaseModel):
    items: List[WidgetResponse]
    total: int
    page: int
    size: int 