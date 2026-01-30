"use client";

import { Check, Trash2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const priorityColors = {
  high: "from-pink-500/20 to-rose-500/20 border-pink-500/30 text-rose-500",
  medium:
    "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-500",
  low: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-500",
};

const priorityGlow = {
  high: "shadow-pink-500/10",
  medium: "shadow-purple-500/10",
  low: "shadow-emerald-500/10",
};

export function TodoCard({ todo, onToggle, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "glass bento-card flex items-center gap-4 bg-gradient-to-br border shadow-lg group relative overflow-hidden",
        priorityColors[todo.priority],
        priorityGlow[todo.priority],
        todo.completed && "opacity-60 saturate-50",
      )}
    >
      <div
        onClick={() => onToggle(todo._id)}
        className={cn(
          "w-8 h-8 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all duration-300",
          todo.completed
            ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/40"
            : "border-white/20 hover:border-primary/50 text-transparent",
        )}
      >
        <motion.div
          initial={false}
          animate={{ scale: todo.completed ? 1 : 0 }}
          className="flex items-center justify-center"
        >
          <Check size={18} strokeWidth={3} />
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <h3
          className={cn(
            "font-bold text-lg leading-tight truncate transition-all duration-300",
            todo.completed ? "line-through text-gray-400" : "text-gray-200",
          )}
        >
          {todo.title}
        </h3>
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider opacity-60">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {new Date(todo.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1 capitalize">
            {todo.priority === "high" && (
              <AlertCircle size={12} className="text-red-400" />
            )}
            {todo.priority} priority
          </span>
        </div>
      </div>

      <button
        onClick={() => onDelete(todo._id)}
        className="p-2.5 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/20 hover:text-red-400 text-gray-400"
      >
        <Trash2 size={20} />
      </button>

      {/* Glossy highlight effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}
