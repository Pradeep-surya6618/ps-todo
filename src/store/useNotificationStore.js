import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        set({
          notifications: data.notifications,
          unreadCount: data.unreadCount,
        });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (res.ok) {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n._id === id ? { ...n, isRead: true } : n,
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  markAllRead: async () => {
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });
      if (res.ok) {
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            isRead: true,
          })),
          unreadCount: 0,
        }));
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  },

  deleteNotification: async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        set((state) => {
          const removed = state.notifications.find((n) => n._id === id);
          return {
            notifications: state.notifications.filter((n) => n._id !== id),
            unreadCount:
              removed && !removed.isRead
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
          };
        });
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  },
}));
