"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Type, AlignLeft } from "lucide-react";
import { format } from "date-fns";

export default function EventDialog({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  editingEvent = null,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("note");
  const [color, setColor] = useState("#ff2e63");

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || "");
      setType(editingEvent.type);
      setColor(editingEvent.color);
    } else {
      setTitle("");
      setDescription("");
      setType("note");
      setColor("#ff2e63");
    }
  }, [editingEvent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      type,
      color,
      date: selectedDate,
      _id: editingEvent?._id,
    });
  };

  const types = [
    { id: "note", label: "Note", color: "#ff2e63" },
    { id: "birthday", label: "Birthday", color: "#8b5cf6" },
    { id: "task", label: "Task", color: "#10b981" },
    { id: "other", label: "Other", color: "#f59e0b" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="relative w-full max-w-md bg-card border border-border rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground">
              {editingEvent ? "Edit Event" : "New Event"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary/10 rounded-full text-gray-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-primary uppercase ml-1">
                Event Title
              </label>
              <div className="relative">
                <Type
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  autoFocus
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's happening?"
                  className="w-full h-14 pl-12 pr-4 bg-auth-input-bg border border-auth-input-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-primary uppercase ml-1">
                Description (Optional)
              </label>
              <div className="relative">
                <AlignLeft
                  className="absolute left-4 top-4 text-gray-400"
                  size={18}
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add some details..."
                  className="w-full h-24 pl-12 pr-4 py-4 bg-auth-input-bg border border-auth-input-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-medium resize-none shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-primary uppercase ml-1">
                Event Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {types.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setType(t.id);
                      setColor(t.color);
                    }}
                    className={`
                      flex items-center gap-2 p-3 rounded-2xl border transition-all
                      ${type === t.id ? "bg-primary/10 border-primary" : "bg-card border-border hover:border-primary/30"}
                    `}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    <span
                      className={`text-sm font-bold ${type === t.id ? "text-primary" : "text-gray-500"}`}
                    >
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-2xl text-primary mb-2">
              <CalendarIcon size={18} />
              <span className="text-sm font-black">
                {format(selectedDate, "EEEE, MMMM do, yyyy")}
              </span>
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-primary text-white rounded-2xl font-black text-lg shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {editingEvent ? "Save Changes" : "Create Event"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
