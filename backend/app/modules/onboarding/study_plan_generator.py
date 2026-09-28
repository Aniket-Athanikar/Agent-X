from typing import Dict, Any, List
from datetime import datetime, timedelta
import calendar


class StudyPlanGenerator:
    """
    Modular study plan generator using rule-based logic.
    Designed to be easily replaceable with LLM-based generation.
    """

    # Exam-specific subject priorities
    EXAM_SUBJECTS = {
        "UPSC": {
            "subjects": ["History", "Geography", "Polity", "Economy", "Science", "Current Affairs"],
            "priority": {"Polity": 1, "History": 2, "Geography": 3, "Economy": 4, "Science": 5, "Current Affairs": 6}
        },
        "SSC CGL": {
            "subjects": ["History", "Geography", "Polity", "Economy", "Science", "Current Affairs"],
            "priority": {"Economy": 1, "Polity": 2, "History": 3, "Geography": 4, "Science": 5, "Current Affairs": 6}
        },
        "Banking": {
            "subjects": ["History", "Geography", "Polity", "Economy", "Science", "Current Affairs"],
            "priority": {"Economy": 1, "Current Affairs": 2, "Polity": 3, "History": 4, "Geography": 5, "Science": 6}
        },
        "Railway": {
            "subjects": ["History", "Geography", "Polity", "Economy", "Science", "Current Affairs"],
            "priority": {"Science": 1, "History": 2, "Geography": 3, "Polity": 4, "Economy": 5, "Current Affairs": 6}
        },
        "State PSC": {
            "subjects": ["History", "Geography", "Polity", "Economy", "Science", "Current Affairs"],
            "priority": {"Polity": 1, "History": 2, "Geography": 3, "Economy": 4, "Science": 5, "Current Affairs": 6}
        },
        "NEET": {
            "subjects": ["Physics", "Chemistry", "Biology"],
            "priority": {"Biology": 1, "Chemistry": 2, "Physics": 3}
        },
        "JEE": {
            "subjects": ["Physics", "Chemistry", "Mathematics"],
            "priority": {"Mathematics": 1, "Physics": 2, "Chemistry": 3}
        },
        "GATE": {
            "subjects": ["Technical Subjects", "Engineering Mathematics", "General Aptitude"],
            "priority": {"Technical Subjects": 1, "Engineering Mathematics": 2, "General Aptitude": 3}
        },
        "Other": {
            "subjects": ["History", "Geography", "Polity", "Economy", "Science", "Current Affairs"],
            "priority": {"Polity": 1, "History": 2, "Geography": 3, "Economy": 4, "Science": 5, "Current Affairs": 6}
        }
    }

    # Study hours mapping
    HOURS_MAPPING = {
        "1 Hour": 1,
        "2 Hours": 2,
        "3 Hours": 3,
        "4+ Hours": 4
    }

    # Timeline mapping to days
    TIMELINE_MAPPING = {
        "30 Days": 30,
        "60 Days": 60,
        "90 Days": 90,
        "6 Months": 180,
        "1 Year": 365
    }

    def generate_study_plan(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a complete study plan based on user profile.
        This is the main entry point - can be replaced with LLM call.
        """
        target_exam = profile_data["target_exam"]
        preparation_stage = profile_data["preparation_stage"]
        goal_timeline = profile_data["goal_timeline"]
        daily_study_hours = profile_data["daily_study_hours"]
        learning_goals = profile_data["learning_goals"]
        weak_subjects = profile_data["weak_subjects"]

        # Calculate timeline in days
        total_days = self._calculate_timeline_days(goal_timeline, profile_data.get("custom_exam_date"))

        # Get daily hours
        daily_hours = self.HOURS_MAPPING.get(daily_study_hours, 2)

        # Get exam-specific subjects
        exam_info = self.EXAM_SUBJECTS.get(target_exam, self.EXAM_SUBJECTS["Other"])
        subjects = exam_info["subjects"]
        priority = exam_info["priority"]

        # Adjust priority based on weak subjects
        adjusted_priority = self._adjust_priority_for_weak_subjects(priority, weak_subjects)

        # Generate schedules
        daily_schedule = self._generate_daily_schedule(
            subjects, adjusted_priority, daily_hours, learning_goals
        )
        weekly_plan = self._generate_weekly_plan(subjects, adjusted_priority, learning_goals)
        monthly_plan = self._generate_monthly_plan(total_days, subjects, adjusted_priority, preparation_stage)
        revision_schedule = self._generate_revision_schedule(total_days, subjects, preparation_stage)
        mock_schedule = self._generate_mock_schedule(total_days, preparation_stage, learning_goals)
        overall_progress = self._generate_overall_progress(total_days)

        return {
            "daily_schedule": daily_schedule,
            "weekly_plan": weekly_plan,
            "monthly_plan": monthly_plan,
            "revision_schedule": revision_schedule,
            "mock_schedule": mock_schedule,
            "overall_progress": overall_progress
        }

    def _calculate_timeline_days(self, goal_timeline: str, custom_date: Any = None) -> int:
        """Calculate total days from timeline selection."""
        if goal_timeline == "Custom Date" and custom_date:
            today = datetime.now().date()
            delta = custom_date - today
            return max(delta.days, 1)
        return self.TIMELINE_MAPPING.get(goal_timeline, 90)

    def _adjust_priority_for_weak_subjects(self, priority: Dict[str, int], weak_subjects: List[str]) -> Dict[str, int]:
        """Boost priority of weak subjects."""
        adjusted = priority.copy()
        for subject in weak_subjects:
            if subject in adjusted:
                adjusted[subject] = max(1, adjusted[subject] - 2)  # Boost by 2 positions
        return dict(sorted(adjusted.items(), key=lambda x: x[1]))

    def _generate_daily_schedule(self, subjects: List[str], priority: Dict[str, int], 
                                 daily_hours: int, learning_goals: List[str]) -> Dict[str, Any]:
        """Generate daily study schedule."""
        sorted_subjects = sorted(subjects, key=lambda x: priority.get(x, 99))
        
        # Allocate time based on priority
        time_slots = []
        remaining_hours = daily_hours
        
        for subject in sorted_subjects:
            if remaining_hours <= 0:
                break
            
            # More time for higher priority subjects
            if remaining_hours >= 2:
                subject_hours = 1.5 if priority.get(subject, 99) <= 2 else 1
            else:
                subject_hours = remaining_hours
            
            time_slots.append({
                "subject": subject,
                "hours": round(subject_hours, 1),
                "focus": "High Priority" if priority.get(subject, 99) <= 2 else "Regular"
            })
            remaining_hours -= subject_hours
        
        # Add learning goals as activities
        activities = []
        if "Daily Quiz" in learning_goals:
            activities.append({"name": "Daily Quiz", "duration": 15, "time": "Evening"})
        if "Revision Notes" in learning_goals:
            activities.append({"name": "Revision Notes", "duration": 20, "time": "Night"})
        if "AI Tutor" in learning_goals:
            activities.append({"name": "AI Tutor Session", "duration": 30, "time": "Flexible"})
        
        return {
            "time_slots": time_slots,
            "activities": activities,
            "total_hours": daily_hours,
            "break_time": 15
        }

    def _generate_weekly_plan(self, subjects: List[str], priority: Dict[str, int], 
                             learning_goals: List[str]) -> Dict[str, Any]:
        """Generate weekly study plan."""
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        weekly_plan = {}
        
        sorted_subjects = sorted(subjects, key=lambda x: priority.get(x, 99))
        
        for i, day in enumerate(days):
            # Rotate subjects through the week
            day_subjects = []
            for j in range(2):  # 2 subjects per day
                subject_index = (i + j) % len(sorted_subjects)
                day_subjects.append(sorted_subjects[subject_index])
            
            weekly_plan[day] = {
                "subjects": day_subjects,
                "focus": "Mock Test" if day == "Sunday" else "Regular Study",
                "goals": ["Complete chapters", "Practice questions"]
            }
        
        # Add weekly goals based on learning goals
        weekly_goals = []
        if "Mock Tests" in learning_goals:
            weekly_goals.append("1 Mock Test on Sunday")
        if "PYQs" in learning_goals:
            weekly_goals.append("50 Previous Year Questions")
        if "Performance Analysis" in learning_goals:
            weekly_goals.append("Review weekly performance")
        
        return {
            "daily_plan": weekly_plan,
            "weekly_goals": weekly_goals,
            "total_study_days": 6,
            "rest_day": "Sunday"
        }

    def _generate_monthly_plan(self, total_days: int, subjects: List[str], 
                               priority: Dict[str, int], preparation_stage: str) -> Dict[str, Any]:
        """Generate monthly study plan."""
        months = total_days // 30
        if total_days % 30 > 0:
            months += 1
        
        monthly_plan = {}
        sorted_subjects = sorted(subjects, key=lambda x: priority.get(x, 99))
        
        for month in range(1, months + 1):
            # Distribute subjects across months
            start_idx = (month - 1) * len(sorted_subjects) // months
            end_idx = month * len(sorted_subjects) // months
            month_subjects = sorted_subjects[start_idx:end_idx]
            
            # Adjust focus based on preparation stage
            if preparation_stage in ["Just Started", "Beginner"]:
                focus = "Foundation Building"
            elif preparation_stage in ["Intermediate", "Revision Stage"]:
                focus = "Advanced Topics & Practice"
            else:
                focus = "Final Revision & Mock Tests"
            
            monthly_plan[f"Month {month}"] = {
                "subjects": month_subjects,
                "focus": focus,
                "target_completion": f"{100 // months}%",
                "key_milestones": [
                    "Complete syllabus coverage",
                    "Practice mock tests",
                    "Revise weak areas"
                ]
            }
        
        return monthly_plan

    def _generate_revision_schedule(self, total_days: int, subjects: List[str], 
                                    preparation_stage: str) -> Dict[str, Any]:
        """Generate revision schedule."""
        revision_intervals = [7, 14, 30, 60]  # Days for revision cycles
        
        revision_schedule = {
            "strategy": "Spaced Repetition",
            "intervals": revision_intervals,
            "subjects": {}
        }
        
        for subject in subjects:
            revision_schedule["subjects"][subject] = {
                "first_revision": f"Day {revision_intervals[0]}",
                "second_revision": f"Day {revision_intervals[1]}",
                "third_revision": f"Day {revision_intervals[2]}",
                "final_revision": f"Day {revision_intervals[3]}"
            }
        
        # Add revision frequency based on preparation stage
        if preparation_stage in ["Final Revision", "Giving Mock Tests"]:
            revision_schedule["frequency"] = "Daily"
        elif preparation_stage == "Revision Stage":
            revision_schedule["frequency"] = "Every 3 days"
        else:
            revision_schedule["frequency"] = "Weekly"
        
        return revision_schedule

    def _generate_mock_schedule(self, total_days: int, preparation_stage: str, 
                               learning_goals: List[str]) -> Dict[str, Any]:
        """Generate mock test schedule."""
        if "Mock Tests" not in learning_goals:
            return {"enabled": False, "reason": "Mock tests not selected in learning goals"}
        
        if preparation_stage in ["Just Started", "Beginner"]:
            frequency = "Monthly"
            interval = 30
        elif preparation_stage == "Intermediate":
            frequency = "Bi-weekly"
            interval = 14
        elif preparation_stage == "Revision Stage":
            frequency = "Weekly"
            interval = 7
        else:
            frequency = "Twice Weekly"
            interval = 3
        
        mock_tests = []
        for day in range(interval, total_days + 1, interval):
            mock_tests.append({
                "day": day,
                "type": "Full Length" if day % (interval * 2) == 0 else "Sectional",
                "focus": "Time Management" if day % (interval * 3) == 0 else "Accuracy"
            })
        
        return {
            "enabled": True,
            "frequency": frequency,
            "interval_days": interval,
            "mock_tests": mock_tests[:10],  # Limit to first 10 for display
            "total_mock_tests": len(mock_tests)
        }

    def _generate_overall_progress(self, total_days: int) -> Dict[str, Any]:
        """Generate overall progress tracking structure."""
        return {
            "total_days": total_days,
            "completed_days": 0,
            "completion_percentage": 0,
            "milestones": [
                {"day": int(total_days * 0.25), "milestone": "25% Complete", "status": "pending"},
                {"day": int(total_days * 0.5), "milestone": "50% Complete", "status": "pending"},
                {"day": int(total_days * 0.75), "milestone": "75% Complete", "status": "pending"},
                {"day": total_days, "milestone": "100% Complete", "status": "pending"}
            ],
            "streak": {
                "current": 0,
                "best": 0
            }
        }


# Singleton instance
study_plan_generator = StudyPlanGenerator()
