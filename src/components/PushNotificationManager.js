"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [permissionState, setPermissionState] = useState("default");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      setPermissionState(Notification.permission);
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
        });
      });
    }
  }, []);

  async function subscribe() {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        ),
      });
      setSubscription(sub);
      setPermissionState(Notification.permission);

      const serialized = JSON.parse(JSON.stringify(sub));
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serialized),
      });
    } catch (err) {
      console.error("Push subscription failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function unsubscribe() {
    setIsLoading(true);
    try {
      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        setSubscription(null);
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });
      }
    } catch (err) {
      console.error("Push unsubscribe failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isSupported) return null;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={subscription ? unsubscribe : subscribe}
      disabled={isLoading || permissionState === "denied"}
      className={`
        relative p-2.5 rounded-xl transition-all duration-300 cursor-pointer
        ${
          subscription
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : permissionState === "denied"
              ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed"
              : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-primary"
        }
      `}
      title={
        subscription
          ? "Notifications enabled - click to disable"
          : permissionState === "denied"
            ? "Notifications blocked in browser settings"
            : "Enable push notifications"
      }
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            exit={{ scale: 0 }}
            className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"
          />
        ) : subscription ? (
          <motion.div
            key="on"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <BellRing size={20} />
          </motion.div>
        ) : (
          <motion.div
            key="off"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {permissionState === "denied" ? (
              <BellOff size={20} />
            ) : (
              <Bell size={20} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {subscription && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border-2 border-card" />
      )}
    </motion.button>
  );
}
