from typing import List, Tuple, Optional
from fastapi import HTTPException
from sqlalchemy.orm import joinedload
from sqlalchemy import distinct, desc, asc

from app.db.session import get_db
from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.conversation import ConversationCreate, ConversationResponse

def create_conversation(conversation: ConversationCreate) -> ConversationResponse:
    with get_db() as db:
        db_conversation = Conversation(
            name=conversation.name,
            type=conversation.type
        )
        db.add(db_conversation)
        db.commit()
        db.refresh(db_conversation)
        return ConversationResponse.from_orm(db_conversation)

def get_conversation(conversation_id: int) -> Optional[ConversationResponse]:
    with get_db() as db:
        conversation = db.query(Conversation).options(
            joinedload(Conversation.messages)
        ).filter(Conversation.id == conversation_id).first()
        if not conversation:
            return None
        return ConversationResponse.from_orm(conversation)

def get_conversations_paginated(skip: int = 0, limit: int = 10) -> Tuple[List[ConversationResponse], int]:
    with get_db() as db:
        total = db.query(Conversation).count()
        conversations = db.query(Conversation).options(
            joinedload(Conversation.messages)
        ).offset(skip).limit(limit).all()
        return [ConversationResponse.from_orm(c) for c in conversations], total

def update_conversation(conversation_id: int, conversation: ConversationCreate) -> Optional[ConversationResponse]:
    with get_db() as db:
        db_conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not db_conversation:
            return None
        
        if conversation.name:
            db_conversation.name = conversation.name
        if conversation.type:
            db_conversation.type = conversation.type
            
        db.commit()
        db.refresh(db_conversation)
        return ConversationResponse.from_orm(db_conversation)

def delete_conversation(conversation_id: int) -> bool:
    with get_db() as db:
        conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conversation:
            return False
        db.delete(conversation)
        db.commit()
        return True

def get_conversations_by_user_id(user_id: int, skip: int = 0, limit: int = 10, order_by: str = "created_at", order_direction: str = "desc") -> Tuple[List[ConversationResponse], int]:
    with get_db() as db:
        query = db.query(Conversation).distinct().join(
            Conversation.messages
        ).filter(
            Message.sender_id == user_id
        )
        
        total = query.count()
        
        order_column = getattr(Conversation, order_by)
        if order_direction.lower() == "desc":
            order_column = desc(order_column)
        else:
            order_column = asc(order_column)
            
        conversations = query.options(
            joinedload(Conversation.messages)
        ).order_by(order_column).offset(skip).limit(limit).all()
        
        return [ConversationResponse.from_orm(c) for c in conversations], total 