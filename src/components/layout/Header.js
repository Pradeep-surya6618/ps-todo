"use client";

import Link from "next/link";
import { Menu, Bell, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavStore } from "@/store/useNavStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession } from "next-auth/react";

export default function Header() {
  const { toggleMobileDrawer, isSidebarCollapsed, toggleSidebar } =
    useNavStore();
  const { data: session } = useSession();

  return (
    <header className="h-16 glass sticky top-0 z-40 border-b border-border shadow-sm px-4 md:px-8 flex items-center justify-between transition-colors duration-500 relative overflow-visible">
      {/* Animated Space Background - Desktop always, Mobile only in dark theme */}
      <div className="hidden dark:block md:block absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Stars */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-foreground/40 dark:bg-white/60 rounded-full animate-pulse-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.6 + 0.4,
            }}
          />
        ))}

        {/* Floating Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-2xl animate-float" />
        <div className="absolute top-0 right-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl animate-float-delayed" />
      </div>

      {/* Sidebar Toggle Button - Desktop Only */}
      <button
        onClick={toggleSidebar}
        className="hidden md:flex p-2 hover:bg-primary/10 text-primary rounded-xl bg-card border-2 border-primary/30 shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer relative z-10"
        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isSidebarCollapsed ? (
          <ChevronRight size={18} />
        ) : (
          <ChevronLeft size={18} />
        )}
      </button>

      <div
        className="flex items-center gap-3 md:hidden cursor-pointer relative z-10"
        title="SunMoonie"
      >
        <div className="w-10 h-10 overflow-hidden flex items-center justify-center">
          <img
            src="/icons/Logo.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-foreground font-black tracking-tight text-lg">
          SunMoonie
        </span>
      </div>

      <div className="flex items-center justify-end ml-auto gap-3 relative z-10">
        <button
          className="p-2.25 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-400 relative transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </button>

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 pl-1 cursor-pointer group"
          title="View Profile"
        >
          {session?.user?.image ? (
            <div className="w-10 h-10 rounded-xl ring-2 ring-primary/60 group-hover:ring-primary shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all overflow-hidden">
              <img
                src={session.user.image}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl ring-2 ring-primary/60 group-hover:ring-primary shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all bg-background flex items-center justify-center text-primary font-black">
              <span className="text-sm">{session?.user?.name?.[0] || "U"}</span>
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
