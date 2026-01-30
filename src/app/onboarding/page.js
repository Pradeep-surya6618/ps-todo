"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  User,
  Briefcase,
  FileText,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function Onboarding() {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({ bio: "", role: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOnboard = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/user/onboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Update the session locally
        await update({ isOnboarded: true });
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-2xl overflow-hidden shadow-2xl shadow-secondary/40 mb-4 animate-pulse">
            <img
              src="/icons/Moon.jpg"
              alt="SunMoonie"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Let's build your profile
          </h1>
          <p className="text-gray-500 font-medium tracking-wide">
            Customize your experience in the SunMoonie cosmic system.
          </p>
        </div>

        <div className="glass bg-white/5 p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xl">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">
                {session?.user?.name}
              </h2>
              <p className="text-gray-500 text-sm">{session?.user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleOnboard} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                What do you do?
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-white font-medium"
                  placeholder="e.g. Designer, Developer, Student"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                About You
              </label>
              <div className="relative">
                <FileText
                  className="absolute left-4 top-4 text-gray-500"
                  size={18}
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-white font-medium h-32 resize-none"
                  placeholder="Tell us a bit about your goals..."
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl bg-secondary text-white font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all active:scale-[0.98] shadow-2xl shadow-secondary/20 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                "Complete Setup"
              )}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
