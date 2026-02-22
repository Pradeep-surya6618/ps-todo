"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import CustomDatePicker from "@/components/ui/CustomDatePicker";

export default function CycleEditDialog({
  isOpen,
  onClose,
  initialData,
  onSave,
}) {
  const [formData, setFormData] = useState({
    periodStartDate: "",
    cycleLength: 28,
    periodLength: 5,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        periodStartDate: initialData.periodStartDate
          ? format(initialData.periodStartDate, "yyyy-MM-dd")
          : "",
        cycleLength: initialData.cycleLength || 28,
        periodLength: initialData.periodLength || 5,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      periodStartDate: new Date(formData.periodStartDate + "T00:00:00"),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-background p-6 rounded-3xl shadow-xl z-50 border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Cycle</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-500">
                  Last Period Start
                </label>
                <CustomDatePicker
                  value={formData.periodStartDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, periodStartDate: date }))
                  }
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-500">
                    Cycle Length
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="20"
                      max="45"
                      value={formData.cycleLength}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cycleLength: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border-none ring-1 ring-border focus:ring-2 focus:ring-primary outline-none transition-all text-center font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                      Days
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-500">
                    Period Length
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="2"
                      max="10"
                      value={formData.periodLength}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          periodLength: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border-none ring-1 ring-border focus:ring-2 focus:ring-primary outline-none transition-all text-center font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                      Days
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <Save size={18} />
                Save Changes
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
