"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, Target, BookOpen, TrendingUp, AlertCircle, CheckCircle, ChevronRight } from "lucide-react";
import { getOnboardingProfile, getStudyPlan } from "@/services/onboardingApi";

export default function StudyPlanWidget() {
  const [profile, setProfile] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, planData] = await Promise.all([
        getOnboardingProfile(),
        getStudyPlan()
      ]);
      setProfile(profileData);
      setStudyPlan(planData);
    } catch (err) {
      setError("Failed to load study plan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-1/3" />
          <div className="h-3 bg-white/10 rounded w-2/3" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !profile || !studyPlan) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <p className="text-gray-400 text-sm">{error || "No study plan available"}</p>
      </div>
    );
  }

  const todaySchedule = studyPlan.daily_schedule?.time_slots || [];
  const weeklyPlan = studyPlan.weekly_plan?.daily_plan || {};
  const progress = studyPlan.overall_progress || {};

  return (
    <div className="space-y-4">
      {/* Profile Summary */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          Your Profile
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Target Exam</p>
            <p className="text-white font-medium">{profile.target_exam}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Preparation Stage</p>
            <p className="text-white font-medium">{profile.preparation_stage}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Daily Study Time</p>
            <p className="text-white font-medium">{profile.daily_study_hours}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Timeline</p>
            <p className="text-white font-medium">{profile.goal_timeline}</p>
          </div>
        </div>
        {profile.weak_subjects && profile.weak_subjects.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Focus Areas
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.weak_subjects.map((subject) => (
                <span key={subject} className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs">
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          Today's Schedule
        </h3>
        {todaySchedule.length > 0 ? (
          <div className="space-y-3">
            {todaySchedule.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{slot.subject}</p>
                    <p className="text-gray-400 text-xs">{slot.hours} hours</p>
                  </div>
                </div>
                {slot.focus === "High Priority" && (
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                    Priority
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No schedule for today</p>
        )}
      </div>

      {/* Weekly Overview */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          This Week
        </h3>
        <div className="space-y-2">
          {Object.entries(weeklyPlan).slice(0, 5).map(([day, plan]) => (
            <div key={day} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
              <span className="text-gray-300 text-sm">{day}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">{plan.subjects?.join(", ") || "Rest"}</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      {progress.total_days && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Overall Progress
          </h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Completion</span>
              <span className="text-white font-medium">{progress.completion_percentage || 0}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all" 
                style={{ width: `${progress.completion_percentage || 0}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Days Completed: {progress.completed_days || 0} / {progress.total_days}</p>
            {progress.streak && (
              <p className="text-xs text-gray-400">Current Streak: {progress.streak.current || 0} days</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
