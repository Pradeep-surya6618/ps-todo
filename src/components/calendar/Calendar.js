"use client";

import { useState, useMemo } from "react";
import {
  format,
  addMonths,
  subMonths,
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

export default function Calendar({ events, selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full glass rounded-3xl p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-primary"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-primary"
          >
            <ChevronRight size={20} />
          </button>
        </div>
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

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
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
                relative h-12 flex flex-col items-center justify-center rounded-xl transition-all duration-200
                ${!isCurrentMonth && !isSelected ? "opacity-20" : "opacity-100"}
                ${isSelected ? "bg-primary text-white shadow-lg shadow-primary/30" : "hover:bg-primary/5 text-foreground"}
                ${isToday(day) && !isSelected ? "ring-2 ring-primary/30" : ""}
              `}
            >
              <span className="text-sm font-semibold">{format(day, "d")}</span>

              {/* Event indicators */}
              {hasEvents && (
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
      </div>
    </div>
  );
}
