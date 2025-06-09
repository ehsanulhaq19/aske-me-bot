from typing import List, Tuple, Optional
from fastapi import HTTPException
from sqlalchemy.orm import joinedload
from sqlalchemy import and_, or_, desc, asc

from app.db.session import get_db
from app.models.message import Message
from app.models.user import User
from app.models.conversation import Conversation
from app.schemas.message import MessageCreate, MessageResponse

def create_message(message: MessageCreate) -> MessageResponse:
    with get_db() as db:
        # Check if sender exists
        sender = db.query(User).filter(User.id == message.sender_id).first()
        if not sender:
            raise HTTPException(status_code=404, detail="Sender not found")
        
        # Check if conversation exists
        conversation = db.query(Conversation).filter(Conversation.id == message.conversation_id).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        db_message = Message(
            sender_id=message.sender_id,
            content=message.content,
            conversation_id=message.conversation_id
        )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return MessageResponse.from_orm(db_message)

def get_message(message_id: int) -> Optional[MessageResponse]:
    with get_db() as db:
        message = db.query(Message).options(
            joinedload(Message.sender),
            joinedload(Message.conversation)
        ).filter(Message.id == message_id).first()
        if not message:
            return None
        return MessageResponse.from_orm(message)

def get_conversation_messages(conversation_id: int, skip: int = 0, limit: int = 10, order_by: str = "created_at", order_direction: str = "desc") -> Tuple[List[MessageResponse], int]:
    with get_db() as db:
        total = db.query(Message).filter(Message.conversation_id == conversation_id).count()
        order_column = getattr(Message, order_by)
        if order_direction.lower() == "desc":
            order_column = desc(order_column)
        else:
            order_column = asc(order_column)
            
        messages = db.query(Message).options(
            joinedload(Message.sender),
            joinedload(Message.conversation)
        ).filter(Message.conversation_id == conversation_id).order_by(order_column).offset(skip).limit(limit).all()
        return [MessageResponse.from_orm(m) for m in messages], total

def get_user_messages(user_id: int, skip: int = 0, limit: int = 10) -> Tuple[List[MessageResponse], int]:
    with get_db() as db:
        total = db.query(Message).filter(
            or_(Message.sender_id == user_id, Message.sender_id == user_id)
        ).count()
        messages = db.query(Message).options(
            joinedload(Message.sender),
            joinedload(Message.conversation)
        ).filter(
            or_(Message.sender_id == user_id, Message.sender_id == user_id)
        ).offset(skip).limit(limit).all()
        return [MessageResponse.from_orm(m) for m in messages], total

def update_message(message_id: int, content: str) -> Optional[MessageResponse]:
    with get_db() as db:
        db_message = db.query(Message).filter(Message.id == message_id).first()
        if not db_message:
            return None
        
        db_message.content = content
        db.commit()
        db.refresh(db_message)
        return MessageResponse.from_orm(db_message)

def delete_message(message_id: int) -> bool:
    with get_db() as db:
        message = db.query(Message).filter(Message.id == message_id).first()
        if not message:
            return False
        db.delete(message)
        db.commit()
        return True 