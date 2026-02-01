"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, Loader2 } from "lucide-react";

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title = "Delete Event?",
  message = "Are you sure you want to delete this event? This action cannot be undone.",
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isDeleting ? onClose : undefined}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Decorative Background Effects */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 blur-[40px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 mb-2">
              <Trash2 size={32} />
            </div>

            <h3 className="text-xl font-bold text-foreground">{title}</h3>

            <p className="text-sm text-gray-500 font-medium">{message}</p>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-white/5 text-foreground font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
