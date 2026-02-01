"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Activity,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useNavStore } from "@/store/useNavStore";
import { cn } from "@/lib/utils";
import LogoutConfirmationDialog from "../LogoutConfirmationDialog";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Notes", href: "/dashboard/notes" },
  { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
  { icon: Activity, label: "Cycle Tracker", href: "/dashboard/cycle" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useNavStore();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col glass border-r border-border h-screen sticky top-0 transition-all duration-500 ease-in-out z-50 bg-card",
        isSidebarCollapsed ? "w-[70px]" : "w-64",
      )}
    >
      <div
        className={cn(
          "h-20 flex items-center relative overflow-visible transition-all duration-500",
          isSidebarCollapsed ? "justify-center p-4" : "justify-start px-6",
        )}
      >
        <div
          className={cn(
            "flex items-center transition-all duration-500 cursor-pointer",
            isSidebarCollapsed ? "flex-col gap-0" : "flex-row gap-3",
          )}
          title="SunMoonie Dashboard"
        >
          <div
            className={cn(
              "transition-all duration-500 flex items-center justify-center",
              isSidebarCollapsed ? "w-8 h-8" : "w-9 h-9",
            )}
          >
            <img
              src="/icons/Logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className={cn(
              "font-black tracking-tighter text-foreground whitespace-nowrap transition-all duration-500 overflow-hidden",
              isSidebarCollapsed
                ? "w-0 opacity-0"
                : "w-auto opacity-100 text-lg",
            )}
          >
            SunMoonie
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-primary/10 text-primary rounded-full absolute right-[-14px] top-7 bg-background border border-border shadow-md transition-all duration-300 cursor-pointer z-[60]"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={cn(
              "flex items-center px-3 py-3.5 rounded-2xl transition-all duration-300 font-bold tracking-tight relative group",
              isSidebarCollapsed
                ? "justify-center gap-0"
                : "justify-start gap-3",
              pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground",
            )}
          >
            <item.icon
              size={20}
              className={cn(
                "shrink-0 transition-transform duration-300 group-hover:scale-110",
                isSidebarCollapsed && "mx-auto",
              )}
            />
            <span
              className={cn(
                "text-xs transition-all duration-500 overflow-hidden whitespace-nowrap",
                isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={() => setIsLogoutDialogOpen(true)}
          title="Log Out"
          className={cn(
            "flex items-center w-full px-3 py-3.5 rounded-2xl text-primary hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 font-bold cursor-pointer",
            isSidebarCollapsed ? "justify-center gap-0" : "justify-start gap-3",
          )}
        >
          <LogOut
            size={20}
            className={cn("shrink-0", isSidebarCollapsed && "mx-auto")}
          />
          <span
            className={cn(
              "text-xs transition-all duration-500 overflow-hidden whitespace-nowrap",
              isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            Log Out
          </span>
        </button>
      </div>

      <LogoutConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      />
    </aside>
  );
}
