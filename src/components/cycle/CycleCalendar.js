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
  isWithinInterval,
  addDays,
} from "date-fns";
import { ChevronLeft, ChevronRight, Droplets } from "lucide-react";
import { motion } from "framer-motion";

export default function CycleCalendar({
  periodStartDate,
  predictedPeriodStart,
  periodLength = 5,
  onDateClick,
  logs = [],
}) {
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

  const isPeriodDay = (day) => {
    if (!periodStartDate) return false;
    const start = new Date(periodStartDate);
    const end = addDays(start, periodLength - 1);
    return isWithinInterval(day, { start, end });
  };

  const isPredictedPeriodDay = (day) => {
    if (!predictedPeriodStart) return false;
    const start = new Date(predictedPeriodStart);
    const end = addDays(start, periodLength - 1);
    return isWithinInterval(day, { start, end });
  };

  return (
    <div className="w-full glass rounded-3xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-foreground cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-foreground cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* WeekDays */}
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isPeriod = isPeriodDay(day);
          const isPredicted = isPredictedPeriodDay(day);
          const isTodayDate = isToday(day);
          const dayLog = logs.find((log) =>
            isSameDay(new Date(log.date), day),
          );
          const hasMood = dayLog?.mood;
          const hasFlow = dayLog?.flowIntensity;
          const hasSymptoms =
            dayLog?.symptoms && dayLog.symptoms.length > 0;

          return (
            <div
              key={day.toString()}
              className="flex flex-col items-center justify-center relative h-12 w-full"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onDateClick && onDateClick(day)}
                className={`
                  relative h-9 w-9 flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer
                  ${!isCurrentMonth ? "opacity-20 text-gray-500" : "text-foreground"}
                  ${isPeriod ? "bg-rose-500 text-white shadow-md shadow-rose-500/30" : ""}
                  ${!isPeriod && isPredicted ? "border-2 border-rose-300 text-rose-500 border-dashed" : ""}
                  ${!isPeriod && !isPredicted && isTodayDate ? "bg-black text-white dark:bg-white dark:text-black" : ""}
                  ${!isPeriod && !isPredicted && !isTodayDate ? "hover:bg-gray-100 dark:hover:bg-zinc-800" : ""}
                `}
              >
                {format(day, "d")}

                {/* Period Droplet Indicator for active period days */}
                {isPeriod && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1"
                  >
                    {/* Optional: Tiny dot or icon could go here, but background color is strong enough */}
                  </motion.div>
                )}
              </motion.button>

              {/* Markers below date */}
              <div className="h-1.5 mt-0.5 flex gap-0.5 items-center justify-center">
                {hasMood && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                )}
                {hasFlow && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                )}
                {hasSymptoms && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <span className="text-xs text-muted-foreground font-medium">
            Period
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2 border-rose-300 border-dashed"></div>
          <span className="text-xs text-muted-foreground font-medium">
            Predicted
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <span className="text-xs text-muted-foreground font-medium">
            Mood
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
          <span className="text-xs text-muted-foreground font-medium">
            Symptoms
          </span>
        </div>
      </div>
    </div>
  );
}
