"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTheme } from "next-themes";
import { useNavStore } from "@/store/useNavStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Type,
  LogOut,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  Shield,
  Palette,
  Bell,
} from "lucide-react";

const FONTS = [
  { name: "Default (Inter)", value: "font-sans", class: "font-sans" },
  { name: "Serif", value: "font-serif", class: "font-serif" },
  { name: "Mono", value: "font-mono", class: "font-mono" },
  { name: "Handwritten", value: "font-hand", class: "font-hand" },
];

const deviceIcon = (device) => {
  if (device === "Mobile") return Smartphone;
  if (device === "Tablet") return Tablet;
  return Monitor;
};

function SettingsContent() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { setLogoutDialogOpen } = useNavStore();
  const [mounted, setMounted] = useState(false);
  const [activeFont, setActiveFont] = useState("font-sans");
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedFont = localStorage.getItem("app-font");
    if (savedFont) {
      setActiveFont(savedFont);
    }

    // Check push notification status
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setPushSupported(true);
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setPushEnabled(!!sub);
        });
      });
    }

    // Fetch login activities
    fetch("/api/user/activity")
      .then((res) => res.json())
      .then((data) => {
        setActivities(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setActivitiesLoading(false));
  }, []);

  const handleFontChange = (fontClass) => {
    setActiveFont(fontClass);
    document.documentElement.classList.remove(
      "font-sans",
      "font-serif",
      "font-mono",
      "font-hand",
    );
    document.documentElement.classList.add(fontClass);
    localStorage.setItem("app-font", fontClass);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-black text-foreground">
          Settings
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Customize your SunMoonie experience
        </p>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-3xl shadow-xl lg:shadow-none overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border bg-overlay flex items-center gap-3">
          <Palette size={18} className="text-primary" />
          <h2 className="font-bold text-foreground">Appearance</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">App Theme</p>
                <p className="text-xs text-gray-500">
                  {isDark ? "Dark Mode" : "Light Mode"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="relative w-12 h-7 bg-overlay border border-border rounded-full transition-colors duration-300 data-[state=checked]:bg-primary cursor-pointer"
              data-state={isDark ? "checked" : "unchecked"}
            >
              <div
                className={cn(
                  "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md",
                  isDark ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Typography */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-3xl shadow-xl lg:shadow-none overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border bg-overlay flex items-center gap-3">
          <Type size={18} className="text-primary" />
          <h2 className="font-bold text-foreground">Typography</h2>
        </div>
        <div className="p-6 space-y-2">
          {FONTS.map((font) => (
            <button
              key={font.value}
              onClick={() => handleFontChange(font.class)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
                activeFont === font.class
                  ? "bg-primary/10 border-primary/50 text-foreground"
                  : "bg-overlay border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-gray-500",
              )}
            >
              <div className="flex items-center gap-3">
                <Type
                  size={18}
                  className={
                    activeFont === font.class ? "text-primary" : "text-gray-500"
                  }
                />
                <span className={cn("text-sm font-medium", font.class)}>
                  {font.name}
                </span>
              </div>
              {activeFont === font.class && (
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_0_rgba(236,72,153,0.8)]" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-3xl shadow-xl lg:shadow-none overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border bg-overlay flex items-center gap-3">
          <Bell size={18} className="text-primary" />
          <h2 className="font-bold text-foreground">Notifications</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">
                  Push Notifications
                </p>
                <p className="text-xs text-gray-500">
                  {!pushSupported
                    ? "Not supported in this browser"
                    : pushEnabled
                      ? "Enabled"
                      : "Disabled"}
                </p>
              </div>
            </div>
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                pushEnabled
                  ? "bg-green-500 shadow-[0_0_8px_0_rgba(34,197,94,0.6)]"
                  : "bg-gray-400",
              )}
            />
          </div>
          <p className="text-xs text-gray-500 mt-3 ml-[52px]">
            Manage push notifications from the bell icon in the header
          </p>
        </div>
      </motion.div>

      {/* Login Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-3xl shadow-xl lg:shadow-none overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border bg-overlay flex items-center gap-3">
          <Shield size={18} className="text-primary" />
          <h2 className="font-bold text-foreground">Login Activity</h2>
        </div>
        <div className="p-6">
          {activitiesLoading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
                    <div className="h-2.5 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <Shield size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                No login activity recorded yet
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {activities.map((activity, i) => {
                const DeviceIcon = deviceIcon(activity.device);
                return (
                  <div
                    key={activity._id || i}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-2xl transition-colors",
                      i === 0
                        ? "bg-primary/5 border border-primary/20"
                        : "hover:bg-overlay",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2.5 rounded-xl",
                        i === 0
                          ? "bg-primary/10 text-primary"
                          : "bg-overlay text-gray-500",
                      )}
                    >
                      <DeviceIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground truncate">
                          {activity.browser} on {activity.os}
                        </p>
                        {i === 0 && (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Globe size={10} />
                          {activity.ip}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={10} />
                          {formatDate(activity.loginAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <button
          onClick={() => setLogoutDialogOpen(true)}
          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </motion.div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsContent />
    </DashboardLayout>
  );
}
