"use client";

import Link from "next/link";
import { Menu, Bell, Search } from "lucide-react";
import { useNavStore } from "@/store/useNavStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession } from "next-auth/react";

export default function Header() {
  const { toggleMobileDrawer } = useNavStore();
  const { data: session } = useSession();

  return (
    <header className="h-16 glass sticky top-0 z-40 border-b border-border shadow-sm px-4 md:px-8 flex items-center justify-between transition-colors duration-500">
      <div
        className="flex items-center gap-3 md:hidden cursor-pointer"
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

      <div className="flex items-center justify-end ml-auto gap-3">
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
            <div className="w-full h-full rounded-[10px] bg-background flex items-center justify-center text-primary font-black overflow-hidden">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm">
                  {session?.user?.name?.[0] || "U"}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
