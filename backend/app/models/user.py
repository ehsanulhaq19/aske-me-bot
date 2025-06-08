from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

TYPE_ADMIN = 1
TYPE_USER = 2
TYPE_BOT = 3
TYPE_GUEST = 4

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(512), unique=True, index=True)
    hashed_password = Column(String(2024))
    type = Column(Integer, default=TYPE_USER)

    # Relationship
    files = relationship("File", secondary="user_files", back_populates="users")
    widget = relationship("Widget", back_populates="user")