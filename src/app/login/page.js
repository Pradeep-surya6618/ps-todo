"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { Chrome, Heart } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  useEffect(() => {
    if (registered) {
      enqueueSnackbar("Account created! Please log in.", {
        variant: "success",
      });
    }
  }, [registered, enqueueSnackbar]);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      enqueueSnackbar("Welcome back!", { variant: "success" });
      router.push("/dashboard");
    } else {
      setIsLoading(false);
      enqueueSnackbar("Invalid email or password", { variant: "error" });
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex min-h-[100dvh] bg-background text-foreground relative overflow-y-auto transition-colors duration-500">
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

      {/* Left Side: Form - Centered */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 z-10 transition-colors duration-500">
        <div className="w-full max-w-[380px] space-y-8 animate-slide-up">
          {/* Centered Welcome Section */}
          <div className="text-center space-y-2 animate-fade-in-delayed">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Sign in to continue your cosmic journey
            </p>
          </div>

          {/* Form with Enhanced Animations */}
          <form onSubmit={handleCredentialsLogin} className="space-y-5">
            <div
              className="space-y-2 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <label className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm text-foreground font-medium backdrop-blur-sm hover:border-primary/30 focus:scale-[1.01]"
                placeholder="surya1812@gmail.com"
                required
              />
            </div>

            <div
              className="space-y-2 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex justify-between items-center w-full">
                <label className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 ml-1">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] font-semibold text-primary hover:underline cursor-pointer transition-all hover:scale-105"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm text-foreground font-medium backdrop-blur-sm hover:border-primary/30 focus:scale-[1.01]"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-pink-500 text-white font-bold text-sm hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed mt-4 cursor-pointer relative overflow-hidden group animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <span className="relative z-10">
                {isLoading ? "Signing in..." : "Sign in"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </form>

          {/* Divider */}
          <div
            className="relative animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-black/10 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-background px-3 text-gray-500">OR</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border-2 border-black/10 dark:border-white/10 bg-[var(--google-btn-bg)] py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:border-primary/30 hover:shadow-lg active:scale-[0.97] cursor-pointer backdrop-blur-sm hover:bg-white/10 dark:hover:bg-white/5 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
              />
              <path
                fill="#ea4335"
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z"
              />
            </svg>
            <span className="text-sm font-bold text-[var(--google-btn-text)]">
              Sign in with Google
            </span>
          </button>

          {/* Footer Link */}
          <p
            className="text-center text-[13px] font-semibold text-gray-500 mt-6 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            New to SunMoonie?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline transition-all cursor-pointer font-bold ml-1 hover:scale-105 inline-block"
            >
              Create an account
            </Link>
          </p>
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

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] bg-background flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
