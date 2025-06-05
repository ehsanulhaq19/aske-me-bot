from fastapi import APIRouter
from . import file_router, user_router

router = APIRouter()
API_V1_STR = "/api/v1"

router.include_router(file_router.router, prefix=f"{API_V1_STR}/files", tags=["Files"])
router.include_router(user_router.router, prefix=f"{API_V1_STR}/users", tags=["Users"])