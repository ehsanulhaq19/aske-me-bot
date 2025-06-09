from app.models.user import User, TYPE_BOT
from app.models.widget import Widget
from app.models.file import File
from app.schemas.widget import WidgetCreate, WidgetResponse, WidgetUserResponse
from app.core.security import hash_password
from app.db.session import get_db
from typing import List, Tuple
from sqlalchemy.orm import joinedload
from datetime import datetime
from app.repository.conversation_repository import get_conversations_by_user_id

def create_widget(widget: WidgetCreate) -> WidgetResponse:
    with get_db() as db:
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        widget_name = widget.name.lower().replace(" ", "_")
        widget_email = f"{widget_name}_{timestamp}@widget.com"
        widget_name = f"{widget_name} Widget"
        widget_password = f"{widget_name}123"

        db_widget_user = User(
            email=widget_email,
            name=widget_name,
            hashed_password=hash_password(widget_password),
            type=TYPE_BOT
        )
        db.add(db_widget_user)
        db.commit()
        db.refresh(db_widget_user)

        widget_model = Widget(
            name=widget.name,
            description=widget.description,
            type=widget.type,
            prompt=widget.prompt,
            user_id=db_widget_user.id,
        )
        db.add(widget_model)
        db.commit()
        db.refresh(widget_model)
        
        if widget.file_ids:
            for file_id in widget.file_ids:
                db_file = db.query(File).filter(File.id == file_id).first()
                if db_file:
                    db_widget_user.files.append(db_file)
        
        db.commit()
        db.refresh(db_widget_user)
        
        widget_model = db.query(Widget).options(
            joinedload(Widget.user).joinedload(User.files)
        ).filter(Widget.id == widget_model.id).first()
        
        return WidgetResponse.from_orm(widget_model)

def delete_widget(widget_id: int) -> bool:
    with get_db() as db:
        widget = db.query(Widget).filter(Widget.id == widget_id).first()
        if not widget:
            return False
        
        db_widget_user = widget.user
        if not db_widget_user:
            return False
        
        files_to_delete = db_widget_user.files
        for file in files_to_delete:
            db_widget_user.files.remove(file)
        
        db.delete(db_widget_user)
        db.delete(widget)
        db.commit()
        
        return True
    
def get_widget(widget_id: int) -> WidgetResponse:
    with get_db() as db:
        widget = db.query(Widget).options(
            joinedload(Widget.user).joinedload(User.files)
        ).filter(Widget.id == widget_id).first()
        if not widget:
            return None
        
        return WidgetResponse.from_orm(widget)
    
def get_bot_widget(bot_id: int) -> WidgetUserResponse:
    with get_db() as db:
        widget = db.query(Widget).options(
            joinedload(Widget.user).joinedload(User.files)
        ).filter(Widget.id == bot_id).first()
        if not widget:
            return None
        
        return WidgetUserResponse.from_orm(widget)
    
def get_bot_widget_by_user_id(user_id: int) -> WidgetResponse:
    with get_db() as db:
        widget = db.query(Widget).options(
            joinedload(Widget.user).joinedload(User.files)
        ).filter(Widget.user_id == user_id).first()
        if not widget:
            return None
        return WidgetResponse.from_orm(widget)
    
def update_widget(widget_id: int, widget: WidgetCreate) -> WidgetResponse:
    with get_db() as db:
        db_widget = db.query(Widget).filter(Widget.id == widget_id).first()
        if not db_widget:
            return None
            
        if widget.name:
            db_widget.name = widget.name
        if widget.description:
            db_widget.description = widget.description
        if widget.type:
            db_widget.type = widget.type
        if widget.prompt:
            db_widget.prompt = widget.prompt
            
        # Update files
        if widget.file_ids is not None:
            db_widget.user.files = []
            for file_id in widget.file_ids:
                db_file = db.query(File).filter(File.id == file_id).first()
                if db_file:
                    db_widget.user.files.append(db_file)
        
        db.commit()
        
        # Refresh widget with user files
        db_widget = db.query(Widget).options(
            joinedload(Widget.user).joinedload(User.files)
        ).filter(Widget.id == widget_id).first()
        
        return WidgetResponse.from_orm(db_widget)

def get_widgets_paginated(skip: int, limit: int) -> Tuple[List[WidgetResponse], int]:
    with get_db() as db:
        total = db.query(Widget).count()
        
        widgets = db.query(Widget)\
            .options(joinedload(Widget.user).joinedload(User.files))\
            .offset(skip)\
            .limit(limit)\
            .all()
        
        widgets_with_conversations = [WidgetResponse.from_orm(w) for w in widgets]
        for widget in widgets_with_conversations:
            widget.total_conversations = get_conversations_by_user_id(widget.user_id)[1]
        return widgets_with_conversations, total 