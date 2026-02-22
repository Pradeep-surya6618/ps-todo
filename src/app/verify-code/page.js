"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { Shield, Heart } from "lucide-react";
import { Suspense } from "react";
import BodyScrollLock from "@/components/BodyScrollLock";

function VerifyCodeForm() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    // Focus first input on mount
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if pasted data is 4 digits
    if (/^\d{4}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputRefs[3].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 4) {
      enqueueSnackbar("Please enter the complete 4-digit code", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await res.json();

      if (res.ok) {
        enqueueSnackbar("Code verified successfully!", { variant: "success" });
        router.push(`/reset-password?token=${data.resetToken}`);
      } else {
        enqueueSnackbar(data.error || "Invalid code", { variant: "error" });
        setCode(["", "", "", ""]);
        inputRefs[0].current?.focus();
      }
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar("Network error. Please try again.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        enqueueSnackbar("New code sent to your email!", { variant: "success" });
        setCode(["", "", "", ""]);
        inputRefs[0].current?.focus();
      } else {
        enqueueSnackbar("Failed to resend code", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Network error. Please try again.", { variant: "error" });
    }
  };

  return (
    <div className="fixed inset-0 bg-background text-foreground overflow-hidden transition-colors duration-500 flex flex-col lg:flex-row">
      <BodyScrollLock />
      {/* Fixed Logo & Brand - Top Left */}
      <div className="fixed top-0 left-0 z-50 p-4 md:p-6 animate-fade-in">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 cursor-pointer transition-all duration-300 group-hover:scale-110">
            <img
              src="/icons/Logo.png"
              alt="SunMoonie"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-foreground font-black text-xl tracking-tight transition-all duration-300 group-hover:text-primary">
            SunMoonie
          </span>
        </div>
      </div>

      {/* Animated Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/20 blur-[120px] rounded-full transition-opacity duration-1000 animate-float" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 blur-[100px] rounded-full transition-opacity duration-1000 animate-float-delayed" />
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-pink-500/5 dark:bg-pink-500/10 blur-[80px] rounded-full transition-opacity duration-1000 animate-pulse-slow" />

      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
      >
        <div className="min-h-full flex items-center justify-center p-4 pt-16 md:p-8 md:pt-8 z-10 transition-colors duration-500">
          <div className="w-full max-w-[420px] space-y-8 animate-slide-up">
            {/* Centered Welcome Section */}
            <div className="text-center space-y-3 animate-fade-in-delayed">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                Enter Verification Code
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                We've sent a 4-digit code to
                <br />
                <span className="text-primary font-semibold">{email}</span>
              </p>
            </div>

            {/* Form with Code Inputs */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 4-Box Code Input */}
              <div
                className="flex justify-center gap-3 animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-16 h-20 text-center text-3xl font-bold bg-[var(--auth-input-bg)] border-2 border-[var(--auth-input-border)] rounded-xl outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-foreground backdrop-blur-sm hover:border-primary/30 focus:scale-105"
                    required
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || code.some((d) => !d)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-pink-500 text-white font-bold text-sm hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden group animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <span className="relative z-10">
                  {isLoading ? "Verifying..." : "Verify Code"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>

            {/* Resend Code */}
            <div
              className="text-center space-y-3 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <p className="text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendCode}
                  className="text-primary font-semibold hover:underline cursor-pointer transition-all hover:scale-105 inline-block"
                >
                  Resend Code
                </button>
              </p>
              <Link
                href="/login"
                className="text-primary hover:underline transition-all cursor-pointer font-semibold text-sm inline-block"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Banner with Enhanced Effects */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden m-4 rounded-[40px] shadow-2xl animate-fade-in-delayed group">
        <img
          src="/icons/banner.jpg"
          alt="Branding Banner"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 dark:from-black/60 to-transparent transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Centered Heart Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart
            className="text-primary drop-shadow-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-110"
            size={64}
            fill="white"
            strokeWidth={2}
          />
        </div>
      </div>
    </div>
  );
}

export default function VerifyCode() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-[380px] space-y-8 animate-pulse">
            <div className="text-center space-y-2">
              <div className="h-7 w-36 bg-gray-200 dark:bg-zinc-800 rounded-lg mx-auto" />
              <div className="h-4 w-52 bg-gray-200 dark:bg-zinc-800 rounded mx-auto" />
            </div>
            <div className="space-y-4">
              <div className="h-12 w-full bg-gray-200 dark:bg-zinc-800 rounded-xl" />
              <div className="h-12 w-full bg-gray-200 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>
        </div>
      }
    >
      <BodyScrollLock />
      <VerifyCodeForm />
    </Suspense>
  );
}
