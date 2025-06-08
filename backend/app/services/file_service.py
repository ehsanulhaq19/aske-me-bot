import os
import shutil
from fastapi import UploadFile
from app.config import DOCS_PATH
from app.services.embedding_service import embed_file, delete_file_embedding

async def upload_file(file: UploadFile):
    if not os.path.exists(DOCS_PATH):
        os.makedirs(DOCS_PATH)
        
    file_path = os.path.join(DOCS_PATH, file.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    embed_file_result = embed_file(file_path)
    return {
        "message": f"{file.filename} uploaded and embedded.", 
        "document_ids": embed_file_result["document_ids"], 
        "file_path": file_path,
        "doc_id": embed_file_result["doc_id"]
    }

def delete_file(filename: str, document_ids: list = None):
    file_path = os.path.join(DOCS_PATH, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        
    for doc_id in document_ids or []:
        delete_file_embedding(doc_id)
        
    return {"message": f"{filename} deleted successfully."}