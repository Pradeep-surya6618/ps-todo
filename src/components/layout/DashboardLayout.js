"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import Header from "./Header";
import MobileDrawer from "./MobileDrawer";
import LogoutConfirmationDialog from "../LogoutConfirmationDialog";
import { useNavStore } from "@/store/useNavStore";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { isLogoutDialogOpen, setLogoutDialogOpen } = useNavStore();

  useEffect(() => {
    if (status === "authenticated") {
      // If user is not onboarded and not already on onboarding page, redirect
      if (!session?.user?.isOnboarded && pathname !== "/onboarding") {
        router.push("/onboarding");
      }
      // If user IS onboarded and tries to go to onboarding, redirect back to dashboard
      else if (session?.user?.isOnboarded && pathname === "/onboarding") {
        router.push("/dashboard");
      }
    }
  }, [session, status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      <MobileDrawer />

      <main
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-h-screen",
          "md:max-w-none w-full",
        )}
      >
        <Header />

        <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
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
