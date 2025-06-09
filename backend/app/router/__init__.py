from fastapi import APIRouter
from . import file_router, user_router, widget_router, conversation_router, message_router, analytics_router

router = APIRouter()
API_V1_STR = "/api/v1"

router.include_router(file_router.router, prefix=f"{API_V1_STR}/files", tags=["Files"])
router.include_router(user_router.router, prefix=f"{API_V1_STR}/users", tags=["Users"])
router.include_router(widget_router.router, prefix=f"{API_V1_STR}/widgets", tags=["Widgets"])
router.include_router(conversation_router.router, prefix=f"{API_V1_STR}/conversations", tags=["Conversations"])
router.include_router(message_router.router, prefix=f"{API_V1_STR}/messages", tags=["Messages"])
router.include_router(analytics_router.router, prefix=f"{API_V1_STR}/analytics", tags=["Analytics"])