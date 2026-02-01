"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-6">
          <CalendarIcon size={40} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">
          Calendar
        </h1>
        <p className="text-gray-500 font-medium max-w-xs">
          Keep track of your important dates and events here. Your schedule is
          looking clear!
        </p>
      </div>
    </DashboardLayout>
  );
}
