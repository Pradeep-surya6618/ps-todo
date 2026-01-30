"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, Settings, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Home", icon: Home, href: "/dashboard" },
  { name: "Tasks", icon: ListTodo, href: "/dashboard/tasks" },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass shadow-2xl bg-white/5 p-6 z-40 border-r border-white/10">
      <div className="text-2xl font-bold text-primary mb-12 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <ListTodo size={24} />
        </div>
        <span className="tracking-tight">TodoPWA</span>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group hover:bg-white/5",
              pathname === item.href
                ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5 scale-[1.02]"
                : "text-gray-500 hover:text-gray-300",
            )}
          >
            <item.icon
              size={20}
              className={cn(
                "transition-transform group-hover:scale-110",
                pathname === item.href ? "text-primary" : "text-gray-600",
              )}
            />
            <span className="font-semibold">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-3 pt-6 border-t border-white/10">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-white/5 text-gray-500 hover:text-gray-300",
          )}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl transition-all duration-300 hover:bg-red-500/10 text-gray-500 hover:text-red-400 group"
        >
          <LogOut
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
          <span className="font-medium text-left">Logout</span>
        </button>
      </div>
    </aside>
  );
}
