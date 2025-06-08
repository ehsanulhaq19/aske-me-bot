from fastapi import APIRouter, HTTPException, Query, Depends
from app.schemas.message import MessageCreate, MessageResponse, MessageList
from app.repository import message_repository
from app.core.security import get_current_user
from app.models.user import User
from app.repository.user_repository import is_admin_or_normal_user, is_bot_user

router = APIRouter()

@router.post("", response_model=MessageResponse)
def create_message(
    message: MessageCreate,
    current_user: User = Depends(get_current_user)
):
    if not is_bot_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        return message_repository.create_message(message)
    except HTTPException as e:
        raise e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{message_id}", response_model=MessageResponse)
def get_message(
    message_id: int,
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    message = message_repository.get_message(message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message

@router.get("/conversation/{conversation_id}", response_model=MessageList)
def list_conversation_messages(
    conversation_id: int,
    page: int = Query(1, gt=0),
    size: int = Query(10, gt=0, le=100),
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    skip = (page - 1) * size
    messages, total = message_repository.get_conversation_messages(conversation_id, skip, size)
    return {
        "items": messages,
        "total": total,
        "page": page,
        "size": size
    }

@router.get("/user/{user_id}", response_model=MessageList)
def list_user_messages(
    user_id: int,
    page: int = Query(1, gt=0),
    size: int = Query(10, gt=0, le=100),
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    skip = (page - 1) * size
    messages, total = message_repository.get_user_messages(user_id, skip, size)
    return {
        "items": messages,
        "total": total,
        "page": page,
        "size": size
    }

@router.put("/{message_id}", response_model=MessageResponse)
def update_message(
    message_id: int,
    content: str,
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    updated_message = message_repository.update_message(message_id, content)
    if not updated_message:
        raise HTTPException(status_code=404, detail="Message not found")
    return updated_message

@router.delete("/{message_id}")
def delete_message(
    message_id: int,
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    if not message_repository.delete_message(message_id):
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message deleted successfully"} 