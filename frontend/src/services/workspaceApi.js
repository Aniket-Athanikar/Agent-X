import { apiFetch, API } from "./apiClient";

export async function getWorkspaceOverview() {
  return apiFetch("/workspace");
}

export async function listProjects() {
  return apiFetch("/projects");
}

export async function createProject(payload) {
  return apiFetch("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(projectId) {
  return apiFetch(`/projects/${projectId}`, { method: "DELETE" });
}

export async function uploadProjectDocument(projectId, file) {
  const form = new FormData();
  form.append("file", file);

  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("agent_x_user_session") || localStorage.getItem("agentforge_user_session") || "{}").token
      : null;

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}/projects/${projectId}/documents`, {
    method: "POST",
    headers,
    body: form,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Upload failed");
  return data;
}

export async function getUsageSummary() {
  return apiFetch("/usage/summary");
}

export async function getBillingStatus() {
  return apiFetch("/billing/status");
}

export async function listBillingPlans() {
  return apiFetch("/billing/plans");
}

export async function listPayments() {
  return apiFetch("/billing/payments");
}

export async function subscribeToPlan(planId) {
  return apiFetch(`/billing/subscribe/${planId}`, { method: "POST" });
}

export async function createStripeCheckout(planId) {
  return apiFetch(`/billing/checkout/${planId}`, { method: "POST" });
}
