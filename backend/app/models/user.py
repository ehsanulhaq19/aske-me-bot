from sqlalchemy import Column, Integer, String
from app.db.database import Base

ROLE_ADMIN = 1
ROLE_USER = 2

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(512), unique=True, index=True)
    hashed_password = Column(String(2024))
    type = Column(Integer, default=ROLE_USER)