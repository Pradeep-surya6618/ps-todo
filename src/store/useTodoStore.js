import { create } from "zustand";

export const useTodoStore = create((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      if (res.ok) set({ todos: data, isLoading: false });
      else throw new Error("Failed to fetch todos");
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTodo: async (todo) => {
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      });
      const newTodo = await res.json();
      if (res.ok) set({ todos: [newTodo, ...get().todos] });
      else throw new Error("Failed to add todo");
    } catch (error) {
      set({ error: error.message });
    }
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find((t) => t._id === id);
    if (!todo) return;

    const oldTodos = get().todos;
    try {
      set({
        todos: oldTodos.map((t) =>
          t._id === id ? { ...t, completed: !todo.completed } : t,
        ),
      });
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error("Failed to toggle todo");
    } catch (error) {
      set({ error: error.message, todos: oldTodos });
    }
  },

  deleteTodo: async (id) => {
    const oldTodos = get().todos;
    try {
      set({ todos: get().todos.filter((t) => t._id !== id) });
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete todo");
    } catch (error) {
      set({ error: error.message, todos: oldTodos });
    }
  },
}));
