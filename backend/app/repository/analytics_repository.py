from app.db.session import get_db
from app.models.widget import Widget
from app.models.user import User
from app.models.file import File
from app.models.conversation import Conversation
from typing import Dict

def get_system_analytics() -> Dict:
    """Get system-wide analytics including total counts of various entities"""
    with get_db() as db:
        total_widgets = db.query(Widget).count()
        total_type_4_users = db.query(User).filter(User.type == 4).count()
        total_files = db.query(File).count()
        total_conversations = db.query(Conversation).count()
        
        return {
            "total_widgets": total_widgets,
            "total_type_4_users": total_type_4_users,
            "total_files": total_files,
            "total_conversations": total_conversations
        } 