from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.widget import Widget
from app.schemas.widget import WidgetCreate, WidgetUpdate

class WidgetRepository:
    def create(self, db: Session, *, widget_in: WidgetCreate, user_id: int) -> Widget:
        widget = Widget(
            name=widget_in.name,
            description=widget_in.description,
            type=widget_in.type,
            prompt=widget_in.prompt,
            user_id=user_id
        )
        db.add(widget)
        db.commit()
        db.refresh(widget)
        return widget

    def get_by_id(self, db: Session, widget_id: int) -> Optional[Widget]:
        return db.query(Widget).filter(Widget.id == widget_id).first()

    def get_by_user_id(self, db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Widget]:
        return db.query(Widget)\
            .filter(Widget.user_id == user_id)\
            .offset(skip)\
            .limit(limit)\
            .all()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Widget]:
        return db.query(Widget).offset(skip).limit(limit).all()

    def update(self, db: Session, *, widget: Widget, widget_in: WidgetUpdate) -> Widget:
        for field, value in widget_in.dict(exclude_unset=True).items():
            setattr(widget, field, value)
        db.add(widget)
        db.commit()
        db.refresh(widget)
        return widget

    def delete(self, db: Session, *, widget_id: int) -> bool:
        widget = db.query(Widget).filter(Widget.id == widget_id).first()
        if not widget:
            return False
        db.delete(widget)
        db.commit()
        return True 