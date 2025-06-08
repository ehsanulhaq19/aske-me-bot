from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from app.db.database import Base

class File(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(512), index=True)
    path = Column(String(1024))
    document_ids = Column(String(1024), nullable=True)
    reference_document_ids = Column(String(1024), nullable=True)

    # Relationship
    users = relationship("User", secondary="user_files", back_populates="files")
