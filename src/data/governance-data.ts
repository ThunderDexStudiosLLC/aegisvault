import type {
  GovernedMemory, MemoryAccessRule, MemoryRetentionPolicy,
  MemoryAuditEntry, FounderProtectionZone, GovernanceStats,
} from "@/types";

/* ================================================================
   GOVERNED MEMORIES
   ================================================================ */

export const governedMemories: GovernedMemory[] = [
  { id: "gm-1", title: "AegisVault Architecture Decision — Next.js + Supabase Stack", summary: "Core architecture selection for AegisVault platform. Evaluated Firebase, Supabase, and PlanetScale. Selected Supabase for pgvector, RLS, and real-time capabilities.", classification: "internal", owner: "Brendon Kahmann", zone: "Engineering", createdAt: "2026-04-05T08:00:00Z", lastAccessed: "2026-05-25T04:00:00Z", accessCount: 34, aiAccessCount: 12, retentionPolicyId: "rp-2", locked: false, redacted: false, tags: ["architecture", "stack", "aegisvault"], linkedProductIds: ["ep-aegisvault"] },
  { id: "gm-2", title: "Ecosystem Intelligence Strategy — Everything Connects", summary: "Strategic vision for interconnected intelligence layer across all KahmannAI products. Positions cross-product data flows as primary competitive moat.", classification: "confidential", owner: "Brendon Kahmann", zone: "Strategy", createdAt: "2026-04-20T22:00:00Z", lastAccessed: "2026-05-24T18:00:00Z", accessCount: 18, aiAccessCount: 6, retentionPolicyId: "rp-3", locked: false, redacted: false, tags: ["strategy", "ecosystem", "competitive-moat"], linkedProductIds: ["ep-aegisvault", "ep-aegisosai"] },
  { id: "gm-3", title: "Microsoft Partnership Discussion — Azure AI Integration", summary: "Meeting with James Morrison exploring AegisOSAI + Azure AI services partnership. Discussed shared model hosting, enterprise distribution, and civic AI co-development.", classification: "restricted", owner: "Brendon Kahmann", zone: "Partnerships", createdAt: "2026-04-28T10:00:00Z", lastAccessed: "2026-05-20T14:00:00Z", accessCount: 8, aiAccessCount: 2, retentionPolicyId: "rp-4", locked: false, redacted: false, tags: ["microsoft", "partnership", "azure"], linkedProductIds: ["ep-aegisosai"] },
  { id: "gm-4", title: "Series A Fundraising — Horizon Ventures Discussion", summary: "Victoria Chen expressed interest in KahmannAI ecosystem thesis at $8M valuation. Focus on AegisVault + AegisOSAI as core products. Follow-up deck requested.", classification: "founder-only", owner: "Brendon Kahmann", zone: "Fundraising", createdAt: "2026-05-03T14:00:00Z", lastAccessed: "2026-05-15T10:00:00Z", accessCount: 5, aiAccessCount: 0, locked: true, redacted: false, tags: ["fundraising", "series-a", "investors"], linkedProductIds: ["ep-aegisvault", "ep-aegisosai"] },
  { id: "gm-5", title: "Security Architecture Review — Auth Layer Audit", summary: "Sarah Chen identified that 4 products implement separate auth flows. Recommended centralization through AegisOSAI plugin system. Security surface area flagged.", classification: "infrastructure-sensitive", owner: "Sarah Chen", zone: "Security", createdAt: "2026-05-15T11:00:00Z", lastAccessed: "2026-05-24T16:00:00Z", accessCount: 14, aiAccessCount: 4, retentionPolicyId: "rp-5", locked: false, redacted: false, tags: ["security", "auth", "infrastructure"], linkedProductIds: ["ep-aegisosai", "ep-aegisvault"] },
  { id: "gm-6", title: "AegisPay Revenue Model & Pricing Strategy", summary: "Internal pricing analysis for AegisPay. Includes margin calculations, competitor pricing, and multi-currency fee structure. Stripe Connect vs. custom integration analysis.", classification: "confidential", owner: "Brendon Kahmann", zone: "Finance", createdAt: "2026-05-10T16:00:00Z", lastAccessed: "2026-05-22T09:00:00Z", accessCount: 11, aiAccessCount: 3, retentionPolicyId: "rp-3", locked: false, redacted: false, tags: ["pricing", "revenue", "aegispay"], linkedProductIds: ["ep-aegispay"] },
  { id: "gm-7", title: "Employee Compensation Framework — Q2 2026", summary: "Salary bands, equity allocation, and performance bonus structure for all team members. Includes comparison with market rates.", classification: "founder-only", owner: "Brendon Kahmann", zone: "HR", createdAt: "2026-04-01T09:00:00Z", lastAccessed: "2026-05-01T14:00:00Z", accessCount: 3, aiAccessCount: 0, locked: true, redacted: false, tags: ["compensation", "hr", "equity"], linkedProductIds: [] },
  { id: "gm-8", title: "Legal Agreement — IronReserve Holdings Operating Terms", summary: "Operating agreement for IronReserve Holdings LLC including member interests, profit distribution, and governance provisions.", classification: "legal-sensitive", owner: "Brendon Kahmann", zone: "Legal", createdAt: "2026-03-15T08:00:00Z", accessCount: 2, aiAccessCount: 0, retentionPolicyId: "rp-6", locked: true, redacted: false, tags: ["legal", "operating-agreement", "governance"], linkedProductIds: [] },
  { id: "gm-9", title: "Production Infrastructure — Server Configuration & Secrets", summary: "Complete server topology, database connection strings, API key inventory, and deployment pipeline configuration for production environment.", classification: "infrastructure-sensitive", owner: "Alex Rivera", zone: "Infrastructure", createdAt: "2026-04-05T08:00:00Z", lastAccessed: "2026-05-24T22:00:00Z", accessCount: 27, aiAccessCount: 0, retentionPolicyId: "rp-5", locked: true, redacted: true, tags: ["infrastructure", "servers", "secrets"], linkedProductIds: ["ep-forgeops"] },
  { id: "gm-10", title: "CivicOps Pilot Municipality Evaluation", summary: "Comparative analysis of 3 candidate municipalities for CivicOps AI pilot. Includes demographic data, technology readiness assessment, and political landscape analysis.", classification: "restricted", owner: "Brendon Kahmann", zone: "CivicOps", createdAt: "2026-05-16T09:00:00Z", lastAccessed: "2026-05-23T11:00:00Z", accessCount: 9, aiAccessCount: 3, locked: false, redacted: false, tags: ["civicops", "pilot", "municipal"], linkedProductIds: ["ep-civicops"] },
  { id: "gm-11", title: "ForgeOps Deployment Metrics — May 2026", summary: "Deployment statistics, uptime metrics, failure analysis, and performance benchmarks for ForgeOps AI managed infrastructure.", classification: "internal", owner: "Marcus Liu", zone: "Engineering", createdAt: "2026-05-20T10:00:00Z", lastAccessed: "2026-05-25T03:00:00Z", accessCount: 22, aiAccessCount: 15, retentionPolicyId: "rp-2", locked: false, redacted: false, tags: ["forgeops", "metrics", "deployment"], linkedProductIds: ["ep-forgeops"] },
  { id: "gm-12", title: "AI Agent Behavioral Guidelines — AegisOSAI v0.9", summary: "Operational boundaries, memory access policies, and behavioral constraints for AegisOSAI orchestration agent. Defines what the AI can and cannot recall autonomously.", classification: "restricted", owner: "Brendon Kahmann", zone: "AI Governance", createdAt: "2026-05-01T00:00:00Z", lastAccessed: "2026-05-25T04:30:00Z", accessCount: 16, aiAccessCount: 8, locked: false, redacted: false, tags: ["ai-governance", "agent", "behavioral"], linkedProductIds: ["ep-aegisosai"] },
  { id: "gm-13", title: "Customer Communication Logs — CallAxisAI", summary: "Aggregated communication patterns, sentiment analysis, and key relationship insights from CallAxisAI platform interactions.", classification: "internal", owner: "Maya Patel", zone: "Operations", createdAt: "2026-05-18T14:00:00Z", lastAccessed: "2026-05-24T15:00:00Z", accessCount: 19, aiAccessCount: 11, retentionPolicyId: "rp-2", locked: false, redacted: false, tags: ["communications", "callaxis", "sentiment"], linkedProductIds: ["ep-callaxis"] },
  { id: "gm-14", title: "Founder Personal Strategic Notes — Vision 2027", summary: "Personal strategic reflections on company direction, product priorities, and life-work integration plans for 2027.", classification: "founder-only", owner: "Brendon Kahmann", zone: "Founder Private", createdAt: "2026-05-20T23:00:00Z", accessCount: 1, aiAccessCount: 0, locked: true, redacted: false, tags: ["personal", "vision", "strategy"], linkedProductIds: [] },
  { id: "gm-15", title: "ThunderCode Model Training Data Sources", summary: "Documentation of training data sources, licensing agreements, and data provenance for ThunderCode code generation models.", classification: "legal-sensitive", owner: "Marcus Liu", zone: "Legal", createdAt: "2026-05-05T10:00:00Z", lastAccessed: "2026-05-18T16:00:00Z", accessCount: 7, aiAccessCount: 1, retentionPolicyId: "rp-6", locked: false, redacted: false, tags: ["thundercode", "training-data", "licensing"], linkedProductIds: ["ep-thundercode"] },
  { id: "gm-16", title: "Weekly Team Standup Notes — May 19-25", summary: "Engineering standup summaries including progress, blockers, and sprint objectives across all active projects.", classification: "public", owner: "Alex Rivera", zone: "Engineering", createdAt: "2026-05-19T09:00:00Z", lastAccessed: "2026-05-25T02:00:00Z", accessCount: 42, aiAccessCount: 18, retentionPolicyId: "rp-1", locked: false, redacted: false, tags: ["standup", "engineering", "weekly"], linkedProductIds: [] },
];

/* ================================================================
   MEMORY ACCESS RULES
   ================================================================ */

export const memoryAccessRules: MemoryAccessRule[] = [
  { id: "mar-1", name: "Public Memory Access", description: "Open access for all authenticated users and AI agents. No restrictions on recall or summarization.", classification: "public", allowedRoles: ["Founder", "Executive", "Security Admin", "Engineer", "Operations", "AI Agent", "Viewer"], allowedIdentities: [], aiAccess: "full", requiresMfa: false, auditRequired: false, active: true },
  { id: "mar-2", name: "Internal Memory Access", description: "Access for all team members. AI agents can recall and summarize. External viewers excluded.", classification: "internal", allowedRoles: ["Founder", "Executive", "Security Admin", "Engineer", "Operations", "AI Agent"], allowedIdentities: [], aiAccess: "full", requiresMfa: false, auditRequired: true, active: true },
  { id: "mar-3", name: "Confidential Memory Access", description: "Restricted to executives and designated individuals. AI can produce summaries but not raw recall.", classification: "confidential", allowedRoles: ["Founder", "Executive", "Security Admin"], allowedIdentities: [], aiAccess: "summary-only", recallLimit: 10, requiresMfa: true, auditRequired: true, active: true },
  { id: "mar-4", name: "Restricted Memory Access", description: "Limited to founder and explicitly named individuals. AI access metadata only — no content recall.", classification: "restricted", allowedRoles: ["Founder"], allowedIdentities: ["id-sarah"], aiAccess: "metadata-only", recallLimit: 5, contextualConditions: "Requires active session from trusted device", requiresMfa: true, auditRequired: true, active: true },
  { id: "mar-5", name: "Founder-Only Memory Access", description: "Exclusively accessible by the founder. All AI access denied. No summarization, no recall, no metadata extraction.", classification: "founder-only", allowedRoles: ["Founder"], allowedIdentities: [], aiAccess: "denied", requiresMfa: true, auditRequired: true, active: true },
  { id: "mar-6", name: "Legal-Sensitive Memory Access", description: "Legal counsel and founder only. AI access denied. Legal hold may apply preventing deletion.", classification: "legal-sensitive", allowedRoles: ["Founder"], allowedIdentities: [], aiAccess: "denied", contextualConditions: "Legal review required before sharing", requiresMfa: true, auditRequired: true, active: true },
  { id: "mar-7", name: "Infrastructure-Sensitive Memory Access", description: "Engineering leads and security team. AI gets metadata only to prevent secret exposure.", classification: "infrastructure-sensitive", allowedRoles: ["Founder", "Security Admin"], allowedIdentities: ["id-alex", "id-marcus"], aiAccess: "metadata-only", requiresMfa: true, auditRequired: true, active: true },
];

/* ================================================================
   RETENTION POLICIES
   ================================================================ */

export const memoryRetentionPolicies: MemoryRetentionPolicy[] = [
  { id: "rp-1", name: "Standard Operational", description: "General operational memory. Auto-archive after 180 days. Delete after 2 years unless continuity-exempt.", classification: "public", retentionDays: 730, autoArchive: true, autoDelete: true, legalHold: false, archiveAfterDays: 180, deleteAfterDays: 730, continuityExempt: false, active: true },
  { id: "rp-2", name: "Internal Knowledge", description: "Team knowledge and engineering documentation. Archive after 1 year. No auto-delete — operational continuity exemption.", classification: "internal", retentionDays: null, autoArchive: true, autoDelete: false, legalHold: false, archiveAfterDays: 365, continuityExempt: true, active: true },
  { id: "rp-3", name: "Confidential Intelligence", description: "Strategic and competitive intelligence. No auto-archive or delete. Manual review required annually.", classification: "confidential", retentionDays: null, autoArchive: false, autoDelete: false, legalHold: false, continuityExempt: true, active: true },
  { id: "rp-4", name: "Restricted — Partnership", description: "Partnership and vendor intelligence. Retained indefinitely during active relationship. 90-day review cycle after relationship ends.", classification: "restricted", retentionDays: null, autoArchive: false, autoDelete: false, legalHold: false, continuityExempt: true, active: true },
  { id: "rp-5", name: "Infrastructure Retention", description: "Infrastructure secrets and configurations. No expiration. Redaction controls on sensitive fields. Audit every 30 days.", classification: "infrastructure-sensitive", retentionDays: null, autoArchive: false, autoDelete: false, legalHold: false, continuityExempt: true, active: true },
  { id: "rp-6", name: "Legal Hold — Indefinite", description: "Legal documents under hold. Cannot be archived, deleted, or modified without legal review. Indefinite retention.", classification: "legal-sensitive", retentionDays: null, autoArchive: false, autoDelete: false, legalHold: true, continuityExempt: true, active: true },
];

/* ================================================================
   MEMORY AUDIT LOG
   ================================================================ */

export const memoryAuditLog: MemoryAuditEntry[] = [
  { id: "ma-1", memoryId: "gm-16", memoryTitle: "Weekly Team Standup Notes", action: "ai-recall", performedBy: "AegisOSAI Agent", performedByType: "ai-agent", classification: "public", timestamp: "2026-05-25T04:30:00Z", details: "AI recalled standup notes for daily orchestration cycle. Full content access.", approved: true },
  { id: "ma-2", memoryId: "gm-11", memoryTitle: "ForgeOps Deployment Metrics", action: "ai-recall", performedBy: "AegisOSAI Agent", performedByType: "ai-agent", classification: "internal", timestamp: "2026-05-25T03:00:00Z", details: "AI recalled deployment metrics for ecosystem health assessment. Full content access.", approved: true },
  { id: "ma-3", memoryId: "gm-1", memoryTitle: "AegisVault Architecture Decision", action: "access", performedBy: "Brendon Kahmann", performedByType: "human", classification: "internal", timestamp: "2026-05-25T04:00:00Z", details: "Founder accessed architecture decision memory for reference.", ipAddress: "73.162.xx.xx", approved: true },
  { id: "ma-4", memoryId: "gm-12", memoryTitle: "AI Agent Behavioral Guidelines", action: "ai-recall", performedBy: "AegisOSAI Agent", performedByType: "ai-agent", classification: "restricted", timestamp: "2026-05-25T04:30:00Z", details: "AI recalled behavioral guidelines — metadata only per governance policy. Content access denied.", approved: true },
  { id: "ma-5", memoryId: "gm-4", memoryTitle: "Series A Fundraising", action: "access", performedBy: "Brendon Kahmann", performedByType: "human", classification: "founder-only", timestamp: "2026-05-24T18:00:00Z", details: "Founder accessed fundraising memory. MFA verified via hardware key.", ipAddress: "73.162.xx.xx", approved: true },
  { id: "ma-6", memoryId: "gm-9", memoryTitle: "Production Infrastructure", action: "redaction", performedBy: "Sarah Chen", performedByType: "human", classification: "infrastructure-sensitive", timestamp: "2026-05-24T16:00:00Z", details: "Security lead redacted database connection strings and API keys from memory summary.", ipAddress: "198.51.xx.xx", approved: true },
  { id: "ma-7", memoryId: "gm-3", memoryTitle: "Microsoft Partnership Discussion", action: "ai-recall", performedBy: "AegisOSAI Agent", performedByType: "ai-agent", classification: "restricted", timestamp: "2026-05-24T14:00:00Z", details: "AI attempted full recall on restricted partnership memory. Access degraded to metadata-only per governance policy.", approved: true },
  { id: "ma-8", memoryId: "gm-7", memoryTitle: "Employee Compensation Framework", action: "lock", performedBy: "System", performedByType: "system", classification: "founder-only", timestamp: "2026-05-20T00:00:00Z", details: "Auto-locked by governance policy. Founder-only classification enforced.", approved: true },
  { id: "ma-9", memoryId: "gm-6", memoryTitle: "AegisPay Revenue Model", action: "classification-change", performedBy: "Brendon Kahmann", performedByType: "human", classification: "confidential", timestamp: "2026-05-18T10:00:00Z", details: "Upgraded from internal to confidential. Revenue modeling data contains competitive intelligence.", ipAddress: "73.162.xx.xx", approved: true },
  { id: "ma-10", memoryId: "gm-14", memoryTitle: "Founder Personal Strategic Notes", action: "lock", performedBy: "Brendon Kahmann", performedByType: "human", classification: "founder-only", timestamp: "2026-05-20T23:00:00Z", details: "Manually locked. Personal strategic reflections — no AI access permitted.", ipAddress: "73.162.xx.xx", approved: true },
  { id: "ma-11", memoryId: "gm-13", memoryTitle: "Customer Communication Logs", action: "ai-recall", performedBy: "AegisOSAI Agent", performedByType: "ai-agent", classification: "internal", timestamp: "2026-05-24T15:00:00Z", details: "AI recalled communication patterns for customer intelligence pipeline. Full content access.", approved: true },
  { id: "ma-12", memoryId: "gm-2", memoryTitle: "Ecosystem Intelligence Strategy", action: "share", performedBy: "Brendon Kahmann", performedByType: "human", classification: "confidential", timestamp: "2026-05-22T14:00:00Z", details: "Shared summary with Alex Rivera for CTO strategic alignment. Full content withheld per confidential policy.", ipAddress: "73.162.xx.xx", approved: true },
];

/* ================================================================
   FOUNDER PROTECTION ZONES
   ================================================================ */

export const founderProtectionZones: FounderProtectionZone[] = [
  { id: "fpz-1", name: "Fundraising & Investor Relations", description: "All fundraising conversations, investor decks, valuation discussions, and cap table information. Exclusively founder-accessible.", classification: "founder-only", memoryCount: 4, locked: true, aiAccessPolicy: "denied", accessibleBy: ["Brendon Kahmann"], emergencyUnlockContacts: ["Alex Rivera"], createdAt: "2026-03-15T08:00:00Z", lastModified: "2026-05-20T14:00:00Z" },
  { id: "fpz-2", name: "Compensation & HR", description: "Employee compensation data, equity allocations, performance reviews, and HR-sensitive personnel matters.", classification: "founder-only", memoryCount: 3, locked: true, aiAccessPolicy: "denied", accessibleBy: ["Brendon Kahmann"], emergencyUnlockContacts: ["Alex Rivera", "Victoria Chen"], createdAt: "2026-04-01T09:00:00Z", lastModified: "2026-05-01T14:00:00Z" },
  { id: "fpz-3", name: "Legal & Governance", description: "Operating agreements, legal contracts, IP assignments, and compliance documentation.", classification: "legal-sensitive", memoryCount: 3, locked: true, aiAccessPolicy: "denied", accessibleBy: ["Brendon Kahmann"], emergencyUnlockContacts: ["Victoria Chen"], createdAt: "2026-03-15T08:00:00Z", lastModified: "2026-05-05T10:00:00Z" },
  { id: "fpz-4", name: "Strategic Vision & Personal", description: "Founder's personal strategic notes, vision documents, and private operational reflections.", classification: "founder-only", memoryCount: 2, locked: true, aiAccessPolicy: "denied", accessibleBy: ["Brendon Kahmann"], emergencyUnlockContacts: [], createdAt: "2026-04-20T22:00:00Z", lastModified: "2026-05-20T23:00:00Z" },
  { id: "fpz-5", name: "Partnership Intelligence", description: "Confidential partnership discussions, vendor evaluations, and strategic relationship intelligence.", classification: "restricted", memoryCount: 3, locked: false, aiAccessPolicy: "metadata-only", accessibleBy: ["Brendon Kahmann", "Sarah Chen"], emergencyUnlockContacts: ["Alex Rivera"], createdAt: "2026-04-28T10:00:00Z", lastModified: "2026-05-23T11:00:00Z" },
  { id: "fpz-6", name: "Infrastructure Secrets", description: "Production credentials, server configurations, and infrastructure access secrets. Redaction controls active.", classification: "infrastructure-sensitive", memoryCount: 2, locked: true, aiAccessPolicy: "denied", accessibleBy: ["Brendon Kahmann", "Alex Rivera", "Sarah Chen"], emergencyUnlockContacts: ["Alex Rivera"], createdAt: "2026-04-05T08:00:00Z", lastModified: "2026-05-24T16:00:00Z" },
];

/* ================================================================
   GOVERNANCE STATS
   ================================================================ */

export const governanceStats: GovernanceStats = {
  totalMemories: 16,
  classificationBreakdown: {
    public: 1,
    internal: 4,
    confidential: 2,
    restricted: 3,
    "founder-only": 3,
    "legal-sensitive": 2,
    "infrastructure-sensitive": 2,
  },
  lockedMemories: 5,
  redactedMemories: 1,
  aiAccessEvents: 56,
  humanAccessEvents: 127,
  retentionPolicies: 6,
  expiringWithin30Days: 0,
  founderZones: 6,
  complianceScore: 91,
};
