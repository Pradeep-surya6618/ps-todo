"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const containerRef = useRef(null);

  // Initialize state from value prop
  useEffect(() => {
    if (value) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
        setCurrentDate(parsedDate);
      }
    }
  }, [value]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeMonth = (increment) => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + increment, 1),
    );
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    setSelectedDate(newDate);
    onChange(formattedDate);
    setIsOpen(false);
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(
    currentDate.getMonth(),
    currentDate.getFullYear(),
  );
  const firstDay = getFirstDayOfMonth(
    currentDate.getMonth(),
    currentDate.getFullYear(),
  );
  const days = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          readOnly
          value={value || ""}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder}
          className="w-full bg-gray-50 dark:bg-zinc-800 border-none ring-1 ring-border rounded-xl px-4 py-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
        >
          <Calendar size={18} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[280px] bg-background border border-border rounded-2xl shadow-xl z-[100] animate-in fade-in zoom-in-95 duration-200 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-primary/10 rounded-full cursor-pointer transition-colors"
            >
              <ChevronDown className="rotate-90 text-foreground" size={20} />
            </button>
            <h4 className="font-bold text-foreground text-sm">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h4>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-primary/10 rounded-full cursor-pointer transition-colors"
            >
              <ChevronDown className="-rotate-90 text-foreground" size={20} />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="text-center text-xs text-muted-foreground font-bold py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div key={i} className="aspect-square">
                {day && (
                  <button
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={cn(
                      "w-full h-full rounded-full text-xs font-medium flex items-center justify-center transition-all cursor-pointer",
                      selectedDate?.getDate() === day &&
                        selectedDate?.getMonth() === currentDate.getMonth() &&
                        selectedDate?.getFullYear() ===
                          currentDate.getFullYear()
                        ? "bg-primary text-white shadow-md shadow-primary/30"
                        : "text-foreground hover:bg-primary/10",
                    )}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
