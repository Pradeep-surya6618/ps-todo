"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CheckCircle2,
  Settings,
  LogOut,
  X,
  User,
  ListTodo,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useNavStore } from "@/store/useNavStore";
import { cn } from "@/lib/utils";
import LogoutConfirmationDialog from "../LogoutConfirmationDialog";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Upcoming", href: "/dashboard/upcoming" },
  { icon: CheckCircle2, label: "Completed", href: "/dashboard/completed" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function MobileDrawer() {
  const pathname = usePathname();
  const { isMobileDrawerOpen, toggleMobileDrawer, setLogoutDialogOpen } =
    useNavStore();

  return (
    <AnimatePresence>
      {isMobileDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-background border-r border-white/10 z-[101] md:hidden flex flex-col p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/30">
                  <img
                    src="/icons/Moon.jpg"
                    alt="SunMoonie"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-black tracking-tighter text-white">
                  SunMoonie.
                </span>
              </div>
              <button
                onClick={toggleMobileDrawer}
                className="p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleMobileDrawer}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold tracking-tight",
                    pathname === item.href
                      ? "bg-primary text-white shadow-xl shadow-primary/20"
                      : "text-gray-500 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <item.icon size={22} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <button
                onClick={() => setLogoutDialogOpen(true)}
                className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all duration-300 font-bold"
              >
                <LogOut size={22} />
                <span className="text-sm">Log Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
