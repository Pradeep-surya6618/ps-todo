"use client";

import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CycleStatusCard from "@/components/cycle/CycleStatusCard";
import CycleCalendar from "@/components/cycle/CycleCalendar";
import CycleEditDialog from "@/components/cycle/CycleEditDialog";
import {
  Plus,
  Wind,
  Thermometer,
  Smile,
  Frown,
  Zap,
  Coffee,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { differenceInDays, addDays } from "date-fns";
import { useSnackbar } from "notistack";

export default function CycleTrackerPage() {
  const { enqueueSnackbar } = useSnackbar();

  // State for Cycle Data
  const [cycleSettings, setCycleSettings] = useState({
    periodStartDate: new Date(), // Default to Today
    cycleLength: 28,
    periodLength: 5,
  });
  const [loading, setLoading] = useState(true);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [logs, setLogs] = useState([]); // Store fetched logs

  // Fetch Data on Mount
  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Settings
        const settingsRes = await fetch("/api/cycle/settings");
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data && data.periodStartDate) {
            setCycleSettings({
              periodStartDate: new Date(data.periodStartDate),
              cycleLength: data.cycleLength || 28,
              periodLength: data.periodLength || 5,
            });
          } else {
            // Fresh account: defaulting to today so UI doesn't break
            setCycleSettings((prev) => ({
              ...prev,
              periodStartDate: new Date(),
            }));
          }
        }

        // 2. Fetch Logs (All for now)
        const logsRes = await fetch("/api/cycle/logs");
        if (logsRes.ok) {
          const data = await logsRes.json();
          setLogs(data);

          // Check if we have logs for TODAY to populate selectedSymptoms
          const todayStr = new Date().toISOString().split("T")[0];
          const todayLog = data.find(
            (log) => log.date.split("T")[0] === todayStr,
          );
          if (todayLog) {
            setSelectedSymptoms(todayLog.symptoms);
          }
        }
      } catch (error) {
        console.error("Failed to fetch cycle data", error);
        enqueueSnackbar("Failed to load data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [enqueueSnackbar]);

  // Derived State: Calculate current day of cycle
  const cycleData = useMemo(() => {
    // If loading, return safe defaults

    const today = new Date();
    // Simple calculation: finding days since period start, modulo cycle length
    let daysSinceStart = differenceInDays(today, cycleSettings.periodStartDate);

    // Normalize if negative (future date) or far past
    if (daysSinceStart < 0) daysSinceStart = 0;

    const currentCycleDay = (daysSinceStart % cycleSettings.cycleLength) + 1;
    const predictedNextStart = addDays(
      cycleSettings.periodStartDate,
      cycleSettings.cycleLength *
        (Math.floor(daysSinceStart / cycleSettings.cycleLength) + 1),
    );

    return {
      currentDay: currentCycleDay,
      totalDays: cycleSettings.cycleLength,
      periodDays: cycleSettings.periodLength,
      periodStartDate: cycleSettings.periodStartDate,
      predictedPeriodStart: predictedNextStart,
    };
  }, [cycleSettings]);

  // Handle saving from Edit Dialog
  const handleSaveSettings = async (newSettings) => {
    try {
      // Merge with current settings to ensure we don't overwrite with partial data
      const mergedSettings = { ...cycleSettings, ...newSettings };

      const res = await fetch("/api/cycle/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedSettings),
      });

      if (res.ok) {
        const savedData = await res.json();
        setCycleSettings({
          ...cycleSettings,
          ...newSettings, // Optimistic update
          periodStartDate: new Date(
            savedData.periodStartDate || newSettings.periodStartDate,
          ),
        });
        enqueueSnackbar("Cycle settings updated!", { variant: "success" });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      enqueueSnackbar("Failed to save settings", { variant: "error" });
    }
  };

  const handleDateClick = async (date) => {
    // Determine if we are just selecting a date to VIEW logs, or changing period start
    // For this app flow, clicking a date on calendar -> Usually means spotting check or changing start date
    // Let's stick to "Change Period Start" behavior for now as per previous req

    const newSettings = { ...cycleSettings, periodStartDate: date };
    // Call same save handler
    handleSaveSettings(newSettings);
  };

  // Symptom Logic
  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleLogSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      enqueueSnackbar("Select symptoms to log first", { variant: "info" });
      return;
    }

    try {
      const today = new Date();
      const res = await fetch("/api/cycle/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today.toISOString(),
          symptoms: selectedSymptoms,
        }),
      });

      if (res.ok) {
        enqueueSnackbar("Symptoms logged successfully!", {
          variant: "success",
        });
        // Update local logs state
        const newLog = await res.json();
        // remove old log for today if exists
        const filteredLogs = logs.filter(
          (l) => l.date.split("T")[0] !== newLog.date.split("T")[0],
        );
        setLogs([...filteredLogs, newLog]);
      } else {
        throw new Error("Failed to log");
      }
    } catch (error) {
      enqueueSnackbar("Failed to log symptoms", { variant: "error" });
    }
  };

  const symptoms = [
    { id: "cramps", icon: Wind, label: "Cramps" },
    { id: "headache", icon: Thermometer, label: "Headache" },
    { id: "happy", icon: Smile, label: "Happy" },
    { id: "moody", icon: Frown, label: "Moody" },
    { id: "energy", icon: Zap, label: "High Energy" },
    { id: "tired", icon: Coffee, label: "Tired" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-md mx-auto w-full pb-8 px-4 md:px-0">
        {/* Header Section */}
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-1xl font-black tracking-tight text-foreground">
            Cycle Tracker
          </h1>
          <button
            onClick={() => setIsEditDialogOpen(true)}
            className="text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
          >
            Edit Cycle
          </button>
        </div>

        {/* Status Card */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CycleStatusCard
            currentDay={cycleData.currentDay}
            totalDays={cycleData.totalDays}
            periodDays={cycleData.periodDays}
          />
        </motion.div>

        {/* Quick Log Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
            Today's Symptoms
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
            <button
              onClick={handleLogSubmit}
              className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 transition-transform active:scale-95">
                <Plus size={24} />
              </div>
              <span className="text-xs font-semibold text-foreground">Log</span>
            </button>
            {symptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className="flex flex-col items-center gap-2 min-w-[70px] group cursor-pointer"
                >
                  <div
                    className={`
                    w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-200 active:scale-95
                    ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-white dark:bg-zinc-900 border-border text-gray-400 group-hover:border-primary/50 group-hover:text-primary"
                    }
                  `}
                  >
                    <symptom.icon size={24} />
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors ${isSelected ? "text-primary font-bold" : "text-gray-500 group-hover:text-foreground"}`}
                  >
                    {symptom.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calendar Section */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CycleCalendar
            periodStartDate={cycleSettings.periodStartDate}
            predictedPeriodStart={cycleData.predictedPeriodStart}
            periodLength={cycleSettings.periodLength}
            onDateClick={handleDateClick}
          />
        </motion.div>

        {/* Insights Teaser */}
        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-5 rounded-3xl border border-indigo-100 dark:border-indigo-900/50">
          <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">
            Cycle Insight
          </h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-400/80 leading-relaxed">
            Based on Day {Math.floor(cycleData.currentDay)}, you might be
            feeling energetic. Good time for new projects!
          </p>
        </div>

        {/* Edit Dialog */}
        <CycleEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          initialData={cycleSettings}
          onSave={handleSaveSettings}
        />
      </div>
    </DashboardLayout>
  );
}
