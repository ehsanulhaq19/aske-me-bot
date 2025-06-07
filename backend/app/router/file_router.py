from fastapi import APIRouter, UploadFile, File, Query, Response, status, Depends
from app.services import file_service, qa_service
from app.schemas.file import FileMetaSchema
from typing import List, Dict
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

@router.delete("/delete/{file_id}")
def delete(file_id: int, current_user: User = Depends(get_current_user)):
    file = metadata_repository.get_file_by_id(file_id)
    document_ids = file.document_ids.split(",") if file.document_ids else []
    if document_ids:
        file_service.delete_file(file.filename, document_ids)
    metadata_repository.remove_file_metadata(file_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/", response_model=Dict[str, object])
def list_files(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
    current_user: User = Depends(get_current_user)
):
    skip = (page - 1) * page_size
    files, total = metadata_repository.list_files(skip=skip, limit=page_size)
    return {
        "items": files,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

@router.post("/ask")
def ask(query: str, current_user: User = Depends(get_current_user)):
    return qa_service.answer_query(query)