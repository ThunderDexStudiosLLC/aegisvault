"use client";

import { useState, useCallback } from "react";
import type {
  VaultDocument, SecureNote, MemoryEntry, Project, Relationship,
  Meeting, Decision, ActivityLog, Notification, SearchResult, Tag,
} from "@/types";
import {
  documents as demoDocuments, notes as demNotes, memories as demoMemories,
  projects as demoProjects, relationships as demoRelationships,
  meetings as demoMeetings, decisions as demoDecisions,
  activityLogs as demoLogs, notifications as demoNotifications,
} from "@/data/demo";
import { generateId } from "@/lib/utils";

export function useVaultStore() {
  const [documents, setDocuments] = useState<VaultDocument[]>(demoDocuments);
  const [notes, setNotes] = useState<SecureNote[]>(demNotes);
  const [memories, setMemories] = useState<MemoryEntry[]>(demoMemories);
  const [projects] = useState<Project[]>(demoProjects);
  const [relationships] = useState<Relationship[]>(demoRelationships);
  const [meetingsList] = useState<Meeting[]>(demoMeetings);
  const [decisionsList] = useState<Decision[]>(demoDecisions);
  const [logs] = useState<ActivityLog[]>(demoLogs);
  const [notificationsList, setNotifications] = useState<Notification[]>(demoNotifications);

  const addNote = useCallback((title: string, content: string, noteTags: Tag[]) => {
    const newNote: SecureNote = {
      id: generateId(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: noteTags,
      createdBy: "u1",
      isPinned: false,
      classification: "internal",
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  }, []);

  const addMemory = useCallback((entry: Omit<MemoryEntry, "id">) => {
    const newMemory: MemoryEntry = { id: generateId(), ...entry };
    setMemories((prev) => [newMemory, ...prev]);
    return newMemory;
  }, []);

  const addDocument = useCallback((doc: Omit<VaultDocument, "id">) => {
    const newDoc: VaultDocument = { id: generateId(), ...doc };
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const searchVault = useCallback((query: string): SearchResult[] => {
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    documents.forEach((doc) => {
      const relevance = calculateRelevance(q, doc.title, doc.content || "");
      if (relevance > 0) {
        results.push({
          id: doc.id, type: "document", title: doc.title,
          snippet: doc.content?.substring(0, 150) || `${doc.type} document - ${doc.fileSize}`,
          relevance, date: doc.updatedAt, tags: doc.tags,
        });
      }
    });

    notes.forEach((note) => {
      const relevance = calculateRelevance(q, note.title, note.content);
      if (relevance > 0) {
        results.push({
          id: note.id, type: "note", title: note.title,
          snippet: note.content.substring(0, 150),
          relevance, date: note.updatedAt, tags: note.tags,
        });
      }
    });

    projects.forEach((proj) => {
      const relevance = calculateRelevance(q, proj.name, proj.description);
      if (relevance > 0) {
        results.push({
          id: proj.id, type: "project", title: proj.name,
          snippet: proj.description,
          relevance, date: proj.startDate, tags: proj.tags,
        });
      }
    });

    memories.forEach((mem) => {
      const relevance = calculateRelevance(q, mem.title, mem.content);
      if (relevance > 0) {
        results.push({
          id: mem.id, type: "memory", title: mem.title,
          snippet: mem.content.substring(0, 150),
          relevance, date: mem.date, tags: mem.tags,
        });
      }
    });

    meetingsList.forEach((mtg) => {
      const relevance = calculateRelevance(q, mtg.title, mtg.summary);
      if (relevance > 0) {
        results.push({
          id: mtg.id, type: "meeting", title: mtg.title,
          snippet: mtg.summary.substring(0, 150),
          relevance, date: mtg.date, tags: mtg.tags,
        });
      }
    });

    decisionsList.forEach((dec) => {
      const relevance = calculateRelevance(q, dec.title, dec.description + " " + dec.rationale);
      if (relevance > 0) {
        results.push({
          id: dec.id, type: "decision", title: dec.title,
          snippet: dec.description,
          relevance, date: dec.date, tags: dec.tags,
        });
      }
    });

    relationships.forEach((rel) => {
      const relevance = calculateRelevance(q, rel.name, rel.notes + " " + rel.company + " " + rel.role);
      if (relevance > 0) {
        results.push({
          id: rel.id, type: "relationship", title: rel.name,
          snippet: `${rel.role} at ${rel.company} - ${rel.notes.substring(0, 100)}`,
          relevance, date: rel.lastContact, tags: rel.tags,
        });
      }
    });

    return results.sort((a, b) => b.relevance - a.relevance);
  }, [documents, notes, memories, projects, relationships, meetingsList, decisionsList]);

  return {
    documents, notes, memories, projects, relationships,
    meetings: meetingsList, decisions: decisionsList,
    activityLogs: logs, notifications: notificationsList,
    addNote, addMemory, addDocument, markNotificationRead, searchVault,
  };
}

function calculateRelevance(query: string, title: string, content: string): number {
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  let score = 0;

  const terms = query.split(/\s+/).filter(Boolean);
  for (const term of terms) {
    if (titleLower.includes(term)) score += 10;
    if (contentLower.includes(term)) score += 5;
  }

  if (titleLower.includes(query)) score += 20;
  if (contentLower.includes(query)) score += 10;

  return score;
}
