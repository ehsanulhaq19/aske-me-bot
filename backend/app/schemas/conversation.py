from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ConversationBase(BaseModel):
    name: str
    type: str

class ConversationCreate(ConversationBase):
    pass

class ConversationResponse(ConversationBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ConversationList(BaseModel):
    items: List[ConversationResponse]
    total: int
    page: int
    size: int 