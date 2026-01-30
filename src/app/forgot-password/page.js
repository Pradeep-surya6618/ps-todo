"use client";

import { useState } from "react";
import Link from "next/link";
import { ListTodo, Mail, ArrowLeft, Loader2, Send } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call to send reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
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
            We'll send you a recovery link.
          </p>
        </div>

        <div className="glass bg-white/5 p-8 rounded-3xl space-y-6 border border-white/10 shadow-2xl">
          {isSent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Send size={32} />
              </div>
              <h2 className="text-xl font-bold text-white">Check your email</h2>
              <p className="text-gray-400 text-sm">
                We've sent a password reset link to <br />
                <span className="text-white font-bold">{email}</span>
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="text-primary text-sm font-bold hover:underline"
              >
                Didn't receive it? Try again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white font-medium"
                    placeholder="name@example.com"
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
                  "Send Reset Link"
                )}
                {!isLoading && <Send size={18} />}
              </button>
            </form>
          )}

          <div className="pt-2">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
