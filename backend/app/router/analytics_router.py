from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.models.user import User
from app.repository.user_repository import is_admin_user
from app.repository import analytics_repository
from app.schemas.analytics import SystemAnalytics

router = APIRouter()

@router.get("/system", response_model=SystemAnalytics)
def get_system_analytics(
    current_user: User = Depends(get_current_user)
):
    if not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Only admin users can access analytics")
    
    return analytics_repository.get_system_analytics() 