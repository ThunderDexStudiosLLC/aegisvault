import {
  timelineEvents, continuityThreads, recallQueries, timelineSnapshots, timelineStats,
} from "@/data/timeline-data";
import type {
  TimelineEvent, ContinuityThread, RecallQuery, TimelineSnapshot, TimelineStats,
  TimelineCategory, OpsMemoryType,
} from "@/types";

export const TimelineEngine = {
  getEvents: (): TimelineEvent[] => timelineEvents,
  getEventById: (id: string): TimelineEvent | undefined => timelineEvents.find((e) => e.id === id),
  getEventsByCategory: (cat: TimelineCategory): TimelineEvent[] => timelineEvents.filter((e) => e.category === cat),
  getEventsByMemoryType: (type: OpsMemoryType): TimelineEvent[] => timelineEvents.filter((e) => e.memoryType === type),
  getEventsByWorkspace: (wsId: string): TimelineEvent[] => timelineEvents.filter((e) => e.workspaceId === wsId),
  getPinnedEvents: (): TimelineEvent[] => timelineEvents.filter((e) => e.pinned),
  getCriticalEvents: (): TimelineEvent[] => timelineEvents.filter((e) => e.severity === "critical" || e.severity === "high"),
  getAiGeneratedEvents: (): TimelineEvent[] => timelineEvents.filter((e) => e.aiGenerated),
  getEncryptedEvents: (): TimelineEvent[] => timelineEvents.filter((e) => e.encrypted),
  getLinkedEvents: (eventId: string): TimelineEvent[] => {
    const event = timelineEvents.find((e) => e.id === eventId);
    if (!event) return [];
    return timelineEvents.filter((e) => event.linkedEventIds.includes(e.id));
  },
  searchEvents: (query: string): TimelineEvent[] => {
    const q = query.toLowerCase();
    return timelineEvents.filter((e) =>
      e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.tags.some((t) => t.includes(q))
    );
  },

  getThreads: (): ContinuityThread[] => continuityThreads,
  getActiveThreads: (): ContinuityThread[] => continuityThreads.filter((t) => t.status === "active"),
  getUnresolvedThreads: (): ContinuityThread[] => continuityThreads.filter((t) => t.unresolved),
  getPausedThreads: (): ContinuityThread[] => continuityThreads.filter((t) => t.status === "paused"),
  getThreadsByPriority: (priority: ContinuityThread["priority"]): ContinuityThread[] => continuityThreads.filter((t) => t.priority === priority),
  getThreadEvents: (threadId: string): TimelineEvent[] => {
    const thread = continuityThreads.find((t) => t.id === threadId);
    if (!thread) return [];
    return timelineEvents.filter((e) => thread.eventIds.includes(e.id));
  },

  getRecallQueries: (): RecallQuery[] => recallQueries,
  getSnapshots: (): TimelineSnapshot[] => timelineSnapshots,
  getStats: (): TimelineStats => timelineStats,
};
