"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Calendar from "@/components/calendar/Calendar";
import EventDialog from "@/components/calendar/EventDialog";
import DeleteConfirmationDialog from "@/components/calendar/DeleteConfirmationDialog";
import {
  LayoutGrid,
  List,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Search,
} from "lucide-react";
import {
  format,
  addDays,
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
  isSameDay,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useSnackbar } from "notistack";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    eventId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [calendarMode, setCalendarMode] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/calendar");
      const data = await res.json();
      if (res.ok) setEvents(data);
    } catch (error) {
      enqueueSnackbar("Failed to fetch events", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      const method = eventData._id ? "PUT" : "POST";
      const url = eventData._id
        ? `/api/calendar/${eventData._id}`
        : "/api/calendar";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (res.ok) {
        enqueueSnackbar(
          `Event ${eventData._id ? "updated" : "added"} successfully!`,
          { variant: "success" },
        );
        fetchEvents();
        setIsDialogOpen(false);
        setEditingEvent(null);
      } else {
        const error = await res.json();
        enqueueSnackbar(error.error || "Failed to save event", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred", { variant: "error" });
    }
  };

  const onRequestDelete = (id) => {
    setDeleteConfirmation({ isOpen: true, eventId: id });
  };

  const handleConfirmDelete = async () => {
    const id = deleteConfirmation.eventId;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/calendar/${id}`, { method: "DELETE" });
      if (res.ok) {
        enqueueSnackbar("Event deleted successfully", { variant: "success" });
        fetchEvents();
        setDeleteConfirmation({ isOpen: false, eventId: null });
      }
    } catch (error) {
      enqueueSnackbar("Failed to delete event", { variant: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Upcoming events: next 7 days from today
  const upcomingEvents = useMemo(() => {
    const today = startOfDay(new Date());
    const weekFromNow = endOfDay(addDays(today, 7));

    return events
      .filter((e) => {
        const eventDate = new Date(e.date);
        return (
          (isAfter(eventDate, today) || isSameDay(eventDate, today)) &&
          isBefore(eventDate, weekFromNow)
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [events]);

  // Filtered events: by selected date + search query + type filter
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const eventDate = new Date(e.date);
      const matchesDate =
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getDate() === selectedDate.getDate();

      const matchesSearch =
        searchQuery.trim() === "" ||
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        filterType === "all" ||
        e.type?.toLowerCase() === filterType.toLowerCase();

      return matchesDate && matchesSearch && matchesType;
    });
  }, [events, selectedDate, searchQuery, filterType]);

  const filterTypes = [
    { label: "All", value: "all" },
    { label: "Note", value: "note" },
    { label: "Birthday", value: "birthday" },
    { label: "Task", value: "task" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 pb-8 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-foreground">
              Calendar
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              Manage your schedule
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setEditingEvent(null);
              setIsDialogOpen(true);
            }}
            className="w-10 h-10 md:w-12 md:h-12 bg-primary text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 cursor-pointer"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground font-medium text-sm"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filterTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filterType === type.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-card border border-border text-gray-500 hover:text-foreground hover:border-primary/30"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Calendar Component */}
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          mode={calendarMode}
          onModeChange={setCalendarMode}
        />

        {/* Upcoming Events Widget */}
        {upcomingEvents.length > 0 && (
          <div className="glass rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
              Upcoming (Next 7 Days)
            </h3>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  <div
                    className="w-1 h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {event.title}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400">
                      {format(new Date(event.date), "EEE, MMM d · h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Section Container */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-foreground">
              {format(selectedDate, "MMMM do")}
            </h3>
            <div className="flex bg-card border border-border rounded-xl p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-primary text-white shadow-md" : "text-gray-500"}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-md" : "text-gray-500"}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 gap-3"
                  : "flex flex-col gap-3"
              }>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-3 min-h-[120px] flex flex-col bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 animate-pulse"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-14 bg-gray-200 dark:bg-zinc-700 rounded-md" />
                      <div className="flex gap-1">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-zinc-700 rounded-md" />
                        <div className="w-5 h-5 bg-gray-200 dark:bg-zinc-700 rounded-md" />
                      </div>
                    </div>
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded mb-1.5" />
                    <div className="flex-1 space-y-1.5 mb-2">
                      <div className="h-2.5 w-full bg-gray-200 dark:bg-zinc-700 rounded" />
                      <div className="h-2.5 w-2/3 bg-gray-200 dark:bg-zinc-700 rounded" />
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-zinc-700">
                      <div className="h-2.5 w-16 bg-gray-200 dark:bg-zinc-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <motion.div
                key={`${selectedDate.toDateString()}-${viewMode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 gap-3"
                    : "flex flex-col gap-3"
                }
              >
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event._id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className={`
                      group relative overflow-hidden backdrop-blur-sm
                      rounded-2xl hover:shadow-lg transition-all duration-300
                      p-3 flex flex-col h-auto min-h-[120px]
                    `}
                    style={{
                      backgroundColor: `${event.color}10`,
                      border: `1px solid ${event.color}25`,
                    }}
                  >
                    {/* Row 1: Chip and Actions */}
                    <div className="flex items-center justify-between mb-2 w-full">
                      <span
                        className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md"
                        style={{
                          color: event.color,
                          backgroundColor: `${event.color}20`,
                          border: `1px solid ${event.color}30`,
                        }}
                      >
                        {event.type}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEvent(event);
                            setIsDialogOpen(true);
                          }}
                          className="p-1 hover:bg-black/5 rounded-md text-gray-400 hover:text-foreground transition-colors cursor-pointer"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestDelete(event._id);
                          }}
                          className="p-1 hover:bg-red-500/10 rounded-md text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Row 2: Title */}
                    <h4 className="font-bold text-sm text-foreground leading-tight line-clamp-2 mb-1 w-full">
                      {event.title}
                    </h4>

                    {/* Row 3: Description */}
                    <div className="flex-1 min-h-0 w-full mb-1">
                      {event.description ? (
                        <p className="text-[10px] text-muted-foreground font-medium line-clamp-2 leading-relaxed opacity-80">
                          {event.description}
                        </p>
                      ) : null}
                    </div>

                    {/* Row 4: Date */}
                    <div className="pt-2 border-t border-black/5 flex items-center mt-auto w-full">
                      <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 opacity-80">
                        <Clock size={10} />
                        {format(new Date(event.date), "h:mm a")}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass p-8 rounded-[2rem] text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                  <Clock size={32} />
                </div>
                <p className="text-gray-500 font-medium">No events scheduled</p>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-4 text-primary font-black text-sm"
                >
                  + Add Something
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dialog */}
        <EventDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
          selectedDate={selectedDate}
          editingEvent={editingEvent}
        />

        <DeleteConfirmationDialog
          isOpen={deleteConfirmation.isOpen}
          onClose={() =>
            setDeleteConfirmation({ isOpen: false, eventId: null })
          }
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
}
