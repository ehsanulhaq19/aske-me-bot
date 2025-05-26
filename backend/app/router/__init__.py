from fastapi import APIRouter
from . import file_router, user_router

router = APIRouter()

router.include_router(file_router.router, prefix="/files", tags=["Files"])
router.include_router(user_router.router, prefix="/users", tags=["Users"])