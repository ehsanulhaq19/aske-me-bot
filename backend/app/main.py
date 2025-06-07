from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.router import router
from app.schemas.user import UserCreate
from app.repository.user_repository import create_admin_user
from app.core.config import settings

app = FastAPI(
    title="AskMe Bot API",
    description="API for the AskMe Bot application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
def setup_app():
    # Create an admin user if it doesn't exist
    user = UserCreate(
        name="Admin",
        email="admin@example.com",
        password="admin123"
    )
    create_admin_user(user)