from pydantic import BaseModel, EmailStr
from typing import List, Optional
import base64
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
    files: List[FileOut] = [],
    widget_encoded_id: str = None
    
    class Config:
        from_attributes = True
        
    @classmethod
    def from_orm(cls, obj):
        encoded_id = base64.b64encode(str(obj.id).encode()).decode()
        
        instance = cls(
            id=obj.id,
            name=obj.name,
            description=obj.description,
            prompt=obj.prompt,
            type=obj.type,
            files=[],
            widget_encoded_id=encoded_id
        )
        
        if hasattr(obj, 'user') and obj.user and hasattr(obj.user, 'files'):
            instance.files = [FileOut.from_orm(file) for file in obj.user.files]
            
        return instance

class WidgetList(BaseModel):
    items: List[WidgetResponse]
    total: int
    page: int
    size: int 