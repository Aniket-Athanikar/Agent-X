from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.core.security import get_current_active_user, get_current_user_optional
from app.modules.auth.models import User
from app.modules.onboarding.models import UserProfile, StudyPlan
from app.modules.onboarding.schemas import (
    OnboardingProfileCreate,
    OnboardingProfileUpdate,
    OnboardingProfileResponse,
    StudyPlanCreate,
    StudyPlanResponse,
    OnboardingStatusResponse,
    OnboardingCompleteResponse
)
from app.modules.onboarding.study_plan_generator import study_plan_generator

router = APIRouter(
    prefix="/onboarding",
    tags=["Onboarding"]
)


@router.get("/status", response_model=OnboardingStatusResponse)
async def get_onboarding_status(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """
    Check if user has completed onboarding.
    Returns status even for unauthenticated users (has_profile: false).
    """
    if not current_user:
        return OnboardingStatusResponse(
            onboarding_completed=False,
            has_profile=False,
            has_study_plan=False
        )
    
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    if not profile:
        return OnboardingStatusResponse(
            onboarding_completed=False,
            has_profile=False,
            has_study_plan=False
        )
    
    has_study_plan = db.query(StudyPlan).filter(StudyPlan.user_profile_id == profile.id).first() is not None
    
    return OnboardingStatusResponse(
        onboarding_completed=profile.onboarding_completed,
        has_profile=True,
        has_study_plan=has_study_plan
    )


@router.get("/profile", response_model=OnboardingProfileResponse)
async def get_onboarding_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's onboarding profile.
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Onboarding profile not found")
    
    return profile


@router.post("/profile", response_model=OnboardingProfileResponse)
async def create_onboarding_profile(
    profile_data: OnboardingProfileCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create onboarding profile.
    """
    # Check if profile already exists
    existing_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    # Create profile
    profile = UserProfile(
        user_id=current_user.id,
        **profile_data.dict()
    )
    
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    return profile


@router.put("/profile", response_model=OnboardingProfileResponse)
async def update_onboarding_profile(
    profile_data: OnboardingProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update onboarding profile.
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Update only provided fields
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    
    return profile


@router.get("/study-plan", response_model=StudyPlanResponse)
async def get_study_plan(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's study plan.
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    study_plan = db.query(StudyPlan).filter(StudyPlan.user_profile_id == profile.id).first()
    
    if not study_plan:
        raise HTTPException(status_code=404, detail="Study plan not found")
    
    return study_plan


@router.post("/complete", response_model=OnboardingCompleteResponse)
async def complete_onboarding(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Complete onboarding and generate study plan.
    This endpoint generates the study plan and marks onboarding as complete.
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if profile.onboarding_completed:
        raise HTTPException(status_code=400, detail="Onboarding already completed")
    
    # Generate study plan
    profile_data = {
        "target_exam": profile.target_exam,
        "preparation_stage": profile.preparation_stage,
        "goal_timeline": profile.goal_timeline,
        "custom_exam_date": profile.custom_exam_date,
        "daily_study_hours": profile.daily_study_hours,
        "learning_goals": profile.learning_goals,
        "weak_subjects": profile.weak_subjects
    }
    
    generated_plan = study_plan_generator.generate_study_plan(profile_data)
    
    # Create study plan
    study_plan = StudyPlan(
        user_profile_id=profile.id,
        **generated_plan
    )
    
    db.add(study_plan)
    
    # Mark onboarding as complete
    profile.onboarding_completed = True
    
    db.commit()
    db.refresh(profile)
    db.refresh(study_plan)
    
    return OnboardingCompleteResponse(
        success=True,
        message="Onboarding completed successfully",
        redirect="/dashboard"
    )


@router.delete("/profile")
async def delete_onboarding_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete onboarding profile and study plan (for testing/reset purposes).
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Study plan will be deleted automatically due to CASCADE
    db.delete(profile)
    db.commit()
    
    return {"success": True, "message": "Profile deleted successfully"}
