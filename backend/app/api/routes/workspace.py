from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import get_current_active_user
from app.modules.auth.models import User

router = APIRouter(
    prefix="/workspace",
    tags=["Workspace"],
)


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    user_id: str


@router.get("")
async def get_workspace_overview(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return {
        "user": {
            "name": current_user.name,
            "email": current_user.email
        },
        "projects": [],
        "stats": {
            "total_projects": 0,
            "total_documents": 0
        }
    }


@router.get("/projects")
async def list_projects(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return []


@router.post("/projects")
async def create_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return {
        "id": 1,
        "name": project.name,
        "description": project.description,
        "user_id": current_user.uuid
    }


@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return {"success": True}


@router.post("/projects/{project_id}/documents")
async def upload_project_document(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return {"success": True}
