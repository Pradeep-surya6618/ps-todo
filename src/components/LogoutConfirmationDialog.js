"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useSnackbar } from "notistack";
import { LogOut, X, Check } from "lucide-react";

export default function LogoutConfirmationDialog({ isOpen, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    enqueueSnackbar("Logged out successfully", {
      variant: "success",
    });
    window.location.href = "/login";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-background border border-black/10 dark:border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/10 blur-[40px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2 text-red-500">
            <LogOut size={32} />
          </div>

          <h3 className="text-xl font-bold text-foreground">Log Out?</h3>

          <p className="text-sm text-gray-500 font-medium">
            Are you sure you want to sign out of your cosmic session?
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isLoggingOut}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-white/5 text-foreground font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingOut ? (
                "Signing out..."
              ) : (
                <>
                  <LogOut size={18} />
                  Log Out
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
