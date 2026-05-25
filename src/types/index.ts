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

/* ================================================================
   PERSISTENT MEMORY ENGINE
   ================================================================ */

export type MemoryType =
  | "founder-memory"
  | "project-memory"
  | "workflow-memory"
  | "meeting-summary"
  | "communication"
  | "document"
  | "sop"
  | "operational-log"
  | "strategic-note"
  | "relationship-intelligence";

export type MemoryStatus = "active" | "pinned" | "archived";

export interface MemoryNode {
  id: string;
  type: MemoryType;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  accessedAt: string;
  accessCount: number;
  importance: number;
  status: MemoryStatus;
  tags: Tag[];
  linkedMemories: string[];
  linkedPeople: string[];
  linkedProjects: string[];
  source?: string;
  embeddings?: number[];
  clusterId?: string;
  contextualAnchors: ContextualAnchor[];
}

export interface ContextualAnchor {
  type: "person" | "project" | "date" | "decision" | "event" | "system";
  value: string;
  strength: number;
}

export interface MemoryCluster {
  id: string;
  label: string;
  description: string;
  memoryIds: string[];
  centroidTags: string[];
  coherence: number;
  createdAt: string;
}

export interface MemoryLink {
  id: string;
  sourceId: string;
  targetId: string;
  relationship: "related" | "caused-by" | "leads-to" | "contradicts" | "supports" | "references" | "evolved-from";
  strength: number;
  createdAt: string;
  context?: string;
}

export interface MemorySummary {
  id: string;
  title: string;
  content: string;
  memoryIds: string[];
  generatedAt: string;
  timeRange: { start: string; end: string };
  confidence: number;
  type: "project-continuity" | "relationship-narrative" | "decision-chain" | "operational-recap" | "strategic-evolution";
}

export interface MemorySearchResult {
  memory: MemoryNode;
  relevance: number;
  matchedTerms: string[];
  contextSnippet: string;
}

export interface MemoryGraphNode {
  id: string;
  label: string;
  type: MemoryType | "person" | "project" | "cluster";
  x: number;
  y: number;
  size: number;
  importance: number;
  connections: string[];
}

/* ================================================================
   ECOSYSTEM INTELLIGENCE LINKING
   ================================================================ */

export type EcosystemProductStatus = "active" | "development" | "planning" | "beta" | "paused";

export interface EcosystemProduct {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: "platform" | "intelligence" | "operations" | "finance" | "communication" | "civic" | "development";
  status: EcosystemProductStatus;
  color: string;
  icon: string;
  version?: string;
  health: number;
  dependencies: string[];
  dependents: string[];
  sharedCapabilities: string[];
  memoryIds: string[];
  workflowIds: string[];
  teamMembers: string[];
  dataFlows: EcosystemDataFlow[];
  metrics: EcosystemProductMetrics;
}

export interface EcosystemDataFlow {
  id: string;
  sourceProductId: string;
  targetProductId: string;
  dataType: "memory" | "workflow" | "intelligence" | "events" | "auth" | "billing" | "analytics";
  direction: "inbound" | "outbound" | "bidirectional";
  status: "active" | "planned" | "paused";
  description: string;
  volumePerDay?: number;
}

export interface EcosystemProductMetrics {
  memoryCount: number;
  workflowCount: number;
  activeUsers?: number;
  uptime?: number;
  lastSync?: string;
}

export interface EcosystemLink {
  id: string;
  sourceProductId: string;
  targetProductId: string;
  linkType: "dependency" | "integration" | "data-flow" | "shared-infra" | "api" | "memory-sync";
  strength: number;
  status: "active" | "planned" | "deprecated";
  description: string;
}

export interface EcosystemWorkflow {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  steps: EcosystemWorkflowStep[];
  status: "active" | "draft" | "deprecated";
  frequency: "real-time" | "hourly" | "daily" | "weekly" | "on-demand";
  lastExecuted?: string;
  memoryIds: string[];
}

export interface EcosystemWorkflowStep {
  order: number;
  productId: string;
  action: string;
  dataIn?: string;
  dataOut?: string;
}

export interface EcosystemRecommendation {
  id: string;
  type: "link-suggestion" | "dependency-alert" | "optimization" | "knowledge-gap" | "workflow-improvement";
  title: string;
  description: string;
  confidence: number;
  relatedProducts: string[];
  relatedMemories: string[];
  priority: "low" | "medium" | "high" | "critical";
  actionable: boolean;
}

export interface EcosystemGraphNode {
  id: string;
  label: string;
  type: "product" | "capability" | "workflow" | "data-flow";
  category?: string;
  x: number;
  y: number;
  size: number;
  color: string;
  status: string;
  connections: string[];
}
