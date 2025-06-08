from pydantic import BaseModel, EmailStr
from app.core.config import settings
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    
class UserCreateGuest(UserBase):
    type: int = 4
    password: str = settings.GUEST_USER_PASSWORD

class UserOut(UserBase):
    id: int
    type: int

    model_config = {
        "from_attributes": True
    }

class UserOutExtended(UserOut):
    hashed_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    user: UserOut
    access_token: str
    token_type: str
    
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    
    class Config:
        from_attributes = True