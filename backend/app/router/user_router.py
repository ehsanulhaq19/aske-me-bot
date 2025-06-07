from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user import UserCreate, UserOut, UserLogin, Token
from app.repository.user_repository import create_user, get_user_by_email, delete_user, is_admin_user
from app.core.security import verify_password, create_access_token, get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register_user(user: UserCreate, current_user: User = Depends(get_current_user)):
    if not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Not authorized")
    db_user = get_user_by_email(user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(user)

@router.post("/login", response_model=Token)
def login(user: UserLogin):
    db_user = get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token(data={"sub": user.email})
    return {"user": UserOut.from_orm(db_user), "access_token": token, "token_type": "bearer"}

@router.delete("/{user_id}")
def delete_user_endpoint(user_id: int, current_user: User = Depends(get_current_user)):
    if not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="Not authorized")
    deleted = delete_user(user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
