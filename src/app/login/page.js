"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ListTodo, Chrome, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
      alert("Invalid login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-primary items-center justify-center text-white shadow-2xl shadow-primary/40 mb-4 transition-transform hover:scale-110 duration-500 cursor-pointer">
            <ListTodo size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-gray-500 font-medium pb-2">
            Log in to sync your premium todos.
          </p>
        </div>

        <div className="glass bg-white/5 p-8 rounded-3xl space-y-6 border border-white/10 shadow-2xl">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full py-4 rounded-2xl bg-white text-gray-900 font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg shadow-white/5"
          >
            <Chrome size={20} />
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
              OR
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                Email
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

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                Password
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Log In"}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-bold text-gray-600">
          Don't have an account?{" "}
          <span className="text-primary hover:underline cursor-pointer">
            Sign up free
          </span>
        </p>
      </div>
    </div>
  );
}
