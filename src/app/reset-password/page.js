"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ListTodo,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-2xl overflow-hidden shadow-2xl shadow-primary/40 mb-4 cursor-pointer">
            <img
              src="/icons/Moon.jpg"
              alt="SunMoonie"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            SunMoonie
          </h1>
          <p className="text-gray-500 font-medium">
            Reset your account access.
          </p>
        </div>

        <div className="glass bg-white/5 p-8 rounded-3xl space-y-6 border border-white/10 shadow-2xl">
          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-white">Password Reset!</h2>
              <p className="text-gray-400 text-sm">
                You will be redirected to login shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Update Password"
                )}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
