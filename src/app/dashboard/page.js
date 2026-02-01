"use client";

import { useEffect } from "react";
import { useTodoStore } from "@/store/useTodoStore";
import { TodoCard } from "@/components/TodoCard";
import { TodoForm } from "@/components/TodoForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { ListTodo, Search } from "lucide-react";

export default function Dashboard() {
  const { todos, fetchTodos, addTodo, toggleTodo, deleteTodo, isLoading } =
    useTodoStore();

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-6 animate-pulse">
          <ListTodo size={40} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">
          Coming Soon
        </h1>
        <p className="text-gray-500 font-medium max-w-xs">
          We're preparing something special for your dashboard. Stay tuned!
        </p>
      </div>
    </DashboardLayout>
  );
}
