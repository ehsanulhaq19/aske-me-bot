from pydantic import BaseModel, EmailStr
from typing import List, Optional
import base64
from app.schemas.file import FileOut
from app.schemas.user import UserResponse
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
    user_id: int = None,
    widget_encoded_id: str = None
    total_conversations: int = 0
    
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
            widget_encoded_id=encoded_id,
            user_id=obj.user_id,
            total_conversations=obj.total_conversations if hasattr(obj, 'total_conversations') else 0
        )
        
        if hasattr(obj, 'user') and obj.user and hasattr(obj.user, 'files'):
            instance.files = [FileOut.from_orm(file) for file in obj.user.files]
            
        return instance

class WidgetList(BaseModel):
    items: List[WidgetResponse]
    total: int
    page: int
    size: int 
    
class WidgetBotResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    type: str
    user_id: int
    token: str
    
class WidgetUserResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    type: str
    user: UserResponse
    
    class Config:
        from_attributes = True

class BotQueryCreate(BaseModel):
    content: str
    
class BotQueryResponse(BaseModel):
    content: str