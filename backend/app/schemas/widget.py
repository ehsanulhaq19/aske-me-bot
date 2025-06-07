from pydantic import BaseModel, EmailStr
from typing import List, Optional

class WidgetCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class WidgetResponse(BaseModel):
    id: int
    name: str
    email: str
    type: int

    class Config:
        from_attributes = True

class WidgetList(BaseModel):
    items: List[WidgetResponse]
    total: int
    page: int
    size: int 