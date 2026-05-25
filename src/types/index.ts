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

/* ================================================================
   FOUNDER COMMAND MEMORY LAYER
   ================================================================ */

export type FounderSurfaceType =
  | "unresolved-priority"
  | "forgotten-discussion"
  | "linked-opportunity"
  | "paused-project"
  | "incomplete-workflow"
  | "stale-relationship"
  | "strategic-continuity";

export interface FounderDigest {
  id: string;
  date: string;
  greeting: string;
  prioritySummary: string;
  unresolvedCount: number;
  newMemories: number;
  ecosystemAlerts: number;
  sections: FounderDigestSection[];
  generatedAt: string;
}

export interface FounderDigestSection {
  id: string;
  title: string;
  type: "priorities" | "decisions" | "relationships" | "ecosystem" | "continuity";
  items: FounderDigestItem[];
}

export interface FounderDigestItem {
  id: string;
  content: string;
  importance: "low" | "medium" | "high" | "critical";
  relatedMemoryIds: string[];
  relatedProductIds?: string[];
  actionRequired: boolean;
  timestamp?: string;
}

export interface StrategicResurface {
  id: string;
  type: FounderSurfaceType;
  title: string;
  reason: string;
  context: string;
  originalMemoryId: string;
  relatedMemoryIds: string[];
  relatedProductIds: string[];
  surfacedAt: string;
  originalDate: string;
  daysSinceOriginal: number;
  urgency: "low" | "medium" | "high" | "critical";
  dismissed: boolean;
}

export interface ContinuityReminder {
  id: string;
  title: string;
  description: string;
  category: "project" | "relationship" | "decision" | "workflow" | "strategic";
  linkedMemoryIds: string[];
  linkedProductIds: string[];
  lastActivityDate: string;
  daysSinceActivity: number;
  suggestedAction: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "active" | "snoozed" | "resolved";
}

export interface FounderDecisionLog {
  id: string;
  title: string;
  decision: string;
  rationale: string;
  context: string;
  madeAt: string;
  impact: "low" | "medium" | "high" | "critical";
  status: "active" | "superseded" | "reversed" | "pending-review";
  linkedMemoryIds: string[];
  linkedProductIds: string[];
  linkedPeople: string[];
  outcome?: string;
  reviewDate?: string;
}

export interface ExecutiveContinuitySummary {
  id: string;
  title: string;
  timeRange: { start: string; end: string };
  narrative: string;
  keyDecisions: string[];
  unresolvedItems: string[];
  strategicShifts: string[];
  relationshipChanges: string[];
  ecosystemUpdates: string[];
  confidence: number;
  generatedAt: string;
}

/* ================================================================
   IDENTITY & ACCESS INFRASTRUCTURE
   ================================================================ */

export type IdentityStatus = "active" | "suspended" | "pending" | "deactivated";
export type MfaMethod = "totp" | "sms" | "email" | "hardware-key" | "biometric";
export type CredentialType = "password" | "api-key" | "oauth-token" | "certificate" | "ssh-key" | "recovery-code" | "infra-secret";

export interface IdentityProfile {
  id: string;
  displayName: string;
  email: string;
  role: string;
  department: string;
  status: IdentityStatus;
  avatar?: string;
  mfaEnabled: boolean;
  mfaMethods: MfaMethod[];
  lastLogin: string;
  createdAt: string;
  trustedDevices: TrustedDevice[];
  activeSessions: IdentitySession[];
  securityScore: number;
  permissions: string[];
  workspaceIds: string[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  type: "desktop" | "mobile" | "tablet" | "server" | "ai-agent";
  os: string;
  browser?: string;
  lastActive: string;
  location?: string;
  trusted: boolean;
  fingerprint: string;
}

export interface IdentitySession {
  id: string;
  identityId: string;
  deviceId: string;
  ipAddress: string;
  location?: string;
  startedAt: string;
  lastActivity: string;
  status: "active" | "idle" | "expired";
  userAgent?: string;
}

export interface AccessRole {
  id: string;
  name: string;
  description: string;
  level: "system" | "organization" | "workspace" | "project" | "ai-agent";
  permissions: Permission[];
  memberCount: number;
  createdAt: string;
  isSystem: boolean;
  color: string;
}

export interface Permission {
  id: string;
  resource: string;
  actions: ("read" | "write" | "delete" | "admin" | "execute")[];
  scope: "global" | "organization" | "workspace" | "project";
  conditions?: string;
}

export interface StoredCredential {
  id: string;
  name: string;
  type: CredentialType;
  service: string;
  username?: string;
  encrypted: boolean;
  strength?: "weak" | "fair" | "strong" | "excellent";
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  lastUsed?: string;
  usageCount: number;
  rotationDue?: string;
  tags: string[];
  notes?: string;
  linkedProductId?: string;
}

export interface AccessEvent {
  id: string;
  type: "login" | "logout" | "failed-login" | "permission-change" | "credential-access" | "mfa-challenge" | "session-created" | "anomaly" | "key-rotation";
  identityId: string;
  identityName: string;
  description: string;
  ipAddress: string;
  location?: string;
  deviceInfo?: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
  resolved: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "recovery-contact" | "delegated-admin" | "legal-custodian" | "operational-backup";
  accessLevel: "full" | "limited" | "read-only" | "emergency-only";
  activationCondition: string;
  verified: boolean;
  addedAt: string;
  lastVerified?: string;
}

export interface SecurityPosture {
  overallScore: number;
  mfaAdoption: number;
  credentialHealth: number;
  deviceTrust: number;
  accessHygiene: number;
  anomalyRate: number;
  lastAudit?: string;
  recommendations: string[];
}

/* ================================================================
   SECURE AI MEMORY GOVERNANCE LAYER
   ================================================================ */

export type MemoryClassification = "public" | "internal" | "confidential" | "restricted" | "founder-only" | "legal-sensitive" | "infrastructure-sensitive";

export interface GovernedMemory {
  id: string;
  title: string;
  summary: string;
  classification: MemoryClassification;
  owner: string;
  zone: string;
  createdAt: string;
  lastAccessed?: string;
  accessCount: number;
  aiAccessCount: number;
  retentionPolicyId?: string;
  expiresAt?: string;
  locked: boolean;
  redacted: boolean;
  tags: string[];
  linkedProductIds: string[];
}

export interface MemoryAccessRule {
  id: string;
  name: string;
  description: string;
  classification: MemoryClassification;
  allowedRoles: string[];
  allowedIdentities: string[];
  aiAccess: "full" | "summary-only" | "metadata-only" | "denied";
  recallLimit?: number;
  contextualConditions?: string;
  requiresMfa: boolean;
  auditRequired: boolean;
  active: boolean;
}

export interface MemoryRetentionPolicy {
  id: string;
  name: string;
  description: string;
  classification: MemoryClassification;
  retentionDays: number | null;
  autoArchive: boolean;
  autoDelete: boolean;
  legalHold: boolean;
  archiveAfterDays?: number;
  deleteAfterDays?: number;
  continuityExempt: boolean;
  active: boolean;
}

export interface MemoryAuditEntry {
  id: string;
  memoryId: string;
  memoryTitle: string;
  action: "access" | "ai-recall" | "classification-change" | "redaction" | "lock" | "unlock" | "archive" | "delete" | "export" | "share";
  performedBy: string;
  performedByType: "human" | "ai-agent" | "system";
  classification: MemoryClassification;
  timestamp: string;
  details: string;
  ipAddress?: string;
  approved: boolean;
}

export interface FounderProtectionZone {
  id: string;
  name: string;
  description: string;
  classification: MemoryClassification;
  memoryCount: number;
  locked: boolean;
  aiAccessPolicy: "denied" | "summary-only" | "metadata-only";
  accessibleBy: string[];
  emergencyUnlockContacts: string[];
  createdAt: string;
  lastModified: string;
}

export interface GovernanceStats {
  totalMemories: number;
  classificationBreakdown: Record<MemoryClassification, number>;
  lockedMemories: number;
  redactedMemories: number;
  aiAccessEvents: number;
  humanAccessEvents: number;
  retentionPolicies: number;
  expiringWithin30Days: number;
  founderZones: number;
  complianceScore: number;
}
