import os
import chromadb
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from app.config import CHROMA_PATH
from app.services.loader_service import load_file
import uuid

embedding = OpenAIEmbeddings()
client = chromadb.PersistentClient(path=CHROMA_PATH)
db = Chroma(collection_name="rag_bot", embedding_function=embedding, client=client)

def embed_file(file_path: str):
    doc_id = str(uuid.uuid4())
    docs = load_file(file_path)
    for doc in docs:
        doc.metadata["doc_id"] = doc_id
        doc.metadata["file_path"] = file_path
    return {
        "doc_id": doc_id,
        "document_ids": db.add_documents(docs)
    }

def delete_file_embedding(doc_id: str):
    db.delete(ids=doc_id)

def get_vector_db():
    return db
