from app.models.user import User, TYPE_BOT
from app.schemas.widget import WidgetCreate, WidgetResponse
from app.core.security import hash_password
from app.db.session import get_db
from typing import List, Tuple

def create_widget(widget: WidgetCreate) -> WidgetResponse:
    with get_db() as db:
        existing_user = db.query(User).filter(User.email == widget.email).first()
        if existing_user:
            raise ValueError("Email already registered")
        
        db_widget = User(
            email=widget.email,
            name=widget.name,
            hashed_password=hash_password(widget.password),
            type=TYPE_BOT
        )
        db.add(db_widget)
        db.commit()
        db.refresh(db_widget)
        return WidgetResponse.from_orm(db_widget)

def delete_widget(widget_id: int) -> bool:
    with get_db() as db:
        widget = db.query(User).filter(
            User.id == widget_id,
            User.type == TYPE_BOT
        ).first()
        
        if not widget:
            return False
        
        db.delete(widget)
        db.commit()
        return True

def get_widgets_paginated(skip: int, limit: int) -> Tuple[List[WidgetResponse], int]:
    with get_db() as db:
        total = db.query(User).filter(User.type == TYPE_BOT).count()
        
        widgets = db.query(User)\
            .filter(User.type == TYPE_BOT)\
            .offset(skip)\
            .limit(limit)\
            .all()
        
        return [WidgetResponse.from_orm(w) for w in widgets], total 