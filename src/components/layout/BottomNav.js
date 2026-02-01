"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Calendar, Activity } from "lucide-react";
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
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex items-center justify-center p-3 rounded-xl transition-all duration-300",
            pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
              ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30"
              : "text-gray-500 hover:text-foreground",
          )}
        >
          <item.icon size={22} />
        </Link>
      ))}
    </nav>
  );
}
