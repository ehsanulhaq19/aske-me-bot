from langchain.document_loaders import TextLoader, PyPDFLoader, Docx2txtLoader, UnstructuredExcelLoader
from langchain.docstore.document import Document
import os

EXTENSION_MAP = {
    ".txt": TextLoader,
    ".pdf": PyPDFLoader,
    ".docx": Docx2txtLoader,
    ".xlsx": UnstructuredExcelLoader
}

def load_file(file_path: str) -> list[Document]:
    ext = os.path.splitext(file_path)[1]
    loader_class = EXTENSION_MAP.get(ext)
    if not loader_class:
        raise ValueError(f"Unsupported file type: {ext}")
    loader = loader_class(file_path)
    return loader.load()