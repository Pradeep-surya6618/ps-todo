"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-3 rounded-2xl bg-white/5 backdrop-blur-md hover:bg-white/10 active:scale-95 transition-all duration-300 shadow-xl border border-white/10 group"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun
          className="text-yellow-400 group-hover:rotate-45 transition-transform"
          size={22}
        />
      ) : (
        <Moon
          className="text-primary group-hover:-rotate-12 transition-transform"
          size={22}
        />
      )}
    </button>
  );
}
