import os
import chromadb
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from app.config import CHROMA_PATH
from app.services.loader_service import load_file

embedding = OpenAIEmbeddings()
client = chromadb.PersistentClient(path=CHROMA_PATH)
db = Chroma(collection_name="rag_bot", embedding_function=embedding, client=client)

def embed_file(file_path: str):
    docs = load_file(file_path)
    return db.add_documents(docs)

def delete_file_embedding(doc_id: str):
    db.delete(ids=doc_id)

def get_vector_db():
    return db
