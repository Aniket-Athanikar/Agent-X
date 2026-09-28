import { API } from "./apiClient";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data?.detail || data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export async function register(name, email, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

export async function verifyEmail(email, code) {
  const res = await fetch(`${API}/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });
  return handleResponse(res);
}