import { create } from "zustand";

export const useNoteStore = create((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  activeTag: null,
  showArchived: false,
  sortBy: "updatedAt",

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveTag: (tag) => set({ activeTag: tag }),
  setShowArchived: (val) => set({ showArchived: val }),
  setSortBy: (val) => set({ sortBy: val }),

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { searchQuery, activeTag, showArchived, sortBy } = get();
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (activeTag) params.set("tag", activeTag);
      if (showArchived) params.set("archived", "true");
      params.set("sort", sortBy);

      const res = await fetch(`/api/notes?${params}`);
      const data = await res.json();
      if (res.ok) set({ notes: data, isLoading: false });
      else throw new Error("Failed to fetch notes");
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addNote: async (note) => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      const newNote = await res.json();
      if (res.ok) {
        set({ notes: [newNote, ...get().notes] });
        return newNote;
      } else throw new Error("Failed to add note");
    } catch (error) {
      set({ error: error.message });
      return null;
    }
  },

  updateNote: async (id, updates) => {
    const oldNotes = get().notes;
    try {
      // Optimistic update
      set({
        notes: oldNotes.map((n) => (n._id === id ? { ...n, ...updates } : n)),
      });

      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update note");
      const updated = await res.json();
      set({
        notes: get().notes.map((n) => (n._id === id ? updated : n)),
      });
      return updated;
    } catch (error) {
      set({ error: error.message, notes: oldNotes });
      return null;
    }
  },

  deleteNote: async (id) => {
    const oldNotes = get().notes;
    try {
      set({ notes: oldNotes.filter((n) => n._id !== id) });
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete note");
    } catch (error) {
      set({ error: error.message, notes: oldNotes });
    }
  },

  archiveNote: async (id) => {
    const note = get().notes.find((n) => n._id === id);
    if (!note) return;
    // Optimistic: remove from current view
    set({ notes: get().notes.filter((n) => n._id !== id) });
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...note, isArchived: true }),
      });
      if (!res.ok) throw new Error("Failed to archive note");
    } catch (error) {
      set({ error: error.message, notes: [note, ...get().notes] });
    }
  },

  restoreNote: async (id) => {
    const note = get().notes.find((n) => n._id === id);
    if (!note) return;
    set({ notes: get().notes.filter((n) => n._id !== id) });
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...note, isArchived: false }),
      });
      if (!res.ok) throw new Error("Failed to restore note");
    } catch (error) {
      set({ error: error.message, notes: [note, ...get().notes] });
    }
  },

  togglePin: async (id) => {
    const note = get().notes.find((n) => n._id === id);
    if (!note) return;
    const updated = await get().updateNote(id, {
      ...note,
      isPinned: !note.isPinned,
    });
    return updated;
  },
}));
