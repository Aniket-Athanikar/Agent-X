from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import re
import shutil
import uuid
import zipfile
from pathlib import Path
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.database import engine, get_db, Base
from app.api.router import router as api_router
from app.core.security import get_current_active_user, get_current_user_optional
from app.modules.auth.models import User
from app.ai.rag import rag_pipeline
import app.modules.auth.models  # Import models to ensure tables are created

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost",
        "http://127.0.0.1",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
MAX_UPLOAD_BYTES = 50 * 1024 * 1024
MAX_ZIP_FILES = 2_000

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

@app.on_event("startup")
def startup_db_check():
    print("\n" + "=" * 50)
    print("DATABASE CONNECTION CHECK ON STARTUP:")
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("DATABASE STATUS: CONNECTED SUCCESSFULLY [OK]")
    except Exception as e:
        print("DATABASE STATUS: DISCONNECTED [FAILED]")
        print(f"Error details: {e}")
    print("=" * 50 + "\n")

@app.get("/health")
def health(db: Session = Depends(get_db)):
    db_status = "disconnected"
    db_error = None
    try:
        # Perform a simple query to verify database connectivity
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_error = str(e)

    return {
        "status": "online",
        "database": {
            "status": db_status,
            "error": db_error
        }
    }

def _safe_workspace_id(workspace_id: Optional[str]) -> str:
    value = workspace_id or str(uuid.uuid4())
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", value):
        raise HTTPException(status_code=400, detail="Invalid workspace_id")
    return value


async def _save_upload(upload: UploadFile, destination: Path) -> Path:
    filename = Path(upload.filename or "upload").name
    if not filename or filename == ".":
        raise HTTPException(status_code=400, detail="Invalid upload filename")

    target = destination / filename
    total = 0
    with target.open("wb") as output:
        while chunk := await upload.read(1024 * 1024):
            total += len(chunk)
            if total > MAX_UPLOAD_BYTES:
                output.close()
                target.unlink(missing_ok=True)
                raise HTTPException(status_code=413, detail="Upload exceeds 50 MB limit")
            output.write(chunk)
    return target


def _extract_zip(archive: Path, destination: Path) -> Path:
    extracted = destination / "extracted"
    extracted.mkdir(exist_ok=True)
    with zipfile.ZipFile(archive) as bundle:
        members = [member for member in bundle.infolist() if not member.is_dir()]
        if len(members) > MAX_ZIP_FILES:
            raise HTTPException(status_code=400, detail="ZIP contains too many files")
        if sum(member.file_size for member in members) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="ZIP contents exceed 50 MB limit")
        for member in members:
            target = (extracted / member.filename).resolve()
            if extracted.resolve() not in target.parents:
                raise HTTPException(status_code=400, detail="ZIP contains an unsafe path")
            if member.file_size > MAX_UPLOAD_BYTES:
                raise HTTPException(status_code=413, detail="ZIP member exceeds 50 MB limit")
            target.parent.mkdir(parents=True, exist_ok=True)
            with bundle.open(member) as source, target.open("wb") as output:
                shutil.copyfileobj(source, output)
    return extracted


@app.post("/workspace/upload")
async def upload_workspace(
    file: Optional[UploadFile] = File(None),
    workspace_id: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user_optional)
):
    print("=" * 80)
    print("UPLOAD ENDPOINT HIT")
    print("FILE:", file.filename if file else None)
    print("=" * 80)
    
    if file is None:
        raise HTTPException(status_code=400, detail="A file or ZIP archive is required")

    workspace_id = _safe_workspace_id(workspace_id)
    workspace_dir = UPLOAD_DIR / workspace_id
    workspace_dir.mkdir(parents=True, exist_ok=True)
    filepath = await _save_upload(file, workspace_dir)
    
    if filepath.suffix.lower() == ".zip":
        try:
            result = await rag_pipeline.index_path(
                str(_extract_zip(filepath, workspace_dir)), workspace_id
            )
        except zipfile.BadZipFile as error:
            raise HTTPException(status_code=400, detail="Invalid ZIP archive") from error
    else:
        try:
            result = await rag_pipeline.index_document(str(filepath), workspace_id)
        except ValueError as error:
            if not str(error).startswith("Unsupported file type:"):
                raise
            result = {
                "filename": filepath.name,
                "workspace_id": workspace_id,
                "chunks": 0,
                "status": "skipped_unsupported",
            }
    
    return {

        "success": True,

        "workspace": {
            "id": workspace_id,
            "name": Path(file.filename).stem,
            "filename": Path(file.filename).name,
            "chunks": result["chunks"],
            "status": result.get("status", "indexed"),
        }
        
    }
