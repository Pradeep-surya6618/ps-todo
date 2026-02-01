"use client";

import { useState, useEffect } from "react";
import { X, Moon, Sun, Type, LogOut, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const FONTS = [
  { name: "Default (Inter)", value: "font-sans", class: "font-sans" },
  { name: "Serif", value: "font-serif", class: "font-serif" },
  { name: "Mono", value: "font-mono", class: "font-mono" },
];

export default function SettingsDialog({ isOpen, onClose }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeFont, setActiveFont] = useState("font-sans");

  useEffect(() => {
    setMounted(true);
    // Load saved font from localStorage if exists
    const savedFont = localStorage.getItem("app-font");
    if (savedFont) {
      document.documentElement.classList.remove(
        "font-sans",
        "font-serif",
        "font-mono",
      );
      document.documentElement.classList.add(savedFont);
      setActiveFont(savedFont);
    }
  }, []);

  const handleFontChange = (fontClass) => {
    setActiveFont(fontClass);
    document.documentElement.classList.remove(
      "font-sans",
      "font-serif",
      "font-mono",
    );
    document.documentElement.classList.add(fontClass);
    localStorage.setItem("app-font", fontClass);
  };

  const handleLogout = () => {
    // We can trigger the existing logout confirmation dialog from here if we want,
    // or just act as a direct logout trigger.
    // For now, let's just create a direct logout action or a callback.
    // Since the requirement is just "logout button", I'll use signOut directly or passed prop.
    // But wait, there is a LogoutConfirmationDialog that exists.
    // I should probably just expose a prop `onLogout` to trigger that dialog in the parent page
    // OR just use signOut() here directly if that's acceptable.
    // Given the user asked for "Logout Button" inside settings, I'll assume standard flow.
    // But to be consistent with the "Logout Confirmation Dialog" task I finished, I should probably trigger that.
    // For now, let's return a simple button that the parent can handle or direct signout.
    // I'll emit an event `onLogoutClick`.
  };

  if (!isOpen || !mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-background border border-border w-full max-w-sm rounded-[32px] shadow-2xl animate-scale-in relative overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">Settings</h3>
          <button
            onClick={onClose}
            className="p-2 bg-overlay hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Toggle */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">
              Appearance
            </label>
            <div className="bg-overlay border border-border rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl text-primary">
                  {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <p className="font-bold text-foreground">App Theme</p>
                  <p className="text-xs text-gray-400">
                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative w-12 h-7 bg-overlay border border-border rounded-full transition-colors duration-300 data-[state=checked]:bg-primary"
                data-state={theme === "dark" ? "checked" : "unchecked"}
              >
                <div
                  className={cn(
                    "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md",
                    theme === "dark" ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Font Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider ml-1">
              Typography
            </label>
            <div className="space-y-2">
              {FONTS.map((font) => (
                <button
                  key={font.value}
                  onClick={() => handleFontChange(font.class)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200",
                    activeFont === font.class
                      ? "bg-primary/10 border-primary/50 text-foreground"
                      : "bg-overlay border-transparent hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Type
                      size={18}
                      className={
                        activeFont === font.class
                          ? "text-primary"
                          : "text-gray-500"
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
          </div>

          {/* Logout */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                // Assuming parent handles functionality or we dispatch event.
                // But wait, user asked for logout button here.
                // I will dispatch an event via prop `onLogout`.
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("open-logout-dialog"));
                }
              }}
              className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
