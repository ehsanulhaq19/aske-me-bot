from typing import List, Optional, Tuple
from sqlalchemy import and_
from fastapi import HTTPException

from app.db.session import get_db
from app.models.user_file import UserFile
from app.models.user import User
from app.models.file import File
from app.schemas.user_file import UserFileCreate, UserFileResponse

class UserFileRepository:
    def create_user_file(self, user_file: UserFileCreate) -> UserFileResponse:
        """Create a new user-file relationship"""
        with get_db() as db:
            # Check if user exists
            user = db.query(User).filter(User.id == user_file.user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Check if file exists
            file = db.query(File).filter(File.id == user_file.file_id).first()
            if not file:
                raise HTTPException(status_code=404, detail="File not found")
            
            # Check if relationship already exists
            existing = db.query(UserFile).filter(
                and_(
                    UserFile.user_id == user_file.user_id,
                    UserFile.file_id == user_file.file_id
                )
            ).first()
            if existing:
                raise HTTPException(status_code=400, detail="User already has access to this file")
            
            # Create new relationship
            db_user_file = UserFile(**user_file.model_dump())
            db.add(db_user_file)
            db.commit()
            db.refresh(db_user_file)
            return UserFileResponse.from_orm(db_user_file)

    def get_user_file(self, user_id: int, file_id: int) -> Optional[UserFileResponse]:
        """Get a specific user-file relationship"""
        with get_db() as db:
            user_file = db.query(UserFile).filter(
                and_(
                    UserFile.user_id == user_id,
                    UserFile.file_id == file_id
                )
            ).first()
            return UserFileResponse.from_orm(user_file) if user_file else None

    def get_user_files(self, user_id: int, skip: int = 0, limit: int = 100) -> Tuple[List[UserFileResponse], int]:
        """Get all files for a specific user with pagination"""
        with get_db() as db:
            # Get total count
            total = db.query(UserFile).filter(UserFile.user_id == user_id).count()
            
            # Get paginated results
            user_files = db.query(UserFile)\
                .filter(UserFile.user_id == user_id)\
                .offset(skip)\
                .limit(limit)\
                .all()
            
            return [UserFileResponse.from_orm(uf) for uf in user_files], total

    def get_file_users(self, file_id: int, skip: int = 0, limit: int = 100) -> Tuple[List[UserFileResponse], int]:
        """Get all users for a specific file with pagination"""
        with get_db() as db:
            # Get total count
            total = db.query(UserFile).filter(UserFile.file_id == file_id).count()
            
            # Get paginated results
            user_files = db.query(UserFile)\
                .filter(UserFile.file_id == file_id)\
                .offset(skip)\
                .limit(limit)\
                .all()
            
            return [UserFileResponse.from_orm(uf) for uf in user_files], total

    def delete_user_file(self, user_id: int, file_id: int) -> bool:
        """Remove a user's access to a file"""
        with get_db() as db:
            result = db.query(UserFile).filter(
                and_(
                    UserFile.user_id == user_id,
                    UserFile.file_id == file_id
                )
            ).delete()
            db.commit()
            return result > 0

    def delete_all_user_files(self, user_id: int) -> int:
        """Remove all file access for a user"""
        with get_db() as db:
            result = db.query(UserFile).filter(UserFile.user_id == user_id).delete()
            db.commit()
            return result

    def delete_all_file_users(self, file_id: int) -> int:
        """Remove all user access for a file"""
        with get_db() as db:
            result = db.query(UserFile).filter(UserFile.file_id == file_id).delete()
            db.commit()
            return result 