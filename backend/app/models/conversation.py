from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from app.db.database import Base

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(512), index=True)
    type = Column(String(256))

    # Relationship with messages
    messages = relationship("Message", back_populates="conversation") 