"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Activity } from "lucide-react";

export default function CycleTrackerPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-6">
          <Activity size={40} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">
          Cycle Tracker
        </h1>
        <p className="text-gray-500 font-medium max-w-xs">
          Monitor your health and cycle patterns here. Personal insights coming
          your way soon!
        </p>
      </div>
    </DashboardLayout>
  );
}
