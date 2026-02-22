"use client";

import { useState, useMemo } from "react";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Calendar({
  events,
  selectedDate,
  onDateSelect,
  mode = "month",
  onModeChange,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    if (mode === "week") {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
  }, [currentMonth, mode, selectedDate]);

  const nextPeriod = () => {
    if (mode === "week") {
      onDateSelect(addWeeks(selectedDate, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const prevPeriod = () => {
    if (mode === "week") {
      onDateSelect(subWeeks(selectedDate, 1));
    } else {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      prevPeriod();
    } else if (info.offset.x < -100) {
      nextPeriod();
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full glass rounded-3xl p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button
              onClick={prevPeriod}
              className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-primary"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextPeriod}
              className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-primary"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Month/Week Toggle */}
          {onModeChange && (
            <div className="flex bg-card border border-border rounded-xl p-1">
              <button
                onClick={() => onModeChange("month")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  mode === "month"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-500 hover:text-foreground"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => onModeChange("week")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  mode === "week"
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-500 hover:text-foreground"
                }`}
              >
                Week
              </button>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-foreground">
          {mode === "week"
            ? `${format(startOfWeek(selectedDate), "MMM d")} - ${format(endOfWeek(selectedDate), "MMM d, yyyy")}`
            : format(currentMonth, "MMMM yyyy")}
        </h2>
      </div>

      {/* WeekDays */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid with Swipe Navigation */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="grid grid-cols-7 gap-1"
      >
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth =
            mode === "week" ? true : isSameMonth(day, currentMonth);
          const hasEvents = events.some((e) =>
            isSameDay(new Date(e.date), day),
          );
          const dayEvents = events.filter((e) =>
            isSameDay(new Date(e.date), day),
          );

          return (
            <motion.button
              key={day.toString()}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(day)}
              className={`
                relative flex flex-col items-center justify-start rounded-xl transition-all duration-200
                ${mode === "week" ? "min-h-[100px] p-2" : "h-12 justify-center"}
                ${!isCurrentMonth && !isSelected ? "opacity-20" : "opacity-100"}
                ${isSelected ? "bg-primary text-white shadow-lg shadow-primary/30" : "hover:bg-primary/5 text-foreground"}
                ${isToday(day) && !isSelected ? "ring-2 ring-primary/30" : ""}
              `}
            >
              <span className="text-sm font-semibold">{format(day, "d")}</span>

              {/* Week view: show event title previews */}
              {mode === "week" && dayEvents.length > 0 && (
                <div className="w-full mt-1 space-y-0.5 overflow-hidden">
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <div
                      key={event._id || i}
                      className={`text-[9px] font-medium leading-tight truncate w-full rounded px-1 py-0.5 ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "text-foreground"
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? undefined
                          : `${event.color}20`,
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <span
                      className={`text-[8px] font-bold ${
                        isSelected ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      +{dayEvents.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Month view: dot indicators */}
              {mode === "month" && hasEvents && (
                <div className="flex gap-0.5 mt-1">
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <div
                      key={event._id || i}
                      className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : ""}`}
                      style={{
                        backgroundColor: isSelected ? "white" : event.color,
                      }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div
                      className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-gray-400"}`}
                    />
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
