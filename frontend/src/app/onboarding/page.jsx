"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Check, Calendar, Clock, Target, BookOpen, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { createOnboardingProfile, completeOnboarding } from "@/services/onboardingApi";

const ONBOARDING_STEPS = [
  { id: 1, title: "Target Exam", icon: Target },
  { id: 2, title: "Preparation Stage", icon: TrendingUp },
  { id: 3, title: "Goal Timeline", icon: Calendar },
  { id: 4, title: "Daily Study Time", icon: Clock },
  { id: 5, title: "Learning Goals", icon: BookOpen },
  { id: 6, title: "Weak Subjects", icon: AlertCircle },
];

const EXAM_OPTIONS = ["UPSC", "SSC CGL", "Banking", "Railway", "State PSC", "NEET", "JEE", "GATE", "Other"];
const PREPARATION_STAGES = ["Just Started", "Beginner", "Intermediate", "Revision Stage", "Giving Mock Tests", "Final Revision"];
const TIMELINE_OPTIONS = ["30 Days", "60 Days", "90 Days", "6 Months", "1 Year", "Custom Date"];
const STUDY_HOURS_OPTIONS = ["1 Hour", "2 Hours", "3 Hours", "4+ Hours"];
const LEARNING_GOALS_OPTIONS = ["Complete Learning", "Mock Tests", "Daily Quiz", "Revision Notes", "PYQs", "AI Tutor", "Doubt Solving", "Performance Analysis"];
const WEAK_SUBJECTS_OPTIONS = ["History", "Geography", "Polity", "Economy", "Science", "Current Affairs"];
const LOADING_MESSAGES = ["Analyzing your profile...", "Generating your personalized study plan...", "Preparing your weekly schedule...", "Creating revision strategy...", "Finalizing dashboard..."];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [formData, setFormData] = useState({
    target_exam: "",
    preparation_stage: "",
    goal_timeline: "",
    custom_exam_date: "",
    daily_study_hours: "",
    learning_goals: [],
    weak_subjects: [],
  });

  useEffect(() => {
    const savedProgress = localStorage.getItem("onboarding_progress");
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setFormData(parsed.formData);
        setCurrentStep(parsed.currentStep || 1);
      } catch (e) {
        console.error("Failed to load saved progress:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("onboarding_progress", JSON.stringify({ formData, currentStep }));
  }, [formData, currentStep]);

  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isSubmitting]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSingleSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createOnboardingProfile(formData);
      await completeOnboarding();
      localStorage.removeItem("onboarding_progress");
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding failed:", error);
      alert("Failed to complete onboarding. Please try again.");
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.target_exam !== "";
      case 2: return formData.preparation_stage !== "";
      case 3: return formData.goal_timeline !== "" && (formData.goal_timeline !== "Custom Date" || formData.custom_exam_date !== "");
      case 4: return formData.daily_study_hours !== "";
      case 5: return formData.learning_goals.length > 0;
      case 6: return formData.weak_subjects.length > 0;
      default: return false;
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative">
            <div className="w-20 h-20 mx-auto"><Sparkles className="w-full h-full text-emerald-500 animate-pulse" /></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{LOADING_MESSAGES[loadingMessageIndex]}</h2>
            <p className="text-gray-400">Creating your personalized learning experience...</p>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${((loadingMessageIndex + 1) / LOADING_MESSAGES.length) * 100}%` }} />
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Select Your Target Exam</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {EXAM_OPTIONS.map((exam) => (
                <button key={exam} onClick={() => handleSingleSelect("target_exam", exam)} className={`p-4 rounded-xl border-2 transition-all text-left ${formData.target_exam === exam ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"}`}>
                  <div className="font-medium">{exam}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">What's Your Preparation Stage?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PREPARATION_STAGES.map((stage) => (
                <button key={stage} onClick={() => handleSingleSelect("preparation_stage", stage)} className={`p-4 rounded-xl border-2 transition-all text-left ${formData.preparation_stage === stage ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"}`}>
                  <div className="font-medium">{stage}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Set Your Goal Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TIMELINE_OPTIONS.map((timeline) => (
                <button key={timeline} onClick={() => handleSingleSelect("goal_timeline", timeline)} className={`p-4 rounded-xl border-2 transition-all text-left ${formData.goal_timeline === timeline ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"}`}>
                  <div className="font-medium">{timeline}</div>
                </button>
              ))}
            </div>
            {formData.goal_timeline === "Custom Date" && (
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-2">Select Your Exam Date</label>
                <input type="date" value={formData.custom_exam_date} onChange={(e) => handleSingleSelect("custom_exam_date", e.target.value)} className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 focus:outline-none" />
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Daily Study Time Commitment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {STUDY_HOURS_OPTIONS.map((hours) => (
                <button key={hours} onClick={() => handleSingleSelect("daily_study_hours", hours)} className={`p-4 rounded-xl border-2 transition-all text-left ${formData.daily_study_hours === hours ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"}`}>
                  <div className="font-medium">{hours}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Select Your Learning Goals</h2>
            <p className="text-gray-400 text-sm mb-4">Choose all that apply</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LEARNING_GOALS_OPTIONS.map((goal) => (
                <button key={goal} onClick={() => handleMultiSelect("learning_goals", goal)} className={`p-4 rounded-xl border-2 transition-all text-left relative ${formData.learning_goals.includes(goal) ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"}`}>
                  <div className="flex items-center justify-between"><span className="font-medium">{goal}</span>{formData.learning_goals.includes(goal) && <Check className="w-5 h-5" />}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Select Your Weak Subjects</h2>
            <p className="text-gray-400 text-sm mb-4">Choose all that apply - we'll focus more on these</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {WEAK_SUBJECTS_OPTIONS.map((subject) => (
                <button key={subject} onClick={() => handleMultiSelect("weak_subjects", subject)} className={`p-4 rounded-xl border-2 transition-all text-left relative ${formData.weak_subjects.includes(subject) ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"}`}>
                  <div className="flex items-center justify-between"><span className="font-medium">{subject}</span>{formData.weak_subjects.includes(subject) && <Check className="w-5 h-5" />}</div>
                </button>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {ONBOARDING_STEPS.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${isCompleted ? "border-emerald-500 bg-emerald-500 text-white" : isCurrent ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/20 bg-white/5 text-gray-400"}`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {step.id < ONBOARDING_STEPS.length && <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? "bg-emerald-500" : "bg-white/10"}`} />}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            {ONBOARDING_STEPS.map((step) => (
              <span key={step.id} className={currentStep === step.id ? "text-emerald-400 font-medium" : ""}>{step.title}</span>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-6">
          {renderStep()}
        </div>

        <div className="flex justify-between">
          <button onClick={handlePrevious} disabled={currentStep === 1} className="px-6 py-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          {currentStep === ONBOARDING_STEPS.length ? (
            <button onClick={handleSubmit} disabled={!isStepValid()} className="px-6 py-3 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              Complete Onboarding <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleNext} disabled={!isStepValid()} className="px-6 py-3 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
