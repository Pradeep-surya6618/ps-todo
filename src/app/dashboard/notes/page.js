"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileText } from "lucide-react";

export default function NotesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-6">
          <FileText size={40} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">
          Notes
        </h1>
        <p className="text-gray-500 font-medium max-w-xs">
          Your thoughts and ideas will appear here. Start writing something
          amazing!
        </p>
      </div>
    </DashboardLayout>
  );
}
