"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", icon: Home, href: "/dashboard" },
  { name: "Tasks", icon: ListTodo, href: "/dashboard/tasks" },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass shadow-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-around z-50 px-2">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center gap-1 transition-all duration-500 relative px-4 py-2 rounded-xl",
            pathname === item.href ? "text-primary scale-110" : "text-gray-500",
          )}
        >
          {pathname === item.href && (
            <span className="absolute top-0 w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(255,46,99,0.5)] animate-pulse" />
          )}
          <item.icon size={22} strokeWidth={pathname === item.href ? 2.5 : 2} />
        </Link>
      ))}
    </nav>
  );
}
