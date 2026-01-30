"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { Chrome } from "lucide-react";
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
                  src="/icons/logo.png"
                  alt="SunMoonie"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-foreground font-black text-lg tracking-tight">
                SunMoonie
              </span>
            </div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              Welcome back
            </h1>
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--auth-input-bg)] border border-[var(--auth-input-border)] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm text-foreground font-medium"
                placeholder="surya1812@gmail.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center w-full">
                <label className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] font-medium text-primary hover:underline cursor-pointer"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-black/10 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-background px-2 text-gray-500">OR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-black/10 dark:border-white/10 bg-[var(--google-btn-bg)] py-2.5 rounded-full flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer shadow-sm"
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

          <p className="text-center text-[12px] font-bold text-gray-500 mt-6">
            New to SunMoonie?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline transition-all cursor-pointer font-bold ml-1"
            >
              Create an account
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
