from fastapi import APIRouter, HTTPException, Query, Depends
from app.schemas.conversation import ConversationCreate, ConversationResponse, ConversationList
from app.repository import conversation_repository
from app.core.security import get_current_user
from app.models.user import User
from app.repository.user_repository import is_admin_or_normal_user, is_bot_user

router = APIRouter()

@router.post("", response_model=ConversationResponse)
def create_conversation(
    conversation: ConversationCreate,
    current_user: User = Depends(get_current_user)
):
    if not is_bot_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        return conversation_repository.create_conversation(conversation)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{conversation_id}", response_model=ConversationResponse)
def get_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    conversation = conversation_repository.get_conversation(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation

@router.get("", response_model=ConversationList)
def list_conversations(
    page: int = Query(1, gt=0),
    size: int = Query(10, gt=0, le=100),
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    skip = (page - 1) * size
    conversations, total = conversation_repository.get_conversations_paginated(skip, size)
    return {
        "items": conversations,
        "total": total,
        "page": page,
        "size": size
    }

@router.put("/{conversation_id}", response_model=ConversationResponse)
def update_conversation(
    conversation_id: int,
    conversation: ConversationCreate,
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    updated_conversation = conversation_repository.update_conversation(conversation_id, conversation)
    if not updated_conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return updated_conversation

@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    if not conversation_repository.delete_conversation(conversation_id):
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Conversation deleted successfully"} 