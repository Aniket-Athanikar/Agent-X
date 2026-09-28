from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import uuid

from app.modules.auth.services import (
    send_email_verification,
    verify_email_code,
)

from app.database import get_db
from app.modules.auth.models import User
from app.core.redis import redis_client
from app.core.security import create_access_token
from app.core.security import get_current_active_user


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# Temporary storage
pending_users = {}


# ================= MODELS =================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class VerifyRequest(BaseModel):
    email: EmailStr
    code: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ResendRequest(BaseModel):
    email: EmailStr


@router.delete("/account")
async def delete_account(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Delete only the account authenticated by the bearer token."""
    try:
        db.delete(current_user)
        db.commit()
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(status_code=500, detail="Unable to delete the account right now.") from error
    return {"success": True, "message": "Account deleted"}


# ================= REGISTER =================

@router.post("/register")
async def register(payload: RegisterRequest):

    print("\n========== REGISTER ==========")

    print("RAW PAYLOAD:")
    print(payload)

    print("NAME:", payload.name)
    print("EMAIL:", payload.email)
    print("PASSWORD:", payload.password)

    existing = pending_users.get(
        payload.email
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="OTP already sent"
        )

    pending_users[payload.email] = {
        "name": payload.name,
        "password": payload.password
    }

    print("PENDING USERS:")
    print(pending_users)

    await send_email_verification(
        payload.email,
        payload.name
    )

    print("OTP SENT")

    return {
        "success": True,
        "requiresVerification": True,
        "message": "OTP sent"
    }


# ================= LOGIN =================

@router.post("/login")
async def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):

    print("\n========== LOGIN ==========")
    print("EMAIL:", payload.email)

    user = (
        db.query(User)
        .filter(
            User.email == payload.email
        )
        .first()
    )

    print("USER FOUND:", user)

    if not user:
        return {
            "success": False,
            "detail": "User not found"
        }

    if user.password_hash != payload.password:

        print("PASSWORD FAILED")

        return {
            "success": False,
            "detail": "Invalid password"
        }

    print("PASSWORD OK")

    await send_email_verification(
        payload.email,
        user.name
    )

    print("LOGIN OTP SENT")

    return {
        "success": True,
        "requiresVerification": True,
        "message": "OTP sent"
    }


# ================= VERIFY EMAIL / LOGIN OTP =================

@router.post("/verify-email")
async def verify_email(
    payload: VerifyRequest,
    db: Session = Depends(get_db)
):

    print("\n========== VERIFY ==========")

    print("EMAIL:", payload.email)
    print("OTP:", payload.code)

    valid = verify_email_code(
        payload.email,
        payload.code
    )

    print("OTP VALID:", valid)

    if not valid:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    try:
        existing = (
            db.query(User)
            .filter(
                User.email == payload.email
            )
            .first()
        )
    except SQLAlchemyError as error:
        db.rollback()
        print("DATABASE ERROR DURING EMAIL VERIFICATION:", repr(error))
        raise HTTPException(
            status_code=500,
            detail="Unable to verify the email right now. Please try again later.",
        ) from error

    print("EXISTING USER:", existing)

    # LOGIN FLOW
    if existing:

        existing.is_verified = True

        db.commit()

        print("LOGIN VERIFIED")

        access_token = create_access_token(data={"sub": existing.email})

        return {
            "success": True,
            "redirect": "/dashboard",
            "token": access_token,
            "user": {
                "name": existing.name,
                "email": existing.email
            }
        }

    # REGISTER FLOW

    data = pending_users.get(
        payload.email
    )

    print("PENDING USER:", data)

    if not data:
        raise HTTPException(
            status_code=400,
            detail="Registration expired"
        )

    try:

        user = User(
            uuid=str(uuid.uuid4()),
            name=data["name"],
            email=payload.email,
            password_hash=data["password"],
            is_active=True,
            is_verified=True
        )

        print("CREATING USER")

        db.add(user)

        print("BEFORE COMMIT")

        db.commit()

        print("AFTER COMMIT")

        db.refresh(user)

        print("USER CREATED")

    except Exception as e:

        db.rollback()

        print("DATABASE ERROR:")
        print(e)

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    pending_users.pop(
        payload.email,
        None
    )

    print("PENDING USER REMOVED")

    access_token = create_access_token(data={"sub": user.email})

    return {
        "success": True,
        "redirect": "/dashboard",
        "token": access_token,
        "user": {
            "name": user.name,
            "email": user.email
        }
    }


# ================= RESEND / DEBUG OTP =================

@router.post("/resend-otp")
async def resend_otp(
    payload: ResendRequest,
    db: Session = Depends(get_db)
):
    print("\n========== RESEND OTP ==========")
    print("EMAIL:", payload.email)

    resend_name = None
    pending = pending_users.get(payload.email)
    if pending:
        resend_name = pending.get("name")
    else:
        user_db = db.query(User).filter(User.email == payload.email).first()
        if user_db:
            resend_name = user_db.name

    await send_email_verification(payload.email, resend_name)
    print("RESENT OTP")
    return {
        "success": True,
        "message": "OTP resent"
    }


@router.get("/debug-otp")
def get_debug_otp(email: str):
    otp = redis_client.get(f"verify:{email}")
    if not otp:
        raise HTTPException(
            status_code=404,
            detail="OTP not found or expired"
        )
    return {
        "success": True,
        "otp": otp
    }
