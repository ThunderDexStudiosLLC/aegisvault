"use client";

import { useState, useEffect } from "react";
import { Plus, Pin, Search, Shield, Tag, Edit3, Trash2, Clock } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { notes as demoNotes, tags as allTags } from "@/data/demo";
import type { SecureNote } from "@/types";
import { useFeedback } from "@/components/global/OperationalFeedback";
import { useOrb } from "@/contexts/OrbContext";

const classificationColors: Record<string, string> = {
  "public": "bg-success/10 text-success",
  "internal": "bg-electric/10 text-electric-glow",
  "confidential": "bg-warning/10 text-warning",
  "top-secret": "bg-destructive/10 text-destructive",
};

export default function NotesPage() {
  const [notesList, setNotesList] = useState<SecureNote[]>(demoNotes);
  const [selectedId, setSelectedId] = useState(demoNotes[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewNote, setShowNewNote] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const selected = notesList.find((n) => n.id === selectedId);
  const { show } = useFeedback();
  const { setState } = useOrb();

  useEffect(() => { setState("secure"); const t = setTimeout(() => setState("idle"), 3000); return () => clearTimeout(t); }, [setState]);

  const filtered = notesList.filter((note) => {
    if (searchQuery && !note.title.toLowerCase().includes(searchQuery.toLowerCase()) && !note.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const pinnedNotes = filtered.filter((n) => n.isPinned);
  const unpinnedNotes = filtered.filter((n) => !n.isPinned);

  const handleCreateNote = () => {
    if (!newTitle.trim()) return;
    const newNote: SecureNote = {
      id: `n-${Date.now()}`,
      title: newTitle,
      content: newContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      createdBy: "u1",
      isPinned: false,
      classification: "internal",
    };
    setNotesList([newNote, ...notesList]);
    setSelectedId(newNote.id);
    setShowNewNote(false);
    setNewTitle("");
    setNewContent("");
    show("success", "Note created", "Encrypted and saved to vault");
  };

  const togglePin = (id: string) => {
    const note = notesList.find((n) => n.id === id);
    setNotesList(notesList.map((n) => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    show("success", note?.isPinned ? "Note unpinned" : "Note pinned");
  };

  return (
    <div className="aegis-page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Secure Notes</h1>
          <p className="text-sm text-muted-foreground/70">{notesList.length} encrypted notes in vault</p>
        </div>
        <button
          onClick={() => setShowNewNote(true)}
          className="flex items-center gap-2 aegis-btn-primary rounded-lg px-4 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Note List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-border/30 bg-background/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-electric focus:outline-none"
            />
          </div>

          {pinnedNotes.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Pin className="h-3 w-3" /> Pinned
              </p>
              {pinnedNotes.map((note) => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  isSelected={selectedId === note.id}
                  onSelect={() => setSelectedId(note.id)}
                />
              ))}
            </div>
          )}

          <div>
            {pinnedNotes.length > 0 && (
              <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">All Notes</p>
            )}
            {unpinnedNotes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                isSelected={selectedId === note.id}
                onSelect={() => setSelectedId(note.id)}
              />
            ))}
          </div>
        </div>

        {/* Note Editor / Viewer */}
        <div className="col-span-2">
          {showNewNote ? (
            <div className="aegis-card rounded-xl p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Create New Note</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border/30 bg-background/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none"
                />
                <textarea
                  placeholder="Start writing..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={15}
                  className="w-full rounded-lg border border-border/30 bg-background/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateNote}
                    className="aegis-btn-primary rounded-lg px-4 py-2 text-sm font-medium text-white"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => setShowNewNote(false)}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : selected ? (
            <div className="aegis-card rounded-xl p-6">
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-foreground">{selected.title}</h2>
                    <span className={cn("rounded px-1.5 py-0.5 text-[10px] uppercase", classificationColors[selected.classification])}>
                      {selected.classification}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Updated {formatRelativeTime(selected.updatedAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePin(selected.id)}
                    className={cn("rounded-lg p-2 hover:bg-secondary", selected.isPinned ? "text-warning" : "text-muted-foreground")}
                  >
                    <Pin className="h-4 w-4" />
                  </button>
                  <button onClick={() => show("success", "Edit mode", "Note unlocked for editing")} className="rounded-lg p-2 text-muted-foreground hover:bg-white/[0.03] hover:text-foreground">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {selected.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => (
                    <span key={tag.id} className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px]" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                      <Tag className="h-2.5 w-2.5" /> {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {selected.content}
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground/70">
              Select a note to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NoteListItem({ note, isSelected, onSelect }: { note: SecureNote; isSelected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "mb-2 w-full rounded-xl p-3 text-left transition-all",
        isSelected ? "glass border-electric-dim/30" : "glass glass-hover"
      )}
    >
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-medium text-foreground line-clamp-1">{note.title}</h4>
        {note.isPinned && <Pin className="h-3 w-3 shrink-0 text-warning" />}
      </div>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{note.content}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className={cn("rounded px-1 py-0.5 text-[9px] uppercase", {
          "bg-success/10 text-success": note.classification === "public",
          "bg-electric/10 text-electric-glow": note.classification === "internal",
          "bg-warning/10 text-warning": note.classification === "confidential",
          "bg-destructive/10 text-destructive": note.classification === "top-secret",
        })}>
          {note.classification}
        </span>
        <span className="text-[10px] text-muted-foreground">{formatRelativeTime(note.updatedAt)}</span>
      </div>
    </button>
  );
}
