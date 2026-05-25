export type UserRole = "founder" | "executive" | "operations" | "analyst" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organization: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "starter" | "professional" | "enterprise";
  memberCount: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface VaultDocument {
  id: string;
  title: string;
  type: "pdf" | "image" | "markdown" | "screenshot" | "video" | "audio" | "document";
  content?: string;
  fileSize?: string;
  uploadedAt: string;
  updatedAt: string;
  tags: Tag[];
  projectId?: string;
  createdBy: string;
  classification: "public" | "internal" | "confidential" | "top-secret";
}

export interface SecureNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  projectId?: string;
  createdBy: string;
  isPinned: boolean;
  classification: "public" | "internal" | "confidential" | "top-secret";
}

export interface MemoryEntry {
  id: string;
  type: "idea" | "decision" | "conversation" | "screenshot" | "note" | "milestone" | "event";
  title: string;
  content: string;
  date: string;
  tags: Tag[];
  linkedPeople: string[];
  linkedProjects: string[];
  source?: string;
  importance: "low" | "medium" | "high" | "critical";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "planning" | "on-hold" | "completed" | "archived";
  startDate: string;
  endDate?: string;
  tags: Tag[];
  team: string[];
  linkedProducts: string[];
  noteCount: number;
  decisionCount: number;
  progress: number;
  priority: "low" | "medium" | "high" | "critical";
}

export interface Relationship {
  id: string;
  name: string;
  type: "investor" | "partner" | "vendor" | "collaborator" | "advisor" | "client";
  company: string;
  role: string;
  email?: string;
  phone?: string;
  strategicImportance: "low" | "medium" | "high" | "critical";
  linkedProjects: string[];
  communicationHistory: CommunicationEntry[];
  lastContact: string;
  notes: string;
  tags: Tag[];
}

export interface CommunicationEntry {
  id: string;
  type: "email" | "call" | "meeting" | "message" | "document";
  subject: string;
  summary: string;
  date: string;
  participants: string[];
  linkedProject?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  attendees: string[];
  summary: string;
  keyDecisions: string[];
  followUpTasks: FollowUpTask[];
  linkedProjects: string[];
  tags: Tag[];
  recording?: string;
  transcript?: string;
}

export interface FollowUpTask {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "critical";
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  date: string;
  madeBy: string;
  rationale: string;
  impact: "low" | "medium" | "high" | "critical";
  status: "proposed" | "approved" | "implemented" | "reversed";
  linkedProjects: string[];
  linkedPeople: string[];
  tags: Tag[];
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: "project" | "person" | "company" | "product" | "decision" | "partnership" | "technology";
  x: number;
  y: number;
  connections: string[];
  metadata?: Record<string, string>;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityType: "document" | "note" | "project" | "meeting" | "decision" | "relationship";
  user: string;
  timestamp: string;
  details?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface AISummary {
  id: string;
  type: "project" | "executive" | "timeline" | "decision" | "relationship" | "operational";
  title: string;
  content: string;
  generatedAt: string;
  sourceCount: number;
  confidence: number;
}

export interface SearchResult {
  id: string;
  type: "document" | "note" | "project" | "meeting" | "decision" | "relationship" | "memory";
  title: string;
  snippet: string;
  relevance: number;
  date: string;
  tags: Tag[];
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "connected" | "available" | "coming-soon";
  category: "ecosystem" | "storage" | "ai" | "communication";
}
