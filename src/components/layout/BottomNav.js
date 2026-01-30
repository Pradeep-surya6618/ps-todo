"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", icon: Home, href: "/dashboard" },
  { name: "Upcoming", icon: Calendar, href: "/dashboard/upcoming" },
  { name: "Tasks", icon: ListTodo, href: "/dashboard" },
  { name: "Profile", icon: User, href: "/onboarding" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 glass-dark border border-white/10 rounded-2xl flex items-center justify-around z-50 px-2 shadow-2xl">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex items-center justify-center p-3 rounded-xl transition-all duration-300",
            pathname === item.href
              ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30"
              : "text-gray-500 hover:text-white",
          )}
        >
          <item.icon size={22} />
        </Link>
      ))}
    </nav>
  );
}
