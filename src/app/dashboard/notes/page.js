"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNoteStore } from "@/store/useNoteStore";
import {
  Plus,
  Search,
  Pin,
  PinOff,
  Trash2,
  Edit3,
  X,
  StickyNote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSnackbar } from "notistack";
import { format } from "date-fns";

const noteColors = [
  "#ff2e63",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export default function NotesPage() {
  const {
    notes,
    isLoading,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
  } = useNoteStore();
  const { enqueueSnackbar } = useSnackbar();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#ff2e63");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedNote, setExpandedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }, [notes, searchQuery]);

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

  const openEditor = (note = null) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
      setTags(note.tags || []);
    } else {
      setEditingNote(null);
      setTitle("");
      setContent("");
      setColor("#ff2e63");
      setTags([]);
    }
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      enqueueSnackbar("Title is required", { variant: "warning" });
      return;
    }

    const noteData = { title, content, color, tags };

    if (editingNote) {
      const result = await updateNote(editingNote._id, noteData);
      if (result) enqueueSnackbar("Note updated!", { variant: "success" });
      else enqueueSnackbar("Failed to update", { variant: "error" });
    } else {
      const result = await addNote(noteData);
      if (result) enqueueSnackbar("Note created!", { variant: "success" });
      else enqueueSnackbar("Failed to create", { variant: "error" });
    }

    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    enqueueSnackbar("Note deleted", { variant: "success" });
    setDeleteConfirm(null);
  };

  const handlePin = async (id) => {
    await togglePin(id);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 pb-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-foreground">
              Notes
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              Capture your thoughts
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => openEditor()}
            className="w-10 h-10 md:w-12 md:h-12 bg-primary text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 cursor-pointer"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-foreground font-medium text-sm"
          />
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-3.5 min-h-[140px] flex flex-col bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 animate-pulse"
                >
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2.5 w-full bg-gray-200 dark:bg-zinc-700 rounded" />
                    <div className="h-2.5 w-5/6 bg-gray-200 dark:bg-zinc-700 rounded" />
                    <div className="h-2.5 w-2/3 bg-gray-200 dark:bg-zinc-700 rounded" />
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    <div className="h-4 w-10 bg-gray-200 dark:bg-zinc-700 rounded" />
                    <div className="h-4 w-10 bg-gray-200 dark:bg-zinc-700 rounded" />
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-zinc-700">
                    <div className="h-2.5 w-12 bg-gray-200 dark:bg-zinc-700 rounded" />
                    <div className="flex gap-1">
                      <div className="w-5 h-5 bg-gray-200 dark:bg-zinc-700 rounded" />
                      <div className="w-5 h-5 bg-gray-200 dark:bg-zinc-700 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-6">
              <StickyNote size={40} />
            </div>
            <h2 className="text-xl font-black text-foreground mb-2">
              {searchQuery ? "No notes found" : "No notes yet"}
            </h2>
            <p className="text-gray-500 font-medium max-w-xs mb-6">
              {searchQuery
                ? "Try a different search term"
                : "Start writing something amazing!"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => openEditor()}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 cursor-pointer"
              >
                Create Your First Note
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1 flex items-center gap-1.5">
                  <Pin size={12} /> Pinned
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={() => openEditor(note)}
                      onDelete={() => setDeleteConfirm(note._id)}
                      onPin={() => handlePin(note._id)}
                      onExpand={() => setExpandedNote(note)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Notes */}
            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
                    Others
                  </h3>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {unpinnedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={() => openEditor(note)}
                      onDelete={() => setDeleteConfirm(note._id)}
                      onPin={() => handlePin(note._id)}
                      onExpand={() => setExpandedNote(note)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Note Editor Dialog */}
        <AnimatePresence>
          {isEditorOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditorOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-lg bg-card border border-border rounded-[2rem] p-5 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-foreground">
                    {editingNote ? "Edit Note" : "New Note"}
                  </h2>
                  <button
                    onClick={() => setIsEditorOpen(false)}
                    className="p-2 hover:bg-primary/10 rounded-full text-gray-500 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title..."
                    className="w-full text-lg font-black text-foreground bg-transparent border-none outline-none placeholder:text-gray-300"
                  />

                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your note..."
                    rows={8}
                    className="w-full text-sm font-medium text-foreground bg-transparent border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-colors"
                  />

                  {/* Color Picker */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase ml-1">
                      Color
                    </label>
                    <div className="flex gap-2">
                      {noteColors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`w-8 h-8 rounded-full transition-all cursor-pointer ${color === c ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-110"}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary uppercase ml-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500 cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                        placeholder="Add a tag..."
                        className="flex-1 h-9 px-3 bg-auth-input-bg border border-border rounded-lg text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-3 h-9 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full h-12 bg-primary text-white rounded-xl font-black text-base shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {editingNote ? "Save Changes" : "Create Note"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Expanded Note View */}
        <AnimatePresence>
          {expandedNote && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpandedNote(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-lg bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-2xl max-h-[80vh] overflow-y-auto no-scrollbar"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-foreground mb-1">
                      {expandedNote.title}
                    </h2>
                    <p className="text-xs text-gray-400 font-medium">
                      {format(
                        new Date(expandedNote.updatedAt),
                        "MMM d, yyyy 'at' h:mm a",
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedNote(null)}
                    className="p-2 hover:bg-primary/10 rounded-full text-gray-500 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {expandedNote.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {expandedNote.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md"
                        style={{
                          color: expandedNote.color,
                          backgroundColor: `${expandedNote.color}15`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-sm text-foreground/80 font-medium leading-relaxed whitespace-pre-wrap">
                  {expandedNote.content || "No content"}
                </div>

                <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      setExpandedNote(null);
                      openEditor(expandedNote);
                    }}
                    className="flex-1 h-10 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(expandedNote._id);
                      setExpandedNote(null);
                    }}
                    className="h-10 px-4 bg-red-500/10 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {deleteConfirm && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirm(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-xs text-center"
              >
                <h3 className="text-lg font-black text-foreground mb-2">
                  Delete Note?
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 h-10 bg-card border border-border rounded-xl font-bold text-sm text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 h-10 bg-red-500 text-white rounded-xl font-bold text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

function NoteCard({ note, onEdit, onDelete, onPin, onExpand }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={onExpand}
      className="group relative rounded-2xl p-3.5 min-h-[140px] flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
      style={{
        backgroundColor: `${note.color}08`,
        border: `1px solid ${note.color}20`,
      }}
    >
      {note.isPinned && (
        <div className="absolute top-2 right-2" style={{ color: note.color }}>
          <Pin size={12} />
        </div>
      )}

      <h4 className="font-bold text-sm text-foreground leading-tight line-clamp-2 mb-1.5 pr-5">
        {note.title}
      </h4>

      <p className="text-[11px] text-muted-foreground font-medium line-clamp-3 leading-relaxed flex-1 opacity-70">
        {note.content || "No content"}
      </p>

      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {note.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded"
              style={{
                color: note.color,
                backgroundColor: `${note.color}15`,
              }}
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="text-[8px] text-gray-400 font-bold">
              +{note.tags.length - 2}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/5">
        <span className="text-[9px] font-medium text-gray-400">
          {format(new Date(note.updatedAt), "MMM d")}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-400 hover:text-primary transition-colors cursor-pointer"
          >
            {note.isPinned ? <PinOff size={11} /> : <Pin size={11} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-400 hover:text-foreground transition-colors cursor-pointer"
          >
            <Edit3 size={11} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
