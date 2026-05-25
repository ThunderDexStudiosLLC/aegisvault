"use client";

import { createContext, useContext, type ReactNode } from "react";
import { TimelineEngine } from "@/lib/timeline-engine";
import type {
  TimelineEvent, ContinuityThread, RecallQuery, TimelineSnapshot, TimelineStats,
  TimelineCategory, OpsMemoryType,
} from "@/types";

interface TimelineContextValue {
  events: TimelineEvent[];
  getEventById: (id: string) => TimelineEvent | undefined;
  getEventsByCategory: (cat: TimelineCategory) => TimelineEvent[];
  getEventsByMemoryType: (type: OpsMemoryType) => TimelineEvent[];
  getEventsByWorkspace: (wsId: string) => TimelineEvent[];
  getPinnedEvents: () => TimelineEvent[];
  getCriticalEvents: () => TimelineEvent[];
  getAiGeneratedEvents: () => TimelineEvent[];
  getEncryptedEvents: () => TimelineEvent[];
  getLinkedEvents: (eventId: string) => TimelineEvent[];
  searchEvents: (query: string) => TimelineEvent[];
  threads: ContinuityThread[];
  getActiveThreads: () => ContinuityThread[];
  getUnresolvedThreads: () => ContinuityThread[];
  getPausedThreads: () => ContinuityThread[];
  getThreadsByPriority: (priority: ContinuityThread["priority"]) => ContinuityThread[];
  getThreadEvents: (threadId: string) => TimelineEvent[];
  recallQueries: RecallQuery[];
  snapshots: TimelineSnapshot[];
  stats: TimelineStats;
}

const TimelineCtx = createContext<TimelineContextValue | null>(null);

export function TimelineProvider({ children }: { children: ReactNode }) {
  const value: TimelineContextValue = {
    events: TimelineEngine.getEvents(),
    getEventById: TimelineEngine.getEventById,
    getEventsByCategory: TimelineEngine.getEventsByCategory,
    getEventsByMemoryType: TimelineEngine.getEventsByMemoryType,
    getEventsByWorkspace: TimelineEngine.getEventsByWorkspace,
    getPinnedEvents: TimelineEngine.getPinnedEvents,
    getCriticalEvents: TimelineEngine.getCriticalEvents,
    getAiGeneratedEvents: TimelineEngine.getAiGeneratedEvents,
    getEncryptedEvents: TimelineEngine.getEncryptedEvents,
    getLinkedEvents: TimelineEngine.getLinkedEvents,
    searchEvents: TimelineEngine.searchEvents,
    threads: TimelineEngine.getThreads(),
    getActiveThreads: TimelineEngine.getActiveThreads,
    getUnresolvedThreads: TimelineEngine.getUnresolvedThreads,
    getPausedThreads: TimelineEngine.getPausedThreads,
    getThreadsByPriority: TimelineEngine.getThreadsByPriority,
    getThreadEvents: TimelineEngine.getThreadEvents,
    recallQueries: TimelineEngine.getRecallQueries(),
    snapshots: TimelineEngine.getSnapshots(),
    stats: TimelineEngine.getStats(),
  };

  return <TimelineCtx.Provider value={value}>{children}</TimelineCtx.Provider>;
}

export function useTimeline() {
  const ctx = useContext(TimelineCtx);
  if (!ctx) throw new Error("useTimeline must be used within TimelineProvider");
  return ctx;
}
