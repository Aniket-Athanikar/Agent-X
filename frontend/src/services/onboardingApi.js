import { API, apiFetch } from "./apiClient";

export async function getOnboardingStatus() {
  return apiFetch("/onboarding/status");
}

export async function getOnboardingProfile() {
  return apiFetch("/onboarding/profile");
}

export async function createOnboardingProfile(profileData) {
  return apiFetch("/onboarding/profile", {
    method: "POST",
    body: JSON.stringify(profileData),
  });
}

export async function updateOnboardingProfile(profileData) {
  return apiFetch("/onboarding/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

export async function getStudyPlan() {
  return apiFetch("/onboarding/study-plan");
}

export async function completeOnboarding() {
  return apiFetch("/onboarding/complete", {
    method: "POST",
  });
}

export async function deleteOnboardingProfile() {
  return apiFetch("/onboarding/profile", {
    method: "DELETE",
  });
}
