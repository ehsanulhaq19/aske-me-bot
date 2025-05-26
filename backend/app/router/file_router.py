from fastapi import APIRouter, UploadFile, File, Query, Response, status, Depends
from app.services import file_service, qa_service
from app.schemas.file import FileMetaSchema
from typing import List
from app.repository.file_repository import MetadataRepository
from app.models.user import User
from app.core.security import get_current_user

router = APIRouter()
metadata_repository = MetadataRepository()

@router.post("/upload")
async def upload(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    result = await file_service.upload_file(file)
    document_ids = result.get("document_ids")
    file_path = result.get("file_path")
    document_ids_str = ",".join(map(str, document_ids)) if document_ids else None
    metadata_repository.save_file_metadata(
        file.filename,
        file_path,
        document_ids=document_ids_str
    )
    return {"message": f"{file.filename} uploaded and embedded successfully."}

@router.delete("/delete")
def delete(file_id: int = Query(...), current_user: User = Depends(get_current_user)):
    file = metadata_repository.get_file_by_id(file_id)
    document_ids = file.document_ids.split(",") if file.document_ids else []
    if document_ids:
        file_service.delete_file(file.filename, document_ids)
    metadata_repository.remove_file_metadata(file_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/files", response_model=List[FileMetaSchema])
def list_files(current_user: User = Depends(get_current_user)):
    return metadata_repository.list_files()

@router.post("/ask")
def ask(query: str, current_user: User = Depends(get_current_user)):
    return qa_service.answer_query(query)