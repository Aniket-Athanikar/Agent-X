from fastapi import APIRouter

from app.modules.auth.router import router as auth_router
from app.api.routes.ai import router as ai_router
from app.api.routes.workspace import router as workspace_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(ai_router)
router.include_router(workspace_router)
