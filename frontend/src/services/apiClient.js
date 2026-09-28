// In Docker the browser reaches FastAPI through Nginx. A relative URL keeps the
// request on the current Agent-X origin instead of accidentally using another
// application that happens to listen on localhost:8000.
const API = process.env.NEXT_PUBLIC_API_URL || "/api";
console.log("API URL =", API);
export function getStoredToken() {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem("agent_x_user_session") || localStorage.getItem("agentforge_user_session");
  if (!session) return null;
  try {
    return JSON.parse(session).token || null;
  } catch {
    return null;
  }
}

export function authHeaders(extra = {}) {
  const token = getStoredToken();
  const headers = { ...extra };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...authHeaders(),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || data.message || `Request failed (${res.status})`);
  }

  return data;
}

export { API };
