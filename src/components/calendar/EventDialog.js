"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar as CalendarIcon,
  Type,
  AlignLeft,
  Tag,
  Palette,
} from "lucide-react";
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
  const [customCategory, setCustomCategory] = useState("");

  const standardTypes = ["note", "birthday", "task"];

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || "");
      setColor(editingEvent.color);

      if (standardTypes.includes(editingEvent.type)) {
        setType(editingEvent.type);
        setCustomCategory("");
      } else {
        setType("other");
        setCustomCategory(editingEvent.type);
      }
    } else {
      setTitle("");
      setDescription("");
      setType("note");
      setColor("#ff2e63");
      setCustomCategory("");
    }
  }, [editingEvent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine the final type and color
    const finalType =
      type === "other" ? customCategory.trim() || "Event" : type;

    onSave({
      title,
      description,
      type: finalType,
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-card border border-border rounded-[2rem] sm:rounded-[2.5rem] p-5 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-black text-foreground">
              {editingEvent ? "Edit Event" : "New Event"}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 hover:bg-primary/10 rounded-full text-gray-500 transition-colors"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Title Input */}
            <div className="space-y-1">
              <label className="text-[10px] md:text-xs font-bold text-primary uppercase ml-1">
                Event Title
              </label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-[18px] md:h-[18px]" />
                <input
                  autoFocus
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's happening?"
                  className="w-full h-11 md:h-14 pl-10 md:pl-12 pr-4 bg-auth-input-bg border border-auth-input-border rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary transition-colors text-foreground font-bold text-sm md:text-base dashed-border-0"
                />
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-1">
              <label className="text-[10px] md:text-xs font-bold text-primary uppercase ml-1">
                Description (Optional)
              </label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-3 md:top-4 text-gray-400 w-4 h-4 md:w-[18px] md:h-[18px]" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add some details..."
                  className="w-full h-20 md:h-24 pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-auth-input-bg border border-auth-input-border rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary transition-colors text-foreground font-medium text-sm md:text-base resize-none shadow-sm"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-1">
              <label className="text-[10px] md:text-xs font-bold text-primary uppercase ml-1">
                Event Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {types.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setType(t.id);
                      // Only set standard colors if switching to standard types
                      // If 'other', we might want to keep the current selection or default to orange
                      if (t.id !== "other") {
                        setColor(t.color);
                      } else if (
                        t.id === "other" &&
                        standardTypes.includes(type)
                      ) {
                        // If switching TO other FROM standard, set to the 'other' default
                        setColor(t.color);
                      }
                    }}
                    className={`
                      flex items-center gap-2 p-2.5 md:p-3 rounded-xl md:rounded-2xl border transition-all
                      ${type === t.id ? "bg-primary/10 border-primary" : "bg-card border-border hover:border-primary/30"}
                    `}
                  >
                    <div
                      className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full"
                      style={{
                        backgroundColor: t.id === "other" ? color : t.color,
                      }}
                    />
                    <span
                      className={`text-xs md:text-sm font-bold ${type === t.id ? "text-primary" : "text-gray-500"}`}
                    >
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Category Options (Only if 'other' is selected) */}
            <AnimatePresence>
              {type === "other" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Custom Category Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] md:text-xs font-bold text-primary uppercase ml-1">
                        Category Name
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="e.g. Meeting"
                          className="w-full h-11 pl-10 pr-4 bg-auth-input-bg border border-auth-input-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary transition-colors text-foreground font-bold text-sm"
                        />
                      </div>
                    </div>

                    {/* Custom Color Picker */}
                    <div className="space-y-1">
                      <label className="text-[10px] md:text-xs font-bold text-primary uppercase ml-1">
                        Category Color
                      </label>
                      <div className="relative h-11 bg-auth-input-bg border border-auth-input-border rounded-xl flex items-center px-4 hover:border-primary transition-colors group cursor-pointer">
                        <Palette className="text-gray-400 w-4 h-4 mr-3" />
                        <div className="flex-1 flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm font-medium text-gray-500 uppercase">
                            {color}
                          </span>
                        </div>
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Date Display */}
            <div className="flex items-center gap-2 p-3 md:p-4 bg-primary/5 rounded-xl md:rounded-2xl text-primary mb-2">
              <CalendarIcon className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              <span className="text-xs md:text-sm font-black">
                {format(selectedDate, "EEEE, MMMM do, yyyy")}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 md:h-14 bg-primary text-white rounded-xl md:rounded-2xl font-black text-base md:text-lg shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {editingEvent ? "Save Changes" : "Create Event"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
