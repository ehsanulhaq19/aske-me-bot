from pydantic import BaseModel

class SystemAnalytics(BaseModel):
    total_widgets: int
    total_type_4_users: int
    total_files: int
    total_conversations: int
    
    model_config = {
        "from_attributes": True
    } 