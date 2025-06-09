from fastapi import APIRouter, HTTPException, Query, Depends, Request
from app.schemas.widget import WidgetCreate, WidgetResponse, WidgetList, WidgetBotResponse, BotQueryCreate, BotQueryResponse
from app.repository import widget_repository
from app.repository.user_repository import is_admin_or_normal_user, is_bot_user
from app.core.security import get_current_user, create_access_token
from app.models.user import User
from app.repository.user_file_repository import UserFileRepository
from app.schemas.user_file import UserFileCreate
from app.core.config import settings
from app.services import qa_service
from app.repository.file_repository import MetadataRepository

router = APIRouter()
user_file_repository = UserFileRepository()
file_repository = MetadataRepository()

@router.post("/register", response_model=WidgetResponse)
def create_widget(widget: WidgetCreate, current_user: User = Depends(get_current_user)):
    try:
        if not is_admin_or_normal_user(current_user):
            raise HTTPException(status_code=403, detail="Forbidden")
        return widget_repository.create_widget(widget)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{widget_id}")
def delete_widget(widget_id: int, current_user: User = Depends(get_current_user)):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    if not widget_repository.delete_widget(widget_id):
        raise HTTPException(status_code=404, detail="Widget not found")
    return {"message": "Widget deleted successfully"}

@router.get("", response_model=WidgetList)
def list_widgets(
    page: int = Query(1, gt=0),
    size: int = Query(10, gt=0, le=100),
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    skip = (page - 1) * size
    widgets, total = widget_repository.get_widgets_paginated(skip, size)
    return {
        "items": widgets,
        "total": total,
        "page": page,
        "size": size
    }

@router.post("/{widget_id}/files/{file_id}")
def associate_file_with_widget(
    widget_id: int,
    file_id: int,
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        user_file = UserFileCreate(user_id=widget_id, file_id=file_id)
        user_file_repository.create_user_file(user_file)
        return {"message": "File associated with widget successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{widget_id}/files/{file_id}")
def disassociate_file_from_widget(
    widget_id: int,
    file_id: int,
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    if user_file_repository.delete_user_file(widget_id, file_id):
        return {"message": "File disassociated from widget successfully"}
    raise HTTPException(status_code=404, detail="Association between widget and file not found") 

@router.put("/{widget_id}")
def update_widget(
    widget_id: int,
    widget: WidgetCreate,
    current_user: User = Depends(get_current_user)
):
    if not is_admin_or_normal_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    return widget_repository.update_widget(widget_id, widget)

@router.get("/bot/{bot_id}", response_model=WidgetBotResponse)
def get_widget(bot_id: int, request: Request):
    request_from = request.headers.get("referer")
    frontend_url = f"{settings.FRONTEND_URL}/"
    if request_from != frontend_url:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    widget = widget_repository.get_bot_widget(bot_id)
    widget_user = widget.user
    if not widget_user:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    token = create_access_token(data={"sub": widget_user.email})
    return WidgetBotResponse(
        id=widget.id,
        name=widget.name,
        description=widget.description,
        type=widget.type,
        user_id=widget_user.id,
        token=token
    )
    
@router.post("/bot/query", response_model=BotQueryResponse)
def query_bot(query: BotQueryCreate, current_user: User = Depends(get_current_user)):
    if not is_bot_user(current_user):
        raise HTTPException(status_code=403, detail="Forbidden")
    
    widget = widget_repository.get_bot_widget_by_user_id(current_user.id)
    if not widget:
        raise HTTPException(status_code=404, detail="Widget not found")
    
    user_files, _ = user_file_repository.get_user_files(current_user.id)
    file_ids = [user_file.file_id for user_file in user_files]
    files = file_repository.get_files_by_ids(file_ids)
    
    reference_document_ids = [file.reference_document_ids for file in files] if files else []
    if not reference_document_ids:
        return BotQueryResponse(content="I apologize, but I don't have enough information in my knowledge base to answer this question accurately.")
    content = qa_service.answer_query(query.content, reference_document_ids, widget.type, widget.prompt)
    if content and content.get("answer"):
        return BotQueryResponse(content=content.get("answer"))
    else:
        return BotQueryResponse(content="I'm sorry, I can't answer that question.")