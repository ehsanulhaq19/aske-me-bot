from fastapi import HTTPException
from app.db.session import get_db
from app.models.file import File
from app.schemas.file import FileMetaSchema

class MetadataRepository:
    def save_file_metadata(self, name: str, path: str, document_ids: str = None):
        with get_db() as db:
            meta = File(filename=name, path=path, document_ids=document_ids)
            db.add(meta)

    def remove_file_metadata(self, id: int):
        with get_db() as db:
            db.query(File).filter(File.id == id).delete()

    def list_files(self):
        with get_db() as db:
            files = db.query(File).all()
            return [FileMetaSchema.from_orm(file) for file in files]

    def get_file(self, name: str):
        with get_db() as db:
            file = db.query(File).filter(File.filename == name).first()
            if not file:
                raise HTTPException(status_code=404, detail="File not found")
            return file

    def update_file(self, name: str, new_name: str):
        with get_db() as db:
            file = db.query(File).filter(File.filename == name).first()
            if not file:
                raise HTTPException(status_code=404, detail="File not found")
            file.filename = new_name
            return {"message": f"File name updated to {new_name}"}
        
    def get_file_by_id(self, file_id: int):
        with get_db() as db:
            file = db.query(File).filter(File.id == file_id).first()
            if not file:
                raise HTTPException(status_code=404, detail="File not found")
            return FileMetaSchema.from_orm(file)
