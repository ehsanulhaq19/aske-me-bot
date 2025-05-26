import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
CHROMA_PATH = os.getenv("CHROMA_PATH")
DOCS_PATH = os.getenv("DOCS_PATH")
SECRET_KEY = os.getenv("JWT_SECRET_KEY")