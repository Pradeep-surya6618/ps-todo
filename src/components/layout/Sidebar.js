"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CheckCircle2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  ListTodo,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useNavStore } from "@/store/useNavStore";
import { cn } from "@/lib/utils";
import LogoutConfirmationDialog from "../LogoutConfirmationDialog";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Upcoming", href: "/dashboard/upcoming" },
  { icon: CheckCircle2, label: "Completed", href: "/dashboard/completed" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useNavStore();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col glass border-r border-black/5 dark:border-white/5 h-screen sticky top-0 transition-all duration-300 ease-in-out z-50 transition-colors duration-500",
        isSidebarCollapsed ? "w-20" : "w-72",
      )}
    >
      <div className="p-6 h-20 flex items-center justify-between overflow-hidden">
        <div
          className={cn(
            "flex items-center gap-3 transition-opacity duration-300",
            isSidebarCollapsed && "opacity-0 invisible",
          )}
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/30 shrink-0">
            <img
              src="/icons/Moon.jpg"
              alt="SunMoonie"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground whitespace-nowrap">
            SunMoonie.
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-400 absolute right-[-16px] top-6 bg-background border border-black/10 dark:border-white/10 shadow-lg"
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-bold tracking-tight relative group",
              pathname === item.href
                ? "bg-primary text-white shadow-xl shadow-primary/20"
                : "text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground",
            )}
          >
            <item.icon size={22} className="shrink-0" />
            {!isSidebarCollapsed && (
              <span className="text-sm">{item.label}</span>
            )}
            {isSidebarCollapsed && (
              <div className="absolute left-20 bg-black dark:bg-gray-900 border border-black/10 dark:border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100]">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-black/5 dark:border-white/5">
        <button
          onClick={() => setIsLogoutDialogOpen(true)}
          className={cn(
            "flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 font-bold",
            isSidebarCollapsed && "justify-center",
          )}
        >
          <LogOut size={22} className="shrink-0" />
          {!isSidebarCollapsed && <span className="text-sm">Log Out</span>}
        </button>
      </div>

      <LogoutConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      />
    </aside>
  );
}
