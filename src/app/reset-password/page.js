"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { CheckCircle2, Heart } from "lucide-react";
import { Suspense } from "react";
import BodyScrollLock from "@/components/BodyScrollLock";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  useEffect(() => {
    if (!resetToken) {
      enqueueSnackbar("Invalid reset link. Please try again.", {
        variant: "error",
      });
      router.push("/forgot-password");
    }
  }, [resetToken, router, enqueueSnackbar]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters long", {
        variant: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        enqueueSnackbar("Password reset successfully!", {
          variant: "success",
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        enqueueSnackbar(data.error || "Failed to reset password", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar("Network error. Please try again.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background text-foreground relative overflow-hidden transition-colors duration-500 flex flex-col">
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

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="min-h-full flex items-center justify-center p-4 md:p-8 z-10 transition-colors duration-500">
          <div className="w-full max-w-[380px] space-y-8 animate-slide-up">
            {/* Centered Welcome Section */}
            <div className="text-center space-y-2 animate-fade-in-delayed">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                Create new password
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Please choose a strong password to protect your account
              </p>
            </div>

            {isSuccess ? (
              <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-foreground font-bold">Password Reset!</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You will be redirected to login shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm text-foreground font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm text-foreground font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}

            <p className="text-center text-[12px] font-bold text-gray-500 mt-6">
              <Link
                href="/login"
                className="text-primary hover:underline transition-all cursor-pointer font-bold"
              >
                Back to Login
              </Link>
            </p>
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

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] bg-background flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <BodyScrollLock />
      <ResetPasswordForm />
    </Suspense>
  );
}
