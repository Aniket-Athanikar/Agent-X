from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import date


class OnboardingProfileBase(BaseModel):
    target_exam: str = Field(..., description="Target exam selection")
    preparation_stage: str = Field(..., description="Current preparation stage")
    goal_timeline: str = Field(..., description="Timeline goal")
    custom_exam_date: Optional[date] = Field(None, description="Custom exam date if selected")
    daily_study_hours: str = Field(..., description="Daily study hours commitment")
    learning_goals: List[str] = Field(default_factory=list, description="Learning goals")
    weak_subjects: List[str] = Field(default_factory=list, description="Weak subjects")

    @validator('target_exam')
    def validate_target_exam(cls, v):
        valid_exams = [
            "UPSC", "SSC CGL", "Banking", "Railway", "State PSC",
            "NEET", "JEE", "GATE", "Other"
        ]
        if v not in valid_exams:
            raise ValueError(f"Invalid target exam. Must be one of: {', '.join(valid_exams)}")
        return v

    @validator('preparation_stage')
    def validate_preparation_stage(cls, v):
        valid_stages = [
            "Just Started", "Beginner", "Intermediate",
            "Revision Stage", "Giving Mock Tests", "Final Revision"
        ]
        if v not in valid_stages:
            raise ValueError(f"Invalid preparation stage. Must be one of: {', '.join(valid_stages)}")
        return v

    @validator('goal_timeline')
    def validate_goal_timeline(cls, v):
        valid_timelines = [
            "30 Days", "60 Days", "90 Days", "6 Months", "1 Year", "Custom Date"
        ]
        if v not in valid_timelines:
            raise ValueError(f"Invalid goal timeline. Must be one of: {', '.join(valid_timelines)}")
        return v

    @validator('daily_study_hours')
    def validate_daily_study_hours(cls, v):
        valid_hours = ["1 Hour", "2 Hours", "3 Hours", "4+ Hours"]
        if v not in valid_hours:
            raise ValueError(f"Invalid daily study hours. Must be one of: {', '.join(valid_hours)}")
        return v

    @validator('learning_goals')
    def validate_learning_goals(cls, v):
        valid_goals = [
            "Complete Learning", "Mock Tests", "Daily Quiz",
            "Revision Notes", "PYQs", "AI Tutor", "Doubt Solving", "Performance Analysis"
        ]
        for goal in v:
            if goal not in valid_goals:
                raise ValueError(f"Invalid learning goal: {goal}. Must be one of: {', '.join(valid_goals)}")
        return v

    @validator('weak_subjects')
    def validate_weak_subjects(cls, v):
        valid_subjects = [
            "History", "Geography", "Polity", "Economy",
            "Science", "Current Affairs"
        ]
        for subject in v:
            if subject not in valid_subjects:
                raise ValueError(f"Invalid weak subject: {subject}. Must be one of: {', '.join(valid_subjects)}")
        return v

    @validator('custom_exam_date')
    def validate_custom_exam_date(cls, v, values):
        if values.get('goal_timeline') == 'Custom Date' and v is None:
            raise ValueError("Custom exam date is required when Custom Date is selected")
        return v


class OnboardingProfileCreate(OnboardingProfileBase):
    pass


class OnboardingProfileUpdate(BaseModel):
    target_exam: Optional[str] = None
    preparation_stage: Optional[str] = None
    goal_timeline: Optional[str] = None
    custom_exam_date: Optional[date] = None
    daily_study_hours: Optional[str] = None
    learning_goals: Optional[List[str]] = None
    weak_subjects: Optional[List[str]] = None


class OnboardingProfileResponse(OnboardingProfileBase):
    id: int
    uuid: str
    user_id: int
    onboarding_completed: bool
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class StudyPlanBase(BaseModel):
    daily_schedule: Dict[str, Any] = Field(default_factory=dict)
    weekly_plan: Dict[str, Any] = Field(default_factory=dict)
    monthly_plan: Dict[str, Any] = Field(default_factory=dict)
    revision_schedule: Dict[str, Any] = Field(default_factory=dict)
    mock_schedule: Dict[str, Any] = Field(default_factory=dict)
    overall_progress: Dict[str, Any] = Field(default_factory=dict)


class StudyPlanCreate(StudyPlanBase):
    pass


class StudyPlanResponse(StudyPlanBase):
    id: int
    uuid: str
    user_profile_id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class OnboardingStatusResponse(BaseModel):
    onboarding_completed: bool
    has_profile: bool
    has_study_plan: bool


class OnboardingCompleteResponse(BaseModel):
    success: bool
    message: str
    redirect: str
