"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { useNavStore } from "@/store/useNavStore";
import { useSession } from "next-auth/react";
import { useNotificationStore } from "@/store/useNotificationStore";


export default function Header() {
  const { toggleMobileDrawer, isSidebarCollapsed, toggleSidebar } =
    useNavStore();
  const { data: session } = useSession();
  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
              top: `${((i * 37 + 13) % 97)}%`,
              left: `${((i * 53 + 7) % 99)}%`,
              animationDelay: `${(i * 0.2) % 3}s`,
              opacity: (i % 5) * 0.12 + 0.4,
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

      <div className="flex items-center justify-end ml-auto gap-2 relative z-10">
        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          className="relative p-2 hover:bg-primary/10 rounded-xl transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell size={20} className="text-gray-500 hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg shadow-primary/30">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

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
              <span className="text-sm">
                {session?.user?.name?.[0] || "U"}
              </span>
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
