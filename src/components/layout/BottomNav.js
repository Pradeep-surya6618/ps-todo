"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Calendar, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Notes", icon: FileText, href: "/dashboard/notes" },
  { name: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
  { name: "Cycle Tracker", icon: Activity, href: "/dashboard/cycle" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 glass border border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-around z-50 px-2 shadow-2xl transition-colors duration-500">
      {/* Animated Space Background - Dark Theme Only */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-2xl">
        {/* Stars */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.6 + 0.4,
            }}
          />
        ))}

        {/* Floating Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-xl animate-float" />
        <div className="absolute top-0 right-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-xl animate-float-delayed" />
      </div>

      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center justify-center p-3 rounded-xl transition-all duration-300 relative group",
              isActive ? "text-white" : "text-gray-500 hover:text-foreground",
            )}
          >
            {/* Animated Active Background */}
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30 z-0"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            <motion.div
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative z-10"
            >
              <item.icon size={isActive ? 24 : 22} />
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
