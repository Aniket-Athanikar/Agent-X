"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, verifyEmail as verifyEmailApi, resendOtp, deleteCurrentAccount } from "./authApi";
import { store } from "@/dashboard/store/store";
import { resetUserWorkspace } from "@/dashboard/store/dashboardSlice";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    const session = localStorage.getItem("agent_x_user_session") || localStorage.getItem("agentforge_user_session");
    if (session) {
      setUser(JSON.parse(session));
      localStorage.setItem("agent_x_user_session", session);
      localStorage.removeItem("agentforge_user_session");
    }
    setLoading(false);
  }, []);

  const register = async (email, password, fullName) => {
    const res = await registerUser({
      name: fullName,
      email: email,
      password: password
    });

    if (res.success) {
      localStorage.setItem("verify_email", email);
      return { success: true };
    } else {
      return { success: false, message: res.detail || res.message || "Registration failed." };
    }
  };

  const verifyEmail = async (code) => {
    const emailToVerify = localStorage.getItem("verify_email");
    if (!emailToVerify) {
      return { success: false, message: "No registration in progress." };
    }

    const res = await verifyEmailApi(emailToVerify, code);
    if (res.success) {
      const userSession = {
        email: res.user.email,
        fullName: res.user.name,
        verified: true,
        earnings: 0.00,
        tasksCompleted: 0,
        token: res.token || null
      };
      setUser(userSession);
      localStorage.setItem("agent_x_user_session", JSON.stringify(userSession));
      localStorage.removeItem("verify_email");
      localStorage.removeItem("login_flow");
      
      return { success: true, redirect: "/dashboard" };
    } else {
      return { success: false, message: res.detail || "Verification failed." };
    }
  };

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    if (res.success) {
      if (res.requiresVerification) {
        localStorage.setItem("verify_email", email);
        localStorage.setItem("login_flow", "true");
        return { success: false, requiresVerification: true, message: "Verification code sent to email." };
      }
      const userSession = {
        email: res.user.email,
        fullName: res.user.name,
        verified: true,
        earnings: 0.00,
        tasksCompleted: 0,
        token: res.token || null
      };
      setUser(userSession);
      localStorage.setItem("agent_x_user_session", JSON.stringify(userSession));
      
      return { success: true };
    } else {
      return { success: false, message: res.detail || "Invalid email or password." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agent_x_user_session");
    localStorage.removeItem("agentforge_user_session");
  };

  const deleteAccount = async () => {
    const result = await deleteCurrentAccount();
    if (result.success) {
      logout();
      store.dispatch(resetUserWorkspace());
      localStorage.removeItem("agent_x_workspace_session");
      localStorage.removeItem("agentforge_workspace_session");
      sessionStorage.clear();
    }
    return result;
  };

  const forgotPassword = (email) => {
    return { success: true };
  };

  const resetPassword = (code, newPassword) => {
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, verifyEmail, login, logout, deleteAccount, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
