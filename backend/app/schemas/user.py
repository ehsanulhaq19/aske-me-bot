from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

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