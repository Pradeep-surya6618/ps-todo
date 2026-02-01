"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Calendar from "@/components/calendar/Calendar";
import EventDialog from "@/components/calendar/EventDialog";
import {
  LayoutGrid,
  List,
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  Clock,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useSnackbar } from "notistack";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleDeleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/calendar/${id}`, { method: "DELETE" });
      if (res.ok) {
        enqueueSnackbar("Event deleted", { variant: "info" });
        fetchEvents();
      }
    } catch (error) {
      enqueueSnackbar("Failed to delete event", { variant: "error" });
    }
  };

  const filteredEvents = events.filter((e) => {
    const eventDate = new Date(e.date);
    return (
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate()
    );
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
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
            className="w-10 h-10 md:w-12 md:h-12 bg-primary text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        </div>

        {/* Calendar Component */}
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

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

          <AnimatePresence>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredEvents.length > 0 ? (
              <motion.div
                key={`${selectedDate.toDateString()}-${viewMode}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 gap-3"
                    : "flex flex-col gap-3"
                }
              >
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event._id}
                    layout
                    className={`
                      relative glass p-4 md:p-5 rounded-2xl group border-l-4 shadow-lg
                      ${viewMode === "grid" ? "h-32 md:h-36 flex flex-col justify-between" : "flex items-center justify-between"}
                    `}
                    style={{ borderLeftColor: event.color }}
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-1.5 md:px-2 py-0.5 rounded-md bg-opacity-10"
                          style={{
                            color: event.color,
                            backgroundColor: `${event.color}1A`,
                          }}
                        >
                          {event.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-foreground text-sm md:text-lg leading-tight truncate">
                        {event.title}
                      </h4>
                      {event.description && viewMode === "list" && (
                        <p className="text-xs md:text-sm text-gray-400 dark:text-gray-400 font-medium truncate">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <div
                      className={`flex gap-1 md:gap-2 shrink-0 ${viewMode === "grid" ? "justify-end mt-1.5" : "ml-3 md:ml-4"}`}
                    >
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setIsDialogOpen(true);
                        }}
                        className="p-1.5 md:p-2.5 hover:bg-primary/10 rounded-lg md:rounded-xl text-gray-500 hover:text-primary transition-all duration-200"
                        title="Edit event"
                      >
                        <Edit2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-1.5 md:p-2.5 hover:bg-red-500/10 rounded-lg md:rounded-xl text-gray-500 hover:text-red-500 transition-all duration-200"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                      </button>
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
      </div>
    </DashboardLayout>
  );
}
