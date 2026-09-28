import { API, authHeaders } from "./apiClient";

// Helper to handle standard response checks
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    return {
      success: false,
      detail: data.detail || data.message || "Request failed"
    };
  }
  // If the server didn't set a success flag explicitly, default to true for HTTP 2xx
  if (data.success === undefined) {
    data.success = true;
  }
  return data;
}

// ================= LOGIN =================

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    return {
      success: false,
      detail: "Cannot connect to backend"
    };
  }
}

// ================= REGISTER =================

export async function registerUser(data) {
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password
  };

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    return {
      success: false,
      detail: "Registration failed"
    };
  }
}

// ================= SEND OTP =================

export async function sendVerificationOtp(email) {
  try {
    const res = await fetch(`${API}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    return {
      success: false,
      detail: "OTP sending failed"
    };
  }
}

// ================= VERIFY EMAIL =================

export async function verifyEmail(email, code) {
  try {
    const res = await fetch(`${API}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, code })
    });
    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    return {
      success: false,
      detail: "Verification failed"
    };
  }
}

// ================= RESEND OTP =================

export async function resendOtp(email) {
  try {
    const res = await fetch(`${API}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    return {
      success: false,
      detail: "Resending OTP failed"
    };
  }
}

export async function deleteCurrentAccount() {
  try {
    const res = await fetch(`${API}/auth/account`, { method: "DELETE", headers: authHeaders() });
    return await handleResponse(res);
  } catch (err) {
    return { success: false, detail: "Cannot connect to backend" };
  }
}
