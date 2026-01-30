"use client";

import { useEffect } from "react";
import { useTodoStore } from "@/store/useTodoStore";
import { TodoCard } from "@/components/TodoCard";
import { TodoForm } from "@/components/TodoForm";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
      <div className="flex flex-col gap-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center gap-4">
              Daily Tasks
              <span className="text-primary bg-primary/10 px-4 py-1 rounded-2xl text-xl animate-bounce">
                {todos.filter((t) => !t.completed).length}
              </span>
            </h1>
            <p className="text-gray-500 font-medium text-lg">
              Manage your productivity with style.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group flex-1 md:flex-none">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search tasks..."
                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full md:w-64 text-white"
              />
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Action Section */}
        <section className="max-w-3xl mx-auto w-full">
          <TodoForm onAdd={addTodo} />
        </section>

        {/* Content Section - Bento Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-28 glass bg-white/5 animate-pulse rounded-2xl"
                />
              ))
            ) : todos.length > 0 ? (
              todos.map((todo) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-6">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] rotate-12 flex items-center justify-center mx-auto text-gray-700 border border-white/10">
                  <ListTodo size={48} className="-rotate-12" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-200">
                    No tasks found
                  </h3>
                  <p className="text-gray-500 max-w-xs mx-auto mt-2 font-medium">
                    Your productivity journey starts here. Add your first task
                    above!
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </DashboardLayout>
  );
}
