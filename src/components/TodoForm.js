"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isExpanding, setIsExpanding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, priority });
    setTitle("");
    setIsExpanding(false);
  };

  return (
    <div
      className={cn(
        "glass rounded-2xl transition-all duration-500 overflow-hidden",
        isExpanding
          ? "bg-white/10 shadow-2xl ring-1 ring-primary/20"
          : "bg-white/5 hover:bg-white/10",
      )}
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center gap-2 p-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanding(true)}
            placeholder="Add a new task..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-lg font-semibold placeholder:text-gray-600 text-foreground"
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
          >
            <Send size={20} />
          </button>
        </div>

        <AnimatePresence>
          {isExpanding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-6 border-t border-white/5"
            >
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                    Priority
                  </span>
                  <div className="flex gap-2">
                    {["low", "medium", "high"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          "px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border-2",
                          priority === p
                            ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10"
                            : "bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpanding(false)}
                  className="text-xs font-bold text-gray-600 hover:text-gray-300 transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
