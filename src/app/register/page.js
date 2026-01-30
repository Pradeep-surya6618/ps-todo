"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSnackbar } from "notistack";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        enqueueSnackbar("Registration successful! Please log in.", {
          variant: "success",
        });
        router.push("/login?registered=true");
      } else {
        enqueueSnackbar(data.error || "Something went wrong", {
          variant: "error",
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      enqueueSnackbar("Network error. Please check your connection.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Background Glow - Theme Aware */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/20 blur-[120px] rounded-full transition-opacity duration-1000 hidden dark:block" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 blur-[100px] rounded-full transition-opacity duration-1000 hidden dark:block" />

      {/* Left Side: Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 z-10 transition-colors duration-500">
        <div className="w-full max-w-[340px] space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md overflow-hidden border border-black/10 dark:border-white/10 shadow-lg cursor-pointer transition-transform hover:scale-110">
                <img
                  src="/icons/Moon.jpg"
                  alt="SunMoonie"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-foreground font-black text-lg tracking-tight">
                SunMoonie
              </span>
            </div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              Create your account
            </h1>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm text-foreground font-medium"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm text-foreground font-medium"
                placeholder="Johndoe@gmail.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-[12px] font-bold text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline transition-all cursor-pointer font-bold ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Banner */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden m-4 rounded-[40px] shadow-2xl">
        <img
          src="/icons/banner.jpg"
          alt="Branding Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 dark:from-black/60 to-transparent" />
      </div>
    </div>
  );
}
