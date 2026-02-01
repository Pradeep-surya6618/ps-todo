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
    <header className="h-16 glass sticky top-0 z-40 border-b border-black/5 dark:border-white/5 px-4 md:px-8 flex items-center justify-between transition-colors duration-500">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Icon */}
        <button
          onClick={toggleMobileDrawer}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl md:hidden text-gray-400"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
            <img
              src="/icons/Moon.jpg"
              alt="SunMoonie"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-foreground font-black tracking-tight">
            SunMoonie.
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-gray-400 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/5 dark:border-white/5 w-64">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent border-none outline-none text-sm font-medium w-full text-foreground placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-gray-400 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </button>

        <div className="h-8 w-px bg-black/5 dark:bg-white/5 hidden md:block" />

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 pl-2 cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-foreground leading-none group-hover:text-primary transition-colors">
              {session?.user?.name}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
            <div className="w-full h-full rounded-[10px] bg-background flex items-center justify-center text-primary font-black">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="profile"
                  className="w-full h-full rounded-[10px] object-cover"
                />
              ) : (
                session?.user?.name?.[0] || "U"
              )}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
