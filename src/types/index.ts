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

/* ================================================================
   EXECUTIVE CONTINUITY & OPERATIONAL RECOVERY
   ================================================================ */

export type CriticalAssetCategory = "domain" | "cloud" | "developer" | "payment" | "telecom" | "ai-infra" | "legal" | "credential" | "data-store";

export interface CriticalAsset {
  id: string;
  name: string;
  category: CriticalAssetCategory;
  provider: string;
  description: string;
  owner: string;
  backupOwner?: string;
  status: "operational" | "degraded" | "down" | "unknown";
  criticality: "low" | "medium" | "high" | "critical";
  lastVerified: string;
  renewalDate?: string;
  dependencies: string[];
  linkedProductIds: string[];
  recoveryProcedureId?: string;
  notes?: string;
}

export interface RecoveryProcedure {
  id: string;
  title: string;
  category: "access-restoration" | "data-recovery" | "infrastructure" | "escalation" | "security-incident" | "business-continuity";
  priority: "low" | "medium" | "high" | "critical";
  estimatedTime: string;
  steps: RecoveryStep[];
  contactChain: string[];
  lastTested?: string;
  lastUpdated: string;
  linkedAssetIds: string[];
}

export interface RecoveryStep {
  order: number;
  action: string;
  responsible: string;
  estimatedMinutes: number;
  requiresApproval: boolean;
  notes?: string;
}

export interface ContinuityIncident {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "investigating" | "mitigated" | "resolved" | "post-mortem";
  reportedAt: string;
  resolvedAt?: string;
  description: string;
  affectedAssets: string[];
  affectedProducts: string[];
  recoveryProcedureId?: string;
  tasks: IncidentTask[];
  timeline: IncidentEvent[];
}

export interface IncidentTask {
  id: string;
  action: string;
  assignee: string;
  status: "pending" | "in-progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "critical";
}

export interface IncidentEvent {
  timestamp: string;
  actor: string;
  action: string;
}

export interface InfraNode {
  id: string;
  label: string;
  category: CriticalAssetCategory;
  status: "operational" | "degraded" | "down";
  criticality: "low" | "medium" | "high" | "critical";
  x: number;
  y: number;
  dependencies: string[];
  singlePointOfFailure: boolean;
}

export interface ContinuityStats {
  totalAssets: number;
  operationalAssets: number;
  degradedAssets: number;
  criticalAssets: number;
  recoveryProcedures: number;
  testedProcedures: number;
  activeIncidents: number;
  resolvedIncidents: number;
  singlePointsOfFailure: number;
  overallReadiness: number;
}

/* ================================================================
   IRONFRAME SECURITY INTELLIGENCE
   ================================================================ */

export type RiskSeverity = "info" | "low" | "medium" | "high" | "critical";
export type RiskCategory = "credential" | "access" | "infrastructure" | "ai-governance" | "insider" | "compliance" | "network";

export interface SecurityRisk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  severity: RiskSeverity;
  status: "active" | "mitigated" | "accepted" | "investigating";
  detectedAt: string;
  affectedEntities: string[];
  recommendation: string;
  mitigatedAt?: string;
}

export interface SecurityAnomaly {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  severity: RiskSeverity;
  detectedAt: string;
  actor: string;
  actorType: "human" | "ai-agent" | "system" | "unknown";
  sourceIp?: string;
  location?: string;
  resolved: boolean;
}

export interface IdentityRisk {
  id: string;
  identityName: string;
  riskType: "weak-credential" | "stale-access" | "excessive-permissions" | "shared-account" | "unusual-behavior" | "no-mfa" | "dormant-account";
  severity: RiskSeverity;
  description: string;
  detectedAt: string;
  recommendation: string;
}

export interface PermissionDrift {
  id: string;
  identity: string;
  role: string;
  driftType: "privilege-escalation" | "unused-permissions" | "role-creep" | "orphaned-access" | "cross-boundary";
  description: string;
  permissionsAffected: string[];
  detectedAt: string;
  severity: RiskSeverity;
}

export interface AiGovernanceEvent {
  id: string;
  agentName: string;
  action: string;
  category: "memory-access" | "permission-usage" | "restricted-recall" | "unauthorized-pattern" | "scope-violation" | "data-exfiltration-check";
  severity: RiskSeverity;
  timestamp: string;
  details: string;
  blocked: boolean;
  policyRef?: string;
}

export interface ThreatIntelItem {
  id: string;
  title: string;
  source: string;
  category: "advisory" | "provider-incident" | "infrastructure-alert" | "ecosystem-risk" | "vulnerability" | "breach-report";
  severity: RiskSeverity;
  publishedAt: string;
  summary: string;
  affectedSystems: string[];
  actionRequired: boolean;
  acknowledged: boolean;
}

export interface SecurityGraphNode {
  id: string;
  label: string;
  type: "system" | "user" | "permission" | "dependency" | "trust";
  status: "secure" | "warning" | "critical";
  x: number;
  y: number;
  connections: string[];
}

export interface IronFrameStats {
  overallScore: number;
  activeRisks: number;
  criticalRisks: number;
  anomaliesDetected: number;
  identityRisks: number;
  permissionDrifts: number;
  aiGovernanceEvents: number;
  blockedAiActions: number;
  threatIntelItems: number;
  unacknowledgedThreats: number;
}

/* ================================================================
   WORKSPACE ARCHITECTURE
   ================================================================ */

export type WorkspaceType = "personal" | "executive" | "team" | "department" | "enterprise" | "infrastructure" | "restricted" | "founder-private";

export type WorkspaceRole = "founder" | "executive" | "administrator" | "security-officer" | "analyst" | "operations" | "ai-agent" | "viewer" | "restricted";

export type WorkspaceSecurityState = "secure" | "monitoring" | "elevated-risk" | "lockdown" | "executive-mode" | "governance-review";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  type: WorkspaceType;
  description: string;
  securityState: WorkspaceSecurityState;
  encryptionScope: string;
  governancePolicy: string;
  createdAt: string;
  lastAccessedAt: string;
  owner: string;
  memberCount: number;
  aiAgentCount: number;
  activeIntegrations: number;
  securityScore: number;
  tags: string[];
  parentWorkspaceId?: string;
  recoveryPolicy: string;
  aiAccessLevel: "full" | "restricted" | "metadata-only" | "denied";
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  workspaceId: string;
  joinedAt: string;
  lastActiveAt: string;
  mfaEnabled: boolean;
  accessLevel: "full" | "read-only" | "restricted" | "emergency-only";
  permissions: WorkspacePermission[];
  status: "active" | "inactive" | "suspended" | "pending";
}

export interface WorkspacePermission {
  resource: string;
  actions: ("read" | "write" | "delete" | "admin" | "export" | "share")[];
  scope: "workspace" | "department" | "global";
  expiresAt?: string;
}

export interface WorkspaceAiAgent {
  id: string;
  name: string;
  type: "orchestrator" | "analyst" | "security" | "operations" | "research" | "communications";
  workspaceId: string;
  identityScope: string;
  permissionBoundary: string;
  memoryRestriction: "full" | "workspace-only" | "summary-only" | "denied";
  status: "active" | "paused" | "restricted" | "suspended";
  lastAction: string;
  lastActionAt: string;
  totalActions: number;
  totalMemoryAccess: number;
  totalEscalations: number;
  governanceCompliance: number;
  auditLogCount: number;
}

export interface WorkspaceAuditEvent {
  id: string;
  workspaceId: string;
  actor: string;
  actorType: "human" | "ai-agent" | "system";
  action: string;
  resource: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
  details?: string;
}

export interface CollaborationItem {
  id: string;
  type: "encrypted-note" | "shared-entry" | "discussion" | "comment" | "approval" | "handoff" | "acknowledgement";
  title: string;
  content: string;
  workspaceId: string;
  author: string;
  participants: string[];
  status: "active" | "pending" | "approved" | "completed" | "rejected";
  createdAt: string;
  updatedAt: string;
  encrypted: boolean;
  priority: "low" | "medium" | "high" | "critical";
}

export interface WorkspaceGraphNode {
  id: string;
  label: string;
  type: "workspace" | "member" | "agent" | "role" | "integration";
  status: "active" | "warning" | "restricted";
  x: number;
  y: number;
  connections: string[];
  workspaceId?: string;
}

export interface WorkspaceStats {
  totalWorkspaces: number;
  activeMembers: number;
  aiAgents: number;
  securityScore: number;
  activeCollaborations: number;
  pendingApprovals: number;
  auditEventsToday: number;
  encryptedNotes: number;
  workspacesInLockdown: number;
  governanceCompliance: number;
}

/* ================================================================
   ENCRYPTION & TRUST INFRASTRUCTURE
   ================================================================ */

export type EncryptionAlgorithm = "AES-256-GCM" | "AES-256-CBC" | "ChaCha20-Poly1305" | "RSA-4096" | "Ed25519" | "X25519";
export type KeyType = "master" | "workspace" | "field" | "backup" | "session" | "ai-memory" | "audit" | "recovery";
export type KeyStatus = "active" | "rotating" | "expired" | "revoked" | "compromised";
export type DeviceTrustLevel = "trusted" | "verified" | "untrusted" | "blocked";
export type SessionRisk = "low" | "medium" | "high" | "critical";
export type LockdownLevel = "none" | "partial" | "full" | "emergency";

export interface EncryptionKey {
  id: string;
  name: string;
  type: KeyType;
  algorithm: EncryptionAlgorithm;
  status: KeyStatus;
  createdAt: string;
  lastRotatedAt: string;
  expiresAt: string;
  rotationDueDays: number;
  bitStrength: number;
  usageCount: number;
  scope: string;
  derivedFrom?: string;
  exposureRisk: "none" | "low" | "medium" | "high";
  hardwareProtected: boolean;
}

export interface TrustInfraDevice {
  id: string;
  name: string;
  type: "desktop" | "mobile" | "tablet" | "server" | "hardware-key";
  trustLevel: DeviceTrustLevel;
  owner: string;
  os: string;
  browser?: string;
  lastSeen: string;
  firstSeen: string;
  location: string;
  ipAddress: string;
  trustScore: number;
  biometricCapable: boolean;
  hardwareKeyBound: boolean;
  fingerprint: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  deviceId: string;
  deviceName: string;
  startedAt: string;
  lastActivity: string;
  expiresAt: string;
  risk: SessionRisk;
  location: string;
  ipAddress: string;
  verified: boolean;
  stepUpAuth: boolean;
  mfaVerified: boolean;
  continuousVerification: boolean;
  riskFactors: string[];
}

export interface SecurityIntelEvent {
  id: string;
  type: "suspicious-login" | "impossible-travel" | "stale-permission" | "credential-exposure" | "anomalous-behavior" | "ai-misuse" | "brute-force" | "privilege-escalation";
  severity: "info" | "warning" | "high" | "critical";
  title: string;
  description: string;
  actor?: string;
  location?: string;
  timestamp: string;
  status: "detected" | "investigating" | "mitigated" | "resolved" | "false-positive";
  automated: boolean;
  relatedEntities: string[];
}

export interface TrustScore {
  category: string;
  score: number;
  maxScore: number;
  trend: "improving" | "stable" | "declining";
  factors: { name: string; impact: "positive" | "negative" | "neutral"; detail: string }[];
}

export interface LockdownState {
  level: LockdownLevel;
  activatedAt?: string;
  activatedBy?: string;
  reason?: string;
  affectedWorkspaces: string[];
  revokedSessions: number;
  frozenAiAgents: number;
  frozenCredentials: number;
  estimatedResolution?: string;
}

export interface EncryptionStats {
  totalKeys: number;
  activeKeys: number;
  rotationsDue: number;
  trustedDevices: number;
  activeSessions: number;
  highRiskSessions: number;
  overallTrustScore: number;
  encryptionCoverage: number;
  securityEvents24h: number;
  lockdownLevel: LockdownLevel;
  zeroTrustCompliance: number;
  keyHealthScore: number;
}

/* ================================================================
   OPERATIONAL INTELLIGENCE TIMELINE & RECALL
   ================================================================ */

export type TimelineCategory = "decision" | "incident" | "workflow" | "access" | "milestone" | "ai-action" | "security" | "communication" | "governance" | "ecosystem";
export type OpsMemoryType = "operational" | "executive" | "legal" | "infrastructure" | "communications" | "security" | "ai-activity" | "governance" | "strategic" | "founder-private";
export type RecallScope = "related-events" | "incident-timeline" | "project-continuity" | "operational-history" | "linked-security" | "related-communications";

export interface TimelineEvent {
  id: string;
  category: TimelineCategory;
  memoryType: OpsMemoryType;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  workspaceId: string;
  severity: "info" | "warning" | "high" | "critical";
  pinned: boolean;
  encrypted: boolean;
  linkedEventIds: string[];
  tags: string[];
  aiGenerated: boolean;
  governanceCompliant: boolean;
  auditLogged: boolean;
}

export interface ContinuityThread {
  id: string;
  title: string;
  description: string;
  category: TimelineCategory;
  memoryType: OpsMemoryType;
  status: "active" | "paused" | "resolved" | "archived";
  startedAt: string;
  lastUpdatedAt: string;
  eventIds: string[];
  owner: string;
  priority: "low" | "medium" | "high" | "critical";
  aiSummary: string;
  unresolved: boolean;
}

export interface RecallQuery {
  id: string;
  scope: RecallScope;
  query: string;
  description: string;
  resultCount: number;
  lastExecutedAt: string;
  executedBy: string;
  aiAssisted: boolean;
}

export interface TimelineSnapshot {
  id: string;
  title: string;
  capturedAt: string;
  capturedBy: string;
  eventCount: number;
  threadCount: number;
  coveragePeriod: string;
  memoryTypes: OpsMemoryType[];
  encrypted: boolean;
}

export interface TimelineStats {
  totalEvents: number;
  pinnedEvents: number;
  activeThreads: number;
  unresolvedThreads: number;
  recallQueries: number;
  snapshots: number;
  eventsToday: number;
  aiGeneratedEvents: number;
  encryptedEvents: number;
  categoryCounts: Record<TimelineCategory, number>;
}

/* ================================================================
   ENTERPRISE CONSOLE
   ================================================================ */

export type ConsoleModuleId = "security" | "identity" | "workspaces" | "ai-governance" | "timeline" | "trust" | "continuity" | "audit" | "incidents" | "ecosystem";
export type ConsoleModuleStatus = "operational" | "degraded" | "warning" | "critical" | "offline";

export interface ConsoleModule {
  id: ConsoleModuleId;
  name: string;
  status: ConsoleModuleStatus;
  score: number;
  activeAlerts: number;
  lastChecked: string;
  description: string;
}

export interface ConsoleCommand {
  id: string;
  label: string;
  description: string;
  category: "security" | "identity" | "governance" | "continuity" | "audit" | "workspace" | "ai";
  severity: "standard" | "elevated" | "critical";
  requiresConfirmation: boolean;
}

export interface LiveStatusMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend: "up" | "down" | "stable";
  status: "healthy" | "warning" | "critical";
}

export interface ConsoleStats {
  overallPosture: "secure" | "monitoring" | "elevated" | "critical";
  overallScore: number;
  modulesOperational: number;
  totalModules: number;
  activeIncidents: number;
  activeSessions: number;
  activeAiAgents: number;
  pendingActions: number;
  lastFullAudit: string;
}
