"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNotificationStore } from "@/store/useNotificationStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Info,
  CheckCircle2,
  AlertTriangle,
  Settings,
} from "lucide-react";

const typeConfig = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
  success: {
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  system: { icon: Settings, color: "text-purple-500", bg: "bg-purple-500/10" },
};

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function NotificationsContent() {
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllRead,
    deleteNotification,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">
            Notifications
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        )}
      </motion.div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-2.5 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl p-12 text-center"
        >
          <BellOff size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-1">
            No notifications yet
          </h3>
          <p className="text-sm text-gray-500">
            We'll notify you about important updates and milestones
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {notifications.map((notification, i) => {
              const config = typeConfig[notification.type] || typeConfig.info;
              const TypeIcon = config.icon;

              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => {
                    if (!notification.isRead) markAsRead(notification._id);
                  }}
                  className={cn(
                    "bg-card border rounded-2xl p-4 flex items-start gap-4 transition-all cursor-pointer group",
                    notification.isRead
                      ? "border-border opacity-70"
                      : "border-primary/20 bg-primary/[0.02]",
                  )}
                >
                  <div
                    className={cn(
                      "p-2.5 rounded-xl shrink-0",
                      config.bg,
                      config.color,
                    )}
                  >
                    <TypeIcon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={cn(
                          "text-sm font-bold truncate",
                          notification.isRead
                            ? "text-gray-500"
                            : "text-foreground",
                        )}
                      >
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_6px_0_rgba(236,72,153,0.6)]" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification._id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <NotificationsContent />
    </DashboardLayout>
  );
}
