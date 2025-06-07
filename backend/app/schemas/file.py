from pydantic import BaseModel

class FileMetaSchema(BaseModel):
    id: int
    filename: str
    path: str
    document_ids: str | None = None
    
    model_config = {
        "from_attributes": True
    }
    
class FileOut(FileMetaSchema):
    id: int
    filename: str
    path: str
    
    model_config = {
        "from_attributes": True
    }