"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/authContext";
import { resendOtp } from "@/services/authApi";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60; // 1 minute resend access cooldown

function playChime(success = true) {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (success) {
      // Elite AgentForge premium chime (double sine wave pulse)
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      
      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      // Cybernetic system error buzz
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(110, now + 0.08);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {
    console.error("Synth play fail:", err);
  }
}

function useToasts() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      playChime(type === "success");
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return { toasts, pushToast, removeToast };
}

function ToastStack({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[90%] max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => removeToast(t.id)}
          className={`cursor-pointer rounded-xl px-4 py-3 text-sm shadow-lg border backdrop-blur-md
            animate-[toast-in_0.25s_ease-out]
            ${t.type === "success"
              ? "bg-[#22C55E]/15 border-[#22C55E]/30 text-[#22C55E]"
              : t.type === "error"
                ? "bg-red-500/15 border-red-400/30 text-red-300"
                : "bg-cyan-900/30 border-cyan-500/30 text-gray-200"
            }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

function OtpInput({ value, onChange, disabled, inputsRef }) {
  const digits = value.split("");

  const setDigit = (index, char) => {
    const newDigits = value.split("");
    newDigits[index] = char;
    const newValue = newDigits.join("").slice(0, OTP_LENGTH);
    onChange(newValue);
  };

  const handleChange = (index, e) => {
    const raw = e.target.value;
    const lastChar = raw.replace(/\D/g, "").slice(-1);

    if (!lastChar) {
      setDigit(index, "");
      return;
    }

    setDigit(index, lastChar);

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const safeDigits = Array.from({ length: OTP_LENGTH }, (_, i) => digits[i] || "");

  return (
    <div className="flex justify-between gap-2.5 max-w-[340px] mx-auto select-none" onPaste={handlePaste}>
      {safeDigits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          maxLength={2}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-14 bg-[#0b1221] border border-cyan-500/30 rounded-xl text-center text-lg font-black text-white focus:outline-none focus:border-[#6D5DFB]/50 focus:ring-1 focus:ring-[#6D5DFB]/50 transition-all font-mono"
        />
      ))}
    </div>
  );
}

export default function VerifyEmailForm() {
  const router = useRouter();
  const { verifyEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const inputsRef = useRef([]);
  const { toasts, pushToast, removeToast } = useToasts();

  useEffect(() => {
    const stored = localStorage.getItem("verify_email");
    if (!stored) {
      setError("No pending email verification found. Redirecting...");
      setTimeout(() => router.push("/register"), 2000);
      return;
    }
    setEmail(stored);
  }, [router]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle verification logic
  const handleVerify = useCallback(async (codeToVerify) => {
    setError("");
    setLoading(true);

    try {
      const res = await verifyEmail(codeToVerify);
      console.log("Verification response:", res);
      if (res.success) {
        pushToast("Verification successful!", "success");
        setTimeout(() => router.push(res.redirect || "/dashboard"), 1500);
      } else {
        setError(res.message || "Invalid code. Please try again.");
        playChime(false);
        // Auto-erase OTP input on failure and refocus on the first box
        setOtp("");
        inputsRef.current[0]?.focus();
      }
    } catch {
      setError("Cannot connect to verification endpoint");
      playChime(false);
      // Auto-erase OTP input on failure
      setOtp("");
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [verifyEmail, router, pushToast]);

  // Auto-enter OTP logic: trigger verify automatically when length reaches 6 digits
  useEffect(() => {
    if (otp.length === OTP_LENGTH && !loading) {
      handleVerify(otp);
    }
  }, [otp, loading, handleVerify]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === OTP_LENGTH && !loading) {
      handleVerify(otp);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    try {
      const res = await resendOtp(email);
      if (res.success) {
        pushToast("A new verification code has been sent.", "success");
        setResendTimer(RESEND_SECONDS);
      } else {
        setError(res.detail || "Resend failed");
        playChime(false);
      }
    } catch {
      setError("Cannot connect to server to resend code");
      playChime(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#050816] p-8 rounded-2xl border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.7)] relative">
      <ToastStack toasts={toasts} removeToast={removeToast} />
      
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">Security verification</h2>
        <p className="text-xs text-gray-400 mt-2 font-semibold leading-relaxed">
          We sent a verification code to:<br />
          <strong className="text-white mt-1 block">{email || "your email address"}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <OtpInput value={otp} onChange={setOtp} disabled={loading} inputsRef={inputsRef} />

        <div className="text-center">
          <button
            type="button"
            disabled={resendTimer > 0}
            onClick={handleResend}
            className="text-xs font-bold text-[#6D5DFB] hover:text-[#7C3AED] disabled:text-gray-500 transition-colors"
          >
            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend verification code"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || otp.length < OTP_LENGTH}
          className="w-full rounded-xl bg-gradient-to-r from-[#6D5DFB] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] py-3.5 text-sm font-black text-white transition-all shadow-[0_0_20px_rgba(109,93,251,0.3)] hover:shadow-[0_0_30px_rgba(109,93,251,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none flex justify-center items-center gap-2 mt-2 cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </button>
      </form>
    </div>
  );
}
