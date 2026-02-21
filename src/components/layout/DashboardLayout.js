"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import Header from "./Header";
import MobileDrawer from "./MobileDrawer";
import LogoutConfirmationDialog from "../LogoutConfirmationDialog";
import PullToRefresh from "../PullToRefresh";
import { useNavStore } from "@/store/useNavStore";
import { cn } from "@/lib/utils";
import BodyScrollLock from "../BodyScrollLock";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { isLogoutDialogOpen, setLogoutDialogOpen } = useNavStore();

  const needsOnboarding =
    status === "authenticated" &&
    !session?.user?.isOnboarded &&
    pathname !== "/onboarding";

  const onboardedOnOnboarding =
    status === "authenticated" &&
    session?.user?.isOnboarded &&
    pathname === "/onboarding";

  useEffect(() => {
    if (needsOnboarding) {
      router.replace("/onboarding");
    } else if (onboardedOnOnboarding) {
      router.replace("/dashboard");
    }
  }, [needsOnboarding, onboardedOnOnboarding, router]);

  // Show skeleton while session is loading OR while redirecting to onboarding
  if (status === "loading" || needsOnboarding || onboardedOnOnboarding) {
    return (
      <div className="fixed inset-0 flex bg-background overflow-hidden z-[9999]">
        <BodyScrollLock />
        {/* Sidebar skeleton - desktop only */}
        <div className="hidden md:flex w-64 flex-col border-r border-border p-4 space-y-6 animate-pulse">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-5 w-28 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
          </div>
          <div className="space-y-2">
            {[75, 60, 85, 70, 90].map((w, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <div className="w-5 h-5 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded-lg" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
        {/* Main area skeleton */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header skeleton */}
          <div className="h-16 border-b border-border px-4 md:px-8 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-lg md:hidden" />
              <div className="h-5 w-24 bg-gray-200 dark:bg-zinc-800 rounded-lg md:hidden" />
              <div className="hidden md:block w-9 h-9 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
              <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>
          {/* Content skeleton */}
          <div className="flex-1 p-4 md:p-8 space-y-4 animate-pulse">
            <div className="h-7 w-48 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-zinc-800 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-zinc-800 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-background overflow-hidden">
      <BodyScrollLock />
      <Sidebar />
      <MobileDrawer />

      <main
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-h-0",
          "md:max-w-none w-full",
        )}
      >
        {/* <PullToRefresh /> */}
        <Header />

        <div
          className="flex-1 px-1 py-2 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full overflow-y-auto no-scrollbar min-h-0"
          style={{ overscrollBehavior: "contain", touchAction: "pan-y" }}
        >
          {children}
        </div>

        <BottomNav />
      </main>

      <LogoutConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      />
    </div>
  );
}

export { DashboardLayout };
