"use client";

import { useState, useEffect } from "react";
import {
  Clock, Lightbulb, MessageSquare, Image, FileText, Flag,
  Calendar, Filter, Search, Plus, ChevronDown, Tag,
} from "lucide-react";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import { memories, tags as allTags } from "@/data/demo";
import { useOrb } from "@/contexts/OrbContext";
import type { MemoryEntry } from "@/types";

const typeIcons: Record<string, React.ElementType> = {
  idea: Lightbulb,
  decision: Flag,
  conversation: MessageSquare,
  screenshot: Image,
  note: FileText,
  milestone: Calendar,
  event: Calendar,
};

const typeColors: Record<string, string> = {
  idea: "bg-warning/10 text-warning border-warning/20",
  decision: "bg-electric/10 text-electric-glow border-electric/20",
  conversation: "bg-info/10 text-info border-info/20",
  screenshot: "bg-success/10 text-success border-success/20",
  note: "bg-muted text-muted-foreground border-border",
  milestone: "bg-destructive/10 text-destructive border-destructive/20",
  event: "bg-electric-glow/10 text-electric-glow border-electric-glow/20",
};

const importanceColors: Record<string, string> = {
  critical: "bg-destructive",
  high: "bg-warning",
  medium: "bg-electric",
  low: "bg-muted-foreground",
};

export default function TimelinePage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterImportance, setFilterImportance] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [memoryList, setMemoryList] = useState<MemoryEntry[]>(memories);
  const [newMemory, setNewMemory] = useState({ title: "", content: "", type: "note" as MemoryEntry["type"], importance: "medium" as MemoryEntry["importance"] });
  const { setState } = useOrb();

  useEffect(() => {
    setState("linking-memory");
    const timer = setTimeout(() => setState("idle"), 3000);
    return () => clearTimeout(timer);
  }, [setState]);

  const filtered = memoryList.filter((m) => {
    if (filterType !== "all" && m.type !== filterType) return false;
    if (filterImportance !== "all" && m.importance !== filterImportance) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!m.title.toLowerCase().includes(q) && !m.content.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const grouped = filtered.reduce<Record<string, MemoryEntry[]>>((acc, m) => {
    const dateKey = formatDate(m.date);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(m);
    return acc;
  }, {});

  const handleAddMemory = () => {
    if (!newMemory.title.trim()) return;
    const entry: MemoryEntry = {
      id: `m-${Date.now()}`,
      ...newMemory,
      date: new Date().toISOString(),
      tags: [],
      linkedPeople: [],
      linkedProjects: [],
    };
    setMemoryList([entry, ...memoryList]);
    setShowAddMemory(false);
    setNewMemory({ title: "", content: "", type: "note", importance: "medium" });
  };

  return (
    <div className="aegis-page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Founder Memory Timeline</h1>
          <p className="text-sm text-muted-foreground/70">Chronological record of ideas, decisions, conversations, and milestones</p>
        </div>
        <button
          onClick={() => setShowAddMemory(!showAddMemory)}
          className="flex items-center gap-2 aegis-btn-primary rounded-lg px-4 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          Add Memory
        </button>
      </div>

      {showAddMemory && (
        <div className="aegis-card rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Record New Memory</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Memory title..."
              value={newMemory.title}
              onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
              className="h-10 rounded-lg border border-border/30 bg-background/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none"
            />
            <div className="flex gap-3">
              <select
                value={newMemory.type}
                onChange={(e) => setNewMemory({ ...newMemory, type: e.target.value as MemoryEntry["type"] })}
                className="h-10 rounded-lg border border-border/30 bg-background/50 px-3 text-sm text-foreground"
              >
                <option value="idea">Idea</option>
                <option value="decision">Decision</option>
                <option value="conversation">Conversation</option>
                <option value="note">Note</option>
                <option value="milestone">Milestone</option>
                <option value="event">Event</option>
              </select>
              <select
                value={newMemory.importance}
                onChange={(e) => setNewMemory({ ...newMemory, importance: e.target.value as MemoryEntry["importance"] })}
                className="h-10 rounded-lg border border-border/30 bg-background/50 px-3 text-sm text-foreground"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <textarea
            placeholder="Describe this memory in detail..."
            value={newMemory.content}
            onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
            rows={4}
            className="mt-4 w-full rounded-lg border border-border/30 bg-background/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none"
          />
          <div className="mt-4 flex gap-3">
            <button onClick={handleAddMemory} className="aegis-btn-primary rounded-lg px-4 py-2 text-sm font-medium text-white">
              Save Memory
            </button>
            <button onClick={() => setShowAddMemory(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search memories by topic, person, project, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border/30 bg-background/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-electric focus:outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-9 rounded-lg border border-border/30 bg-background/50 px-3 text-xs text-foreground"
        >
          <option value="all">All Types</option>
          <option value="idea">Ideas</option>
          <option value="decision">Decisions</option>
          <option value="conversation">Conversations</option>
          <option value="note">Notes</option>
          <option value="milestone">Milestones</option>
          <option value="event">Events</option>
        </select>
        <select
          value={filterImportance}
          onChange={(e) => setFilterImportance(e.target.value)}
          className="h-9 rounded-lg border border-border/30 bg-background/50 px-3 text-xs text-foreground"
        >
          <option value="all">All Importance</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

        {Object.entries(grouped).map(([dateKey, entries]) => (
          <div key={dateKey} className="mb-8">
            <div className="relative mb-4 flex items-center gap-3">
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
                <Calendar className="h-5 w-5 text-electric" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{dateKey}</h3>
            </div>

            <div className="ml-16 space-y-4">
              {entries.map((memory) => {
                const Icon = typeIcons[memory.type] || FileText;
                return (
                  <div key={memory.id} className="glass-interactive rounded-xl p-4 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", typeColors[memory.type])}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{memory.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn("rounded px-1.5 py-0.5 text-[10px]", typeColors[memory.type])}>
                              {memory.type}
                            </span>
                            <div className="flex items-center gap-1">
                              <div className={cn("h-1.5 w-1.5 rounded-full", importanceColors[memory.importance])} />
                              <span className="text-[10px] text-muted-foreground">{memory.importance}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(memory.date)}</span>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">{memory.content}</p>

                    {(memory.linkedPeople.length > 0 || memory.linkedProjects.length > 0 || memory.tags.length > 0) && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {memory.linkedPeople.map((person) => (
                          <span key={person} className="rounded bg-electric/10 px-2 py-0.5 text-[10px] text-electric-glow">
                            @{person}
                          </span>
                        ))}
                        {memory.linkedProjects.map((project) => (
                          <span key={project} className="rounded bg-warning/10 px-2 py-0.5 text-[10px] text-warning">
                            #{project}
                          </span>
                        ))}
                        {memory.tags.map((tag) => (
                          <span key={tag.id} className="rounded px-2 py-0.5 text-[10px]" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
