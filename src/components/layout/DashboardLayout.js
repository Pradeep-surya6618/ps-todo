"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-10 pb-32 md:pb-10 w-full">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
