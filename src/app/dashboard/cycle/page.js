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
  Droplets,
  Heart,
  Moon,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { differenceInDays, addDays, subMonths, format } from "date-fns";
import { useSnackbar } from "notistack";

const symptoms = [
  { id: "cramps", icon: Wind, label: "Cramps", color: "#ef4444" },
  { id: "headache", icon: Thermometer, label: "Headache", color: "#f97316" },
  { id: "happy", icon: Smile, label: "Happy", color: "#10b981" },
  { id: "moody", icon: Frown, label: "Moody", color: "#8b5cf6" },
  { id: "energy", icon: Zap, label: "Energy", color: "#f59e0b" },
  { id: "tired", icon: Coffee, label: "Tired", color: "#6b7280" },
  { id: "bloating", icon: Droplets, label: "Bloating", color: "#3b82f6" },
  { id: "cravings", icon: Heart, label: "Cravings", color: "#ec4899" },
];

const moods = [
  { id: "great", emoji: "😊", label: "Great", color: "#10b981" },
  { id: "good", emoji: "🙂", label: "Good", color: "#3b82f6" },
  { id: "okay", emoji: "😐", label: "Okay", color: "#f59e0b" },
  { id: "bad", emoji: "😔", label: "Bad", color: "#f97316" },
  { id: "awful", emoji: "😫", label: "Awful", color: "#ef4444" },
];

const flows = [
  { id: "spot", label: "Spotting", color: "#fca5a5", drops: 1 },
  { id: "light", label: "Light", color: "#f87171", drops: 1 },
  { id: "medium", label: "Medium", color: "#ef4444", drops: 2 },
  { id: "heavy", label: "Heavy", color: "#dc2626", drops: 3 },
];

export default function CycleTrackerPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [cycleSettings, setCycleSettings] = useState({
    periodStartDate: new Date(),
    cycleLength: 28,
    periodLength: 5,
  });
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [flowIntensity, setFlowIntensity] = useState("");
  const [dailyNote, setDailyNote] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const settingsRes = await fetch("/api/cycle/settings");
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data && data.periodStartDate) {
            setCycleSettings({
              periodStartDate: new Date(data.periodStartDate),
              cycleLength: data.cycleLength || 28,
              periodLength: data.periodLength || 5,
            });
          }
        }

        const logsRes = await fetch("/api/cycle/logs");
        if (logsRes.ok) {
          const data = await logsRes.json();
          setLogs(data);

          const todayStr = new Date().toISOString().split("T")[0];
          const todayLog = data.find(
            (log) => log.date.split("T")[0] === todayStr,
          );
          if (todayLog) {
            setSelectedSymptoms(todayLog.symptoms || []);
            setSelectedMood(todayLog.mood || "");
            setFlowIntensity(todayLog.flowIntensity || "");
            setDailyNote(todayLog.note || "");
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

  const cycleData = useMemo(() => {
    const today = new Date();
    let daysSinceStart = differenceInDays(
      today,
      cycleSettings.periodStartDate,
    );
    if (daysSinceStart < 0) daysSinceStart = 0;

    const currentCycleDay = (daysSinceStart % cycleSettings.cycleLength) + 1;
    const predictedNextStart = addDays(
      cycleSettings.periodStartDate,
      cycleSettings.cycleLength *
        (Math.floor(daysSinceStart / cycleSettings.cycleLength) + 1),
    );
    const daysUntilNext = differenceInDays(predictedNextStart, today);
    const ovulationDay = cycleSettings.cycleLength - 14;
    const fertileStart = ovulationDay - 3;
    const fertileEnd = ovulationDay + 1;
    const isFertile =
      currentCycleDay >= fertileStart && currentCycleDay <= fertileEnd;

    return {
      currentDay: currentCycleDay,
      totalDays: cycleSettings.cycleLength,
      periodDays: cycleSettings.periodLength,
      periodStartDate: cycleSettings.periodStartDate,
      predictedPeriodStart: predictedNextStart,
      daysUntilNext,
      ovulationDay,
      isFertile,
    };
  }, [cycleSettings]);

  // Dynamic phase-based insights
  const insight = useMemo(() => {
    const day = cycleData.currentDay;
    const periodDays = cycleData.periodDays;
    const ovDay = cycleData.totalDays - 14;

    if (day <= periodDays) {
      return {
        title: "Menstruation Phase",
        icon: Droplets,
        color: "#ef4444",
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-100 dark:border-red-900/50",
        textColor: "text-red-900 dark:text-red-300",
        subColor: "text-red-700 dark:text-red-400/80",
        tips: [
          "Rest and hydrate well",
          "Warm compresses can help with cramps",
          "Iron-rich foods like spinach are beneficial",
          "Light walks or yoga can ease discomfort",
        ],
      };
    } else if (day <= ovDay - 3) {
      return {
        title: "Follicular Phase",
        icon: TrendingUp,
        color: "#10b981",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-100 dark:border-emerald-900/50",
        textColor: "text-emerald-900 dark:text-emerald-300",
        subColor: "text-emerald-700 dark:text-emerald-400/80",
        tips: [
          "Energy levels are rising - great for new projects",
          "Best time for intense workouts",
          "Creativity is at its peak",
          "Social activities will feel more enjoyable",
        ],
      };
    } else if (day >= ovDay - 3 && day <= ovDay + 1) {
      return {
        title: "Ovulation Window",
        icon: Zap,
        color: "#f59e0b",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-100 dark:border-amber-900/50",
        textColor: "text-amber-900 dark:text-amber-300",
        subColor: "text-amber-700 dark:text-amber-400/80",
        tips: [
          "Peak energy and confidence",
          "Highest fertility window",
          "Great time for important meetings",
          "Your skin may look extra glowy",
        ],
      };
    } else {
      return {
        title: "Luteal Phase",
        icon: Moon,
        color: "#8b5cf6",
        bg: "bg-violet-50 dark:bg-violet-950/30",
        border: "border-violet-100 dark:border-violet-900/50",
        textColor: "text-violet-900 dark:text-violet-300",
        subColor: "text-violet-700 dark:text-violet-400/80",
        tips: [
          "Be gentle with yourself",
          "Magnesium-rich foods can help with PMS",
          "Gentle exercise like yoga is ideal",
          "Prioritize sleep and relaxation",
        ],
      };
    }
  }, [cycleData]);

  // Symptom analytics
  const symptomStats = useMemo(() => {
    if (logs.length === 0) return null;
    const counts = {};
    symptoms.forEach((s) => (counts[s.id] = 0));
    logs.forEach((log) => {
      log.symptoms?.forEach((s) => {
        if (counts[s] !== undefined) counts[s]++;
      });
    });
    const sorted = Object.entries(counts)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a);
    return sorted.length > 0 ? sorted : null;
  }, [logs]);

  const monthlyTrends = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 2; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthLabel = format(monthDate, "MMM");
      const monthYear = format(monthDate, "yyyy-MM");
      const count = logs.filter(
        (log) => log.date.substring(0, 7) === monthYear,
      ).length;
      months.push({ label: monthLabel, count });
    }
    return months;
  }, [logs]);

  const handleSaveSettings = async (newSettings) => {
    try {
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
          ...newSettings,
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
    handleSaveSettings({ ...cycleSettings, periodStartDate: date });
  };

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleLogSubmit = async () => {
    if (
      selectedSymptoms.length === 0 &&
      !selectedMood &&
      !flowIntensity &&
      !dailyNote.trim()
    ) {
      enqueueSnackbar("Add at least one entry to log", { variant: "info" });
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/cycle/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString(),
          symptoms: selectedSymptoms,
          mood: selectedMood,
          flowIntensity,
          note: dailyNote,
        }),
      });
      if (res.ok) {
        enqueueSnackbar("Daily log saved!", { variant: "success" });
        const newLog = await res.json();
        const filteredLogs = logs.filter(
          (l) => l.date.split("T")[0] !== newLog.date.split("T")[0],
        );
        setLogs([...filteredLogs, newLog]);
      } else {
        throw new Error("Failed to log");
      }
    } catch (error) {
      enqueueSnackbar("Failed to save log", { variant: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 max-w-md mx-auto w-full pb-8 px-4 md:px-0">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mt-2">
            <div className="space-y-1.5">
              <div className="h-6 w-36 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          </div>
          {/* Status card skeleton */}
          <div className="w-full rounded-3xl p-6 bg-gray-200 dark:bg-zinc-800 animate-pulse">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-3 w-24 bg-gray-300 dark:bg-zinc-700 rounded" />
              <div className="w-48 h-48 rounded-full border-[6px] border-gray-300 dark:border-zinc-700 flex items-center justify-center">
                <div className="space-y-2 flex flex-col items-center">
                  <div className="h-3 w-8 bg-gray-300 dark:bg-zinc-700 rounded" />
                  <div className="h-14 w-16 bg-gray-300 dark:bg-zinc-700 rounded-lg" />
                  <div className="h-3 w-10 bg-gray-300 dark:bg-zinc-700 rounded" />
                </div>
              </div>
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="h-5 w-32 bg-gray-300 dark:bg-zinc-700 rounded-lg" />
                <div className="h-3 w-40 bg-gray-300 dark:bg-zinc-700 rounded" />
              </div>
            </div>
          </div>
          {/* Quick stats skeleton */}
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-3 text-center animate-pulse">
                <div className="h-5 w-8 bg-gray-200 dark:bg-zinc-800 rounded mx-auto mb-1" />
                <div className="h-2.5 w-14 bg-gray-200 dark:bg-zinc-800 rounded mx-auto" />
              </div>
            ))}
          </div>
          {/* Symptoms skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse ml-1" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-2 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
                  <div className="h-2.5 w-10 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
            <div className="w-full h-11 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
          </div>
          {/* Insights skeleton */}
          <div className="rounded-3xl p-5 bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 bg-gray-200 dark:bg-zinc-700 rounded" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-700 rounded-lg" />
            </div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full shrink-0" />
                  <div className="h-3 w-full bg-gray-200 dark:bg-zinc-700 rounded" style={{ width: `${75 - i * 10}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-md mx-auto w-full pb-8 px-4 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-xl font-black tracking-tight text-foreground">
              Cycle Tracker
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Day {cycleData.currentDay} of {cycleData.totalDays}
            </p>
          </div>
          <button
            onClick={() => setIsEditDialogOpen(true)}
            className="text-primary text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
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

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-2"
        >
          <div className="glass rounded-2xl p-3 text-center">
            <p className="text-lg font-black text-foreground">
              {cycleData.daysUntilNext}
            </p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Days Until
            </p>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <p className="text-lg font-black text-foreground">
              {cycleData.ovulationDay}
            </p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Ovulation Day
            </p>
          </div>
          <div
            className={`glass rounded-2xl p-3 text-center ${cycleData.isFertile ? "ring-2 ring-amber-400/50" : ""}`}
          >
            <p
              className={`text-lg font-black ${cycleData.isFertile ? "text-amber-500" : "text-foreground"}`}
            >
              {cycleData.isFertile ? "Yes" : "No"}
            </p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              Fertile
            </p>
          </div>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
            Today&apos;s Mood
          </h3>
          <div className="flex gap-2">
            {moods.map((mood) => {
              const isSelected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  onClick={() =>
                    setSelectedMood((prev) =>
                      prev === mood.id ? "" : mood.id,
                    )
                  }
                  className="flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer"
                  style={{
                    backgroundColor: isSelected
                      ? `${mood.color}20`
                      : "transparent",
                    border: isSelected
                      ? `2px solid ${mood.color}`
                      : "2px solid transparent",
                  }}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <span
                    className={`text-[9px] font-bold ${isSelected ? "font-black" : "text-gray-500"}`}
                    style={isSelected ? { color: mood.color } : {}}
                  >
                    {mood.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Flow Intensity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
            Flow Intensity
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {flows.map((flow) => {
              const isSelected = flowIntensity === flow.id;
              return (
                <button
                  key={flow.id}
                  onClick={() =>
                    setFlowIntensity((prev) =>
                      prev === flow.id ? "" : flow.id,
                    )
                  }
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all cursor-pointer"
                  style={{
                    backgroundColor: isSelected
                      ? `${flow.color}25`
                      : "transparent",
                    border: isSelected
                      ? `2px solid ${flow.color}`
                      : "2px solid transparent",
                  }}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    {[...Array(flow.drops)].map((_, i) => (
                      <Droplets
                        key={i}
                        size={14}
                        style={{
                          color: isSelected ? flow.color : "#9ca3af",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[9px] font-bold ${isSelected ? "font-black" : "text-gray-500"}`}
                    style={isSelected ? { color: flow.color } : {}}
                  >
                    {flow.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Symptom Logger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
            Today&apos;s Symptoms
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {symptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all cursor-pointer group"
                  style={{
                    backgroundColor: isSelected
                      ? `${symptom.color}15`
                      : "transparent",
                    border: isSelected
                      ? `1px solid ${symptom.color}30`
                      : "1px solid transparent",
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "shadow-md scale-105"
                        : "bg-gray-100 dark:bg-zinc-800 group-hover:scale-105"
                    }`}
                    style={
                      isSelected
                        ? { backgroundColor: symptom.color, color: "white" }
                        : {}
                    }
                  >
                    <symptom.icon
                      size={18}
                      className={isSelected ? "" : "text-gray-400"}
                    />
                  </div>
                  <span
                    className={`text-[9px] font-bold transition-colors ${isSelected ? "font-black" : "text-gray-500"}`}
                    style={isSelected ? { color: symptom.color } : {}}
                  >
                    {symptom.label}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Daily Note */}
          <div className="space-y-1.5">
            <textarea
              value={dailyNote}
              onChange={(e) => setDailyNote(e.target.value)}
              placeholder="How are you feeling today?"
              maxLength={500}
              rows={3}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-sm text-foreground placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            <p className="text-[10px] text-gray-400 text-right font-medium">
              {dailyNote.length}/500
            </p>
          </div>

          <button
            onClick={handleLogSubmit}
            disabled={
              isSaving ||
              (selectedSymptoms.length === 0 &&
                !selectedMood &&
                !flowIntensity &&
                !dailyNote.trim())
            }
            className="w-full h-11 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Plus size={16} />
            )}
            Log Today
          </button>
        </motion.div>

        {/* Calendar */}
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
            logs={logs}
          />
        </motion.div>

        {/* Dynamic Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`${insight.bg} p-5 rounded-3xl border ${insight.border}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <insight.icon size={18} style={{ color: insight.color }} />
            <h3 className={`font-bold ${insight.textColor}`}>
              {insight.title}
            </h3>
          </div>
          <ul className="space-y-2">
            {insight.tips.map((tip, i) => (
              <li
                key={i}
                className={`text-sm ${insight.subColor} leading-relaxed flex items-start gap-2`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: insight.color }}
                />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Symptom Analytics */}
        {symptomStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-3xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                Symptom History
              </h3>
            </div>
            <div className="space-y-3">
              {symptomStats.slice(0, 5).map(([symptomId, count]) => {
                const symptom = symptoms.find((s) => s.id === symptomId);
                if (!symptom) return null;
                const maxCount = symptomStats[0][1];
                const percentage = (count / maxCount) * 100;

                return (
                  <div key={symptomId} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <symptom.icon
                          size={14}
                          style={{ color: symptom.color }}
                        />
                        <span className="text-xs font-bold text-foreground">
                          {symptom.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">
                        {count} {count === 1 ? "day" : "days"}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: symptom.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-3">
              Based on {logs.length} logged{" "}
              {logs.length === 1 ? "day" : "days"}
            </p>
          </motion.div>
        )}

        {/* Monthly Trends */}
        {logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass rounded-3xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                Monthly Trends
              </h3>
            </div>
            <div className="flex items-end justify-around gap-4 h-40">
              {monthlyTrends.map((month) => {
                const maxCount = Math.max(
                  ...monthlyTrends.map((m) => m.count),
                  1,
                );
                const heightPercent = (month.count / maxCount) * 100;
                return (
                  <div
                    key={month.label}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <span className="text-xs font-bold text-foreground">
                      {month.count}
                    </span>
                    <div className="w-full flex items-end justify-center h-24">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{
                          height: `${heightPercent}%`,
                        }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-10 rounded-t-lg bg-primary/80"
                        style={{ minHeight: month.count > 0 ? 8 : 0 }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {month.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-3 text-center">
              Logs per month over the last 3 months
            </p>
          </motion.div>
        )}

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
