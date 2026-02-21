"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTodoStore } from "@/store/useTodoStore";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Calendar,
  FileText,
  Activity,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  CloudSun,
  Flame,
  Trophy,
} from "lucide-react";
import { format, isToday, isTomorrow, differenceInDays, addDays } from "date-fns";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const { todos, fetchTodos } = useTodoStore();
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [cycleData, setCycleData] = useState(null);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchTodos();
        const [eventsRes, notesRes, cycleRes, streakRes] =
          await Promise.allSettled([
            fetch("/api/calendar"),
            fetch("/api/notes"),
            fetch("/api/cycle/settings"),
            fetch("/api/user/streak", { method: "POST" }),
          ]);

        if (eventsRes.status === "fulfilled" && eventsRes.value.ok) {
          setEvents(await eventsRes.value.json());
        }
        if (notesRes.status === "fulfilled" && notesRes.value.ok) {
          setNotes(await notesRes.value.json());
        }
        if (cycleRes.status === "fulfilled" && cycleRes.value.ok) {
          const data = await cycleRes.value.json();
          if (data?.periodStartDate) setCycleData(data);
        }
        if (streakRes.status === "fulfilled" && streakRes.value.ok) {
          setStreak(await streakRes.value.json());
        }

        // Log this visit (fire and forget)
        fetch("/api/user/activity", { method: "POST" }).catch(() => {});
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [fetchTodos]);

  // Computed values
  const completedTodos = todos.filter((t) => t.completed).length;
  const pendingTodos = todos.filter((t) => !t.completed).length;
  const highPriorityTodos = todos.filter(
    (t) => t.priority === "high" && !t.completed,
  );

  const todayEvents = events.filter((e) => isToday(new Date(e.date)));
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const recentNotes = notes.slice(0, 3);

  // Cycle info
  const cycleInfo = useMemo(() => {
    if (!cycleData?.periodStartDate) return null;
    const today = new Date();
    const start = new Date(cycleData.periodStartDate);
    const cycleLength = cycleData.cycleLength || 28;
    const periodLength = cycleData.periodLength || 5;
    let daysSince = differenceInDays(today, start);
    if (daysSince < 0) daysSince = 0;
    const currentDay = (daysSince % cycleLength) + 1;
    const nextPeriod = addDays(
      start,
      cycleLength * (Math.floor(daysSince / cycleLength) + 1),
    );
    const daysUntil = differenceInDays(nextPeriod, today);

    let phase = "Follicular";
    if (currentDay <= periodLength) phase = "Menstruation";
    else if (currentDay >= cycleLength - 14 && currentDay <= cycleLength - 10)
      phase = "Ovulation";
    else if (currentDay > cycleLength - 14) phase = "Luteal";

    return { currentDay, cycleLength, phase, daysUntil };
  }, [cycleData]);

  // Greeting
  const hour = new Date().getHours();
  let greeting = "Good morning";
  let GreetIcon = Sun;
  if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
    GreetIcon = CloudSun;
  } else if (hour >= 17) {
    greeting = "Good evening";
    GreetIcon = Moon;
  }

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-4 pb-8 space-y-6">
          {/* Greeting skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-8 w-44 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-3 w-36 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          </div>
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 space-y-3 animate-pulse">
                <div className="w-9 h-9 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
                <div className="space-y-1.5">
                  <div className="h-7 w-12 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-2.5 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-4 space-y-3 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
                  </div>
                  <div className="h-3 w-14 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="space-y-2.5">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center gap-3 p-2">
                      <div className="w-2 h-8 bg-gray-200 dark:bg-zinc-800 rounded-full shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded" />
                        <div className="h-2.5 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Quick actions skeleton */}
          <div className="glass rounded-2xl p-4 animate-pulse">
            <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded mb-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3">
                  <div className="w-9 h-9 bg-gray-200 dark:bg-zinc-800 rounded-lg shrink-0" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
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
      <div className="max-w-4xl mx-auto p-4 pb-8 space-y-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-2 text-primary">
            <GreetIcon size={20} />
            <span className="text-sm font-bold">{greeting}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">
            {firstName}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            {format(new Date(), "EEEE, MMMM do")}
          </p>
        </motion.div>

        {/* Login Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center shrink-0">
            <Flame size={28} className="text-orange-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground">
                {streak.current}
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                day streak
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Trophy size={12} className="text-amber-500" />
              <span className="text-[10px] font-bold text-gray-500">
                Best: {streak.longest} days
              </span>
            </div>
          </div>
          {streak.current >= 3 && (
            <div className="text-right shrink-0">
              <div className="text-lg">
                {streak.current >= 30
                  ? "🏆"
                  : streak.current >= 14
                    ? "🔥"
                    : streak.current >= 7
                      ? "⭐"
                      : "✨"}
              </div>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <QuickStat
            icon={CheckCircle2}
            label="Completed"
            value={completedTodos}
            color="#10b981"
            href="/dashboard"
          />
          <QuickStat
            icon={Circle}
            label="Pending"
            value={pendingTodos}
            color="#f59e0b"
            href="/dashboard"
          />
          <QuickStat
            icon={Calendar}
            label="Events Today"
            value={todayEvents.length}
            color="#3b82f6"
            href="/dashboard/calendar"
          />
          <QuickStat
            icon={FileText}
            label="Notes"
            value={notes.length}
            color="#8b5cf6"
            href="/dashboard/notes"
          />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DashboardCard
              title="Upcoming Events"
              icon={Calendar}
              href="/dashboard/calendar"
              color="#3b82f6"
            >
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-400 font-medium py-4 text-center">
                  No upcoming events
                </p>
              ) : (
                <div className="space-y-2.5">
                  {upcomingEvents.slice(0, 4).map((event) => (
                    <div
                      key={event._id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/3 dark:hover:bg-white/3 transition-colors"
                    >
                      <div
                        className="w-2 h-8 rounded-full shrink-0"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">
                          {event.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {isToday(new Date(event.date))
                            ? "Today"
                            : isTomorrow(new Date(event.date))
                              ? "Tomorrow"
                              : format(new Date(event.date), "MMM d")}{" "}
                          - {format(new Date(event.date), "h:mm a")}
                        </p>
                      </div>
                      <span
                        className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-md shrink-0"
                        style={{
                          color: event.color,
                          backgroundColor: `${event.color}15`,
                        }}
                      >
                        {event.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>
          </motion.div>

          {/* Cycle Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <DashboardCard
              title="Cycle Tracker"
              icon={Activity}
              href="/dashboard/cycle"
              color="#ec4899"
            >
              {cycleInfo ? (
                <div className="space-y-4 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-black text-foreground">
                        Day {cycleInfo.currentDay}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        of {cycleInfo.cycleLength} day cycle
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">
                        {cycleInfo.phase}
                      </p>
                      <p className="text-xs text-gray-400">
                        {cycleInfo.daysUntil > 0
                          ? `${cycleInfo.daysUntil}d until next`
                          : "Period day"}
                      </p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(cycleInfo.currentDay / cycleInfo.cycleLength) * 100}%`,
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 font-medium mb-2">
                    Not configured yet
                  </p>
                  <Link
                    href="/dashboard/cycle"
                    className="text-primary text-sm font-bold"
                  >
                    Set up cycle tracking
                  </Link>
                </div>
              )}
            </DashboardCard>
          </motion.div>

          {/* High Priority Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DashboardCard
              title="Priority Tasks"
              icon={TrendingUp}
              href="/dashboard"
              color="#f59e0b"
            >
              {highPriorityTodos.length === 0 ? (
                <p className="text-sm text-gray-400 font-medium py-4 text-center">
                  No high priority tasks
                </p>
              ) : (
                <div className="space-y-2">
                  {highPriorityTodos.slice(0, 4).map((todo) => (
                    <div
                      key={todo._id}
                      className="flex items-center gap-3 p-2 rounded-xl"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <p className="text-sm font-bold text-foreground truncate flex-1">
                        {todo.title}
                      </p>
                      <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-md text-amber-600 bg-amber-500/10">
                        high
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>
          </motion.div>

          {/* Recent Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <DashboardCard
              title="Recent Notes"
              icon={FileText}
              href="/dashboard/notes"
              color="#8b5cf6"
            >
              {recentNotes.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 font-medium mb-2">
                    No notes yet
                  </p>
                  <Link
                    href="/dashboard/notes"
                    className="text-primary text-sm font-bold"
                  >
                    Create your first note
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentNotes.map((note) => (
                    <div
                      key={note._id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/3 dark:hover:bg-white/3 transition-colors"
                    >
                      <div
                        className="w-2 h-8 rounded-full shrink-0"
                        style={{ backgroundColor: note.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">
                          {note.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium truncate">
                          {note.content || "No content"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-4"
        >
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              {
                label: "New Note",
                icon: FileText,
                href: "/dashboard/notes",
                color: "#8b5cf6",
              },
              {
                label: "Add Event",
                icon: Calendar,
                href: "/dashboard/calendar",
                color: "#3b82f6",
              },
              {
                label: "Log Symptoms",
                icon: Activity,
                href: "/dashboard/cycle",
                color: "#ec4899",
              },
              {
                label: "View Profile",
                icon: Sparkles,
                href: "/dashboard/profile",
                color: "#f59e0b",
              },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-black/3 dark:hover:bg-white/3 transition-colors group"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <action.icon size={16} style={{ color: action.color }} />
                </div>
                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

function QuickStat({ icon: Icon, label, value, color, href }) {
  return (
    <Link
      href={href}
      className="glass rounded-2xl p-4 flex flex-col gap-2 hover:shadow-lg transition-all duration-300 group"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-black text-foreground">{value}</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      </div>
    </Link>
  );
}

function DashboardCard({ title, icon: Icon, href, color, children }) {
  return (
    <div className="glass rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color }} />
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
        </div>
        <Link
          href={href}
          className="text-[10px] font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all"
        >
          View all <ArrowRight size={10} />
        </Link>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
