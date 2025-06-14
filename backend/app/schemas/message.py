from pydantic import BaseModel
from typing import List, Optional
from .user import UserOut
from .conversation import ConversationResponse
from datetime import datetime
from .widget import WidgetResponse

class MessageBase(BaseModel):
    content: str
    sender_id: int
    conversation_id: int

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: int
    sender: Optional[UserOut]
    conversation: Optional[ConversationResponse]
    created_at: datetime

    class Config:
        from_attributes = True

class MessageList(BaseModel):
    items: List[MessageResponse]
    total: int
    page: int
    size: int

class LatestMessageResponse(BaseModel):
    conversation_name: str
    sender_email: str
    sender_name: str
    created_at: datetime
    widget: Optional[WidgetResponse] = None
    message_content: str

    class Config:
        from_attributes = True

class LatestMessagesResponse(BaseModel):
    items: List[LatestMessageResponse] 