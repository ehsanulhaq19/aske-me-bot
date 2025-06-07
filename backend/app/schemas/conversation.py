from pydantic import BaseModel
from typing import List, Optional

class ConversationBase(BaseModel):
    name: str
    type: str

class ConversationCreate(ConversationBase):
    pass

class ConversationResponse(ConversationBase):
    id: int

    class Config:
        from_attributes = True

class ConversationList(BaseModel):
    items: List[ConversationResponse]
    total: int
    page: int
    size: int 