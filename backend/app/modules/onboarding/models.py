import uuid
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
    Date,
    Text
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    uuid = Column(
        String(36),
        unique=True,
        nullable=False,
        default=lambda: str(uuid.uuid4())
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )

    target_exam = Column(
        String(50),
        nullable=False
    )

    preparation_stage = Column(
        String(50),
        nullable=False
    )

    goal_timeline = Column(
        String(50),
        nullable=False
    )

    custom_exam_date = Column(
        Date,
        nullable=True
    )

    daily_study_hours = Column(
        String(20),
        nullable=False
    )

    learning_goals = Column(
        JSON,
        nullable=False,
        default=list
    )

    weak_subjects = Column(
        JSON,
        nullable=False,
        default=list
    )

    onboarding_completed = Column(
        Boolean,
        default=False,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User", backref="profile")

    def __repr__(self):
        return f"UserProfile(user_id={self.user_id}, target_exam='{self.target_exam}', onboarding_completed={self.onboarding_completed})"


class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    uuid = Column(
        String(36),
        unique=True,
        nullable=False,
        default=lambda: str(uuid.uuid4())
    )

    user_profile_id = Column(
        Integer,
        ForeignKey("user_profiles.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )

    daily_schedule = Column(
        JSON,
        nullable=False,
        default=dict
    )

    weekly_plan = Column(
        JSON,
        nullable=False,
        default=dict
    )

    monthly_plan = Column(
        JSON,
        nullable=False,
        default=dict
    )

    revision_schedule = Column(
        JSON,
        nullable=False,
        default=dict
    )

    mock_schedule = Column(
        JSON,
        nullable=False,
        default=dict
    )

    overall_progress = Column(
        JSON,
        nullable=False,
        default=dict
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    user_profile = relationship("UserProfile", backref="study_plan")

    def __repr__(self):
        return f"StudyPlan(user_profile_id={self.user_profile_id})"
