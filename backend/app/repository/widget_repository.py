from app.models.user import User, TYPE_BOT
from app.models.widget import Widget
from app.models.file import File
from app.schemas.widget import WidgetCreate, WidgetResponse
from app.core.security import hash_password
from app.db.session import get_db
from typing import List, Tuple

def create_widget(widget: WidgetCreate) -> WidgetResponse:
    with get_db() as db:
        widget_email = f"{widget.name}@widget.com"
        widget_name = f"{widget.name} Widget"
        widget_password = f"{widget.name}123"

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
        widget = db.query(Widget).filter(Widget.id == widget_id).first()
        if not widget:
            return None
        return WidgetResponse.from_orm(widget)
    
def update_widget(widget_id: int, widget: WidgetCreate) -> WidgetResponse:
    with get_db() as db:
        widget = db.query(Widget).filter(Widget.id == widget_id).first()
        if not widget:
            return None
        if widget.name:
            widget.name = widget.name
        if widget.description:
            widget.description = widget.description
        if widget.type:
            widget.type = widget.type
        if widget.file_ids:
            widget.files = []
            for file_id in widget.file_ids:
                db_file = db.query(File).filter(File.id == file_id).first()
                if db_file:
                    widget.files.append(db_file)
        else:
            widget.files = []
        if widget.prompt:
            widget.prompt = widget.prompt
        
        db.commit()
        db.refresh(widget)

def get_widgets_paginated(skip: int, limit: int) -> Tuple[List[WidgetResponse], int]:
    with get_db() as db:
        total = db.query(Widget).count()
        
        widgets = db.query(Widget)\
            .offset(skip)\
            .limit(limit)\
            .all()
        
        return [WidgetResponse.from_orm(w) for w in widgets], total 