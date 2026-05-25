import type {
  CriticalAsset, RecoveryProcedure, ContinuityIncident,
  InfraNode, ContinuityStats,
} from "@/types";

/* ================================================================
   CRITICAL ASSET REGISTRY
   ================================================================ */

export const criticalAssets: CriticalAsset[] = [
  { id: "ca-1", name: "aegisvault.com", category: "domain", provider: "Cloudflare", description: "Primary domain for AegisVault platform. DNS, SSL, and DDoS protection.", owner: "Brendon Kahmann", backupOwner: "Alex Rivera", status: "operational", criticality: "critical", lastVerified: "2026-05-25T04:00:00Z", renewalDate: "2027-04-15T00:00:00Z", dependencies: ["ca-3"], linkedProductIds: ["ep-aegisvault"], recoveryProcedureId: "rp-c1" },
  { id: "ca-2", name: "aegisosai.com", category: "domain", provider: "Cloudflare", description: "Primary domain for AegisOSAI platform and API endpoints.", owner: "Brendon Kahmann", backupOwner: "Alex Rivera", status: "operational", criticality: "critical", lastVerified: "2026-05-25T04:00:00Z", renewalDate: "2027-06-01T00:00:00Z", dependencies: ["ca-3"], linkedProductIds: ["ep-aegisosai"], recoveryProcedureId: "rp-c1" },
  { id: "ca-3", name: "Vercel Production", category: "cloud", provider: "Vercel", description: "Primary hosting and edge deployment for all Next.js applications. Serves AegisVault, AegisOSAI frontend.", owner: "Alex Rivera", backupOwner: "Marcus Liu", status: "operational", criticality: "critical", lastVerified: "2026-05-25T03:00:00Z", dependencies: [], linkedProductIds: ["ep-aegisvault", "ep-aegisosai"], recoveryProcedureId: "rp-c2" },
  { id: "ca-4", name: "Supabase Production", category: "data-store", provider: "Supabase", description: "Primary PostgreSQL database, authentication, real-time subscriptions, and storage. Core data layer.", owner: "Alex Rivera", backupOwner: "Marcus Liu", status: "operational", criticality: "critical", lastVerified: "2026-05-24T22:00:00Z", dependencies: [], linkedProductIds: ["ep-aegisvault", "ep-aegisosai", "ep-forgeops"], recoveryProcedureId: "rp-c3", notes: "Point-in-time recovery enabled. Daily backups to S3." },
  { id: "ca-5", name: "GitHub Organization", category: "developer", provider: "GitHub", description: "Source code repositories for all KahmannAI products. CI/CD pipelines, Actions, and package registry.", owner: "Brendon Kahmann", backupOwner: "Alex Rivera", status: "operational", criticality: "critical", lastVerified: "2026-05-25T04:30:00Z", dependencies: [], linkedProductIds: ["ep-aegisvault", "ep-aegisosai", "ep-forgeops", "ep-thundercode"], recoveryProcedureId: "rp-c4" },
  { id: "ca-6", name: "Stripe Connect", category: "payment", provider: "Stripe", description: "Payment processing, subscription management, and Connect platform for AegisPay.", owner: "Brendon Kahmann", status: "operational", criticality: "high", lastVerified: "2026-05-22T09:00:00Z", dependencies: [], linkedProductIds: ["ep-aegispay"], recoveryProcedureId: "rp-c5" },
  { id: "ca-7", name: "Twilio Communications", category: "telecom", provider: "Twilio", description: "Voice, SMS, and communication APIs powering CallAxisAI platform.", owner: "Maya Patel", backupOwner: "Alex Rivera", status: "operational", criticality: "high", lastVerified: "2026-05-24T15:00:00Z", dependencies: [], linkedProductIds: ["ep-callaxis"] },
  { id: "ca-8", name: "OpenAI API", category: "ai-infra", provider: "OpenAI", description: "GPT-4, embeddings, and AI model access for all AegisOSAI orchestration and ThunderCode generation.", owner: "Alex Rivera", backupOwner: "Marcus Liu", status: "operational", criticality: "critical", lastVerified: "2026-05-25T04:00:00Z", dependencies: [], linkedProductIds: ["ep-aegisosai", "ep-thundercode"], recoveryProcedureId: "rp-c6" },
  { id: "ca-9", name: "AWS S3 Backup", category: "cloud", provider: "AWS", description: "Backup storage for database snapshots, document archives, and disaster recovery assets.", owner: "Marcus Liu", backupOwner: "Alex Rivera", status: "operational", criticality: "high", lastVerified: "2026-05-23T00:00:00Z", dependencies: [], linkedProductIds: [], notes: "Versioning enabled. Cross-region replication to us-west-2." },
  { id: "ca-10", name: "IronReserve Holdings LLC", category: "legal", provider: "State of Delaware", description: "Operating agreement, EIN, registered agent, and corporate governance documents.", owner: "Brendon Kahmann", status: "operational", criticality: "critical", lastVerified: "2026-05-01T00:00:00Z", renewalDate: "2027-03-01T00:00:00Z", dependencies: [], linkedProductIds: [] },
  { id: "ca-11", name: "Cloudflare DNS & CDN", category: "cloud", provider: "Cloudflare", description: "DNS management, CDN, DDoS protection, and WAF for all ecosystem domains.", owner: "Alex Rivera", backupOwner: "Brendon Kahmann", status: "operational", criticality: "critical", lastVerified: "2026-05-25T04:00:00Z", dependencies: [], linkedProductIds: ["ep-aegisvault", "ep-aegisosai", "ep-callaxis"] },
  { id: "ca-12", name: "1Password Team Vault", category: "credential", provider: "1Password", description: "Team credential management. Stores shared API keys, service accounts, and infrastructure secrets.", owner: "Brendon Kahmann", backupOwner: "Sarah Chen", status: "operational", criticality: "high", lastVerified: "2026-05-24T16:00:00Z", dependencies: [], linkedProductIds: [] },
  { id: "ca-13", name: "ForgeOps Monitoring Stack", category: "ai-infra", provider: "Datadog", description: "Application performance monitoring, log aggregation, and infrastructure metrics for ForgeOps AI.", owner: "Marcus Liu", status: "degraded", criticality: "medium", lastVerified: "2026-05-24T10:00:00Z", dependencies: ["ca-3"], linkedProductIds: ["ep-forgeops"], notes: "Alert volume threshold exceeded. Configuration review needed." },
  { id: "ca-14", name: "Google Workspace", category: "cloud", provider: "Google", description: "Team email (kahmannai.com), Google Drive, Calendar, and collaboration tools.", owner: "Brendon Kahmann", status: "operational", criticality: "high", lastVerified: "2026-05-25T02:00:00Z", renewalDate: "2027-01-15T00:00:00Z", dependencies: [], linkedProductIds: [] },
];

/* ================================================================
   RECOVERY PROCEDURES
   ================================================================ */

export const recoveryProcedures: RecoveryProcedure[] = [
  {
    id: "rp-c1", title: "Domain Recovery — DNS & SSL Restoration", category: "access-restoration", priority: "critical", estimatedTime: "30 minutes",
    steps: [
      { order: 1, action: "Log in to Cloudflare dashboard with founder credentials", responsible: "Brendon Kahmann", estimatedMinutes: 2, requiresApproval: false },
      { order: 2, action: "Verify DNS records against documented configuration", responsible: "Alex Rivera", estimatedMinutes: 5, requiresApproval: false },
      { order: 3, action: "Regenerate SSL certificates if expired or compromised", responsible: "Alex Rivera", estimatedMinutes: 10, requiresApproval: true, notes: "May require domain ownership verification" },
      { order: 4, action: "Update nameservers if registrar access was compromised", responsible: "Brendon Kahmann", estimatedMinutes: 10, requiresApproval: true },
      { order: 5, action: "Verify resolution and HTTPS across all endpoints", responsible: "Marcus Liu", estimatedMinutes: 3, requiresApproval: false },
    ],
    contactChain: ["Brendon Kahmann", "Alex Rivera", "Cloudflare Support"], lastTested: "2026-04-15T00:00:00Z", lastUpdated: "2026-05-10T00:00:00Z", linkedAssetIds: ["ca-1", "ca-2"],
  },
  {
    id: "rp-c2", title: "Vercel Deployment Recovery", category: "infrastructure", priority: "critical", estimatedTime: "45 minutes",
    steps: [
      { order: 1, action: "Assess deployment status via Vercel dashboard", responsible: "Alex Rivera", estimatedMinutes: 3, requiresApproval: false },
      { order: 2, action: "Roll back to last known good deployment", responsible: "Alex Rivera", estimatedMinutes: 5, requiresApproval: false },
      { order: 3, action: "If account compromised, rotate all deployment tokens", responsible: "Sarah Chen", estimatedMinutes: 10, requiresApproval: true },
      { order: 4, action: "Redeploy from GitHub main branch if rollback fails", responsible: "Marcus Liu", estimatedMinutes: 15, requiresApproval: false },
      { order: 5, action: "Verify all routes and API endpoints respond correctly", responsible: "Marcus Liu", estimatedMinutes: 10, requiresApproval: false },
      { order: 6, action: "Notify team of recovery completion and root cause", responsible: "Alex Rivera", estimatedMinutes: 2, requiresApproval: false },
    ],
    contactChain: ["Alex Rivera", "Marcus Liu", "Vercel Support"], lastTested: "2026-05-01T00:00:00Z", lastUpdated: "2026-05-18T00:00:00Z", linkedAssetIds: ["ca-3"],
  },
  {
    id: "rp-c3", title: "Database Disaster Recovery — Supabase", category: "data-recovery", priority: "critical", estimatedTime: "2 hours",
    steps: [
      { order: 1, action: "Assess data loss scope and identify affected tables", responsible: "Alex Rivera", estimatedMinutes: 10, requiresApproval: false },
      { order: 2, action: "Initiate point-in-time recovery to latest clean state", responsible: "Alex Rivera", estimatedMinutes: 30, requiresApproval: true, notes: "Requires founder approval for production data restoration" },
      { order: 3, action: "Restore from S3 backup if PITR unavailable", responsible: "Marcus Liu", estimatedMinutes: 45, requiresApproval: true },
      { order: 4, action: "Validate data integrity across all critical tables", responsible: "Marcus Liu", estimatedMinutes: 20, requiresApproval: false },
      { order: 5, action: "Reconnect application services and verify auth flows", responsible: "Alex Rivera", estimatedMinutes: 10, requiresApproval: false },
      { order: 6, action: "Run integrity tests and generate recovery report", responsible: "Sarah Chen", estimatedMinutes: 5, requiresApproval: false },
    ],
    contactChain: ["Alex Rivera", "Brendon Kahmann", "Supabase Support", "AWS Support"], lastUpdated: "2026-05-20T00:00:00Z", linkedAssetIds: ["ca-4", "ca-9"],
  },
  {
    id: "rp-c4", title: "GitHub Access Recovery", category: "access-restoration", priority: "high", estimatedTime: "1 hour",
    steps: [
      { order: 1, action: "Verify org owner account access via backup MFA", responsible: "Brendon Kahmann", estimatedMinutes: 5, requiresApproval: false },
      { order: 2, action: "Rotate all compromised PATs and deploy keys", responsible: "Sarah Chen", estimatedMinutes: 15, requiresApproval: false },
      { order: 3, action: "Audit recent commits and force-pushes for tampering", responsible: "Sarah Chen", estimatedMinutes: 20, requiresApproval: false },
      { order: 4, action: "Re-enable branch protections and required reviews", responsible: "Alex Rivera", estimatedMinutes: 10, requiresApproval: false },
      { order: 5, action: "Verify CI/CD pipelines are clean and operational", responsible: "Marcus Liu", estimatedMinutes: 10, requiresApproval: false },
    ],
    contactChain: ["Brendon Kahmann", "Sarah Chen", "GitHub Support"], lastTested: "2026-03-20T00:00:00Z", lastUpdated: "2026-05-05T00:00:00Z", linkedAssetIds: ["ca-5"],
  },
  {
    id: "rp-c5", title: "Payment System Recovery — Stripe", category: "business-continuity", priority: "high", estimatedTime: "1 hour",
    steps: [
      { order: 1, action: "Log in to Stripe dashboard and assess account status", responsible: "Brendon Kahmann", estimatedMinutes: 5, requiresApproval: false },
      { order: 2, action: "Verify no unauthorized charges or configuration changes", responsible: "Brendon Kahmann", estimatedMinutes: 15, requiresApproval: false },
      { order: 3, action: "Rotate API keys and update all service integrations", responsible: "Alex Rivera", estimatedMinutes: 20, requiresApproval: true },
      { order: 4, action: "Validate webhook endpoints are receiving correctly", responsible: "Marcus Liu", estimatedMinutes: 10, requiresApproval: false },
      { order: 5, action: "Process test transaction to confirm end-to-end flow", responsible: "Brendon Kahmann", estimatedMinutes: 10, requiresApproval: false },
    ],
    contactChain: ["Brendon Kahmann", "Stripe Support"], lastUpdated: "2026-05-12T00:00:00Z", linkedAssetIds: ["ca-6"],
  },
  {
    id: "rp-c6", title: "AI Infrastructure Failover — OpenAI", category: "infrastructure", priority: "critical", estimatedTime: "30 minutes",
    steps: [
      { order: 1, action: "Check OpenAI API status page and rate limit dashboard", responsible: "Alex Rivera", estimatedMinutes: 3, requiresApproval: false },
      { order: 2, action: "Switch to backup API key if primary is compromised", responsible: "Alex Rivera", estimatedMinutes: 5, requiresApproval: false },
      { order: 3, action: "Enable fallback to cached responses for non-critical queries", responsible: "Marcus Liu", estimatedMinutes: 10, requiresApproval: false },
      { order: 4, action: "If prolonged outage, activate local model fallback", responsible: "Alex Rivera", estimatedMinutes: 10, requiresApproval: true, notes: "Local model provides degraded but functional inference" },
      { order: 5, action: "Notify affected product teams and update status page", responsible: "Maya Patel", estimatedMinutes: 2, requiresApproval: false },
    ],
    contactChain: ["Alex Rivera", "Marcus Liu", "OpenAI Support"], lastTested: "2026-05-15T00:00:00Z", lastUpdated: "2026-05-22T00:00:00Z", linkedAssetIds: ["ca-8"],
  },
  {
    id: "rp-c7", title: "Full Ecosystem Security Incident Response", category: "security-incident", priority: "critical", estimatedTime: "4 hours",
    steps: [
      { order: 1, action: "Activate incident commander — founder takes lead", responsible: "Brendon Kahmann", estimatedMinutes: 5, requiresApproval: false },
      { order: 2, action: "Lock all external access to compromised systems", responsible: "Sarah Chen", estimatedMinutes: 10, requiresApproval: false },
      { order: 3, action: "Rotate all API keys, tokens, and service credentials", responsible: "Sarah Chen", estimatedMinutes: 30, requiresApproval: true },
      { order: 4, action: "Audit access logs across all critical systems", responsible: "Sarah Chen", estimatedMinutes: 60, requiresApproval: false },
      { order: 5, action: "Restore from clean backups if data integrity compromised", responsible: "Alex Rivera", estimatedMinutes: 90, requiresApproval: true },
      { order: 6, action: "Notify legal counsel if data breach suspected", responsible: "Brendon Kahmann", estimatedMinutes: 15, requiresApproval: false },
      { order: 7, action: "Generate post-incident report and remediation plan", responsible: "Sarah Chen", estimatedMinutes: 30, requiresApproval: false },
    ],
    contactChain: ["Brendon Kahmann", "Sarah Chen", "Alex Rivera", "Victoria Chen (Legal)"], lastUpdated: "2026-05-20T00:00:00Z", linkedAssetIds: ["ca-4", "ca-5", "ca-8", "ca-12"],
  },
  {
    id: "rp-c8", title: "Founder Incapacitation — Operational Continuity", category: "business-continuity", priority: "critical", estimatedTime: "Ongoing",
    steps: [
      { order: 1, action: "CTO (Alex Rivera) assumes operational command", responsible: "Alex Rivera", estimatedMinutes: 0, requiresApproval: false },
      { order: 2, action: "Access founder emergency credential package from 1Password", responsible: "Alex Rivera", estimatedMinutes: 10, requiresApproval: false, notes: "Requires biometric + hardware key" },
      { order: 3, action: "Notify board and legal counsel of continuity activation", responsible: "Alex Rivera", estimatedMinutes: 30, requiresApproval: false },
      { order: 4, action: "Secure all founder-only accounts (Stripe, domains, banking)", responsible: "Sarah Chen", estimatedMinutes: 60, requiresApproval: false },
      { order: 5, action: "Maintain ecosystem operations per standing operational plan", responsible: "Alex Rivera", estimatedMinutes: 0, requiresApproval: false },
    ],
    contactChain: ["Alex Rivera", "Sarah Chen", "Victoria Chen (Legal)", "James Morrison (Board)"], lastUpdated: "2026-04-01T00:00:00Z", linkedAssetIds: ["ca-10", "ca-12"],
  },
];

/* ================================================================
   INCIDENTS
   ================================================================ */

export const continuityIncidents: ContinuityIncident[] = [
  {
    id: "ci-1", title: "Supabase Connection Pool Saturation", severity: "high", status: "resolved",
    reportedAt: "2026-05-18T14:23:00Z", resolvedAt: "2026-05-18T15:47:00Z",
    description: "Connection pool exhausted during peak usage. ForgeOps monitoring detected 95% pool utilization followed by connection timeouts across AegisVault and AegisOSAI.",
    affectedAssets: ["ca-4"], affectedProducts: ["ep-aegisvault", "ep-aegisosai"],
    recoveryProcedureId: "rp-c3",
    tasks: [
      { id: "ct-1", action: "Increase connection pool limit from 20 to 50", assignee: "Alex Rivera", status: "completed", priority: "critical" },
      { id: "ct-2", action: "Implement connection pooling via PgBouncer", assignee: "Marcus Liu", status: "completed", priority: "high" },
      { id: "ct-3", action: "Add connection pool monitoring alerts", assignee: "Marcus Liu", status: "completed", priority: "medium" },
    ],
    timeline: [
      { timestamp: "2026-05-18T14:23:00Z", actor: "ForgeOps AI", action: "Alert triggered: connection pool at 95% capacity" },
      { timestamp: "2026-05-18T14:28:00Z", actor: "Alex Rivera", action: "Acknowledged alert, began investigation" },
      { timestamp: "2026-05-18T14:45:00Z", actor: "Alex Rivera", action: "Identified root cause: missing connection cleanup in batch job" },
      { timestamp: "2026-05-18T15:10:00Z", actor: "Marcus Liu", action: "Deployed hotfix with connection pool increase" },
      { timestamp: "2026-05-18T15:47:00Z", actor: "Alex Rivera", action: "Confirmed stable. Incident resolved." },
    ],
  },
  {
    id: "ci-2", title: "Unauthorized API Key Usage Detected", severity: "critical", status: "resolved",
    reportedAt: "2026-05-10T03:17:00Z", resolvedAt: "2026-05-10T05:42:00Z",
    description: "AegisOSAI monitoring flagged unusual API call patterns from a previously rotated OpenAI key. Investigation confirmed the key was cached in a deprecated staging environment.",
    affectedAssets: ["ca-8"], affectedProducts: ["ep-aegisosai"],
    recoveryProcedureId: "rp-c6",
    tasks: [
      { id: "ct-4", action: "Immediately revoke compromised API key", assignee: "Sarah Chen", status: "completed", priority: "critical" },
      { id: "ct-5", action: "Audit all environments for stale credentials", assignee: "Sarah Chen", status: "completed", priority: "critical" },
      { id: "ct-6", action: "Purge deprecated staging environment", assignee: "Marcus Liu", status: "completed", priority: "high" },
      { id: "ct-7", action: "Implement credential rotation automation", assignee: "Alex Rivera", status: "completed", priority: "medium" },
    ],
    timeline: [
      { timestamp: "2026-05-10T03:17:00Z", actor: "AegisOSAI Agent", action: "Anomaly detected: API calls from rotated key" },
      { timestamp: "2026-05-10T03:22:00Z", actor: "Sarah Chen", action: "Escalated to security incident" },
      { timestamp: "2026-05-10T03:30:00Z", actor: "Sarah Chen", action: "Revoked compromised key and generated replacement" },
      { timestamp: "2026-05-10T04:15:00Z", actor: "Marcus Liu", action: "Located stale key in deprecated staging env" },
      { timestamp: "2026-05-10T04:45:00Z", actor: "Marcus Liu", action: "Staging environment fully decommissioned" },
      { timestamp: "2026-05-10T05:42:00Z", actor: "Sarah Chen", action: "Full audit complete. No data exfiltration confirmed." },
    ],
  },
  {
    id: "ci-3", title: "Datadog Monitoring Alert Volume Spike", severity: "medium", status: "investigating",
    reportedAt: "2026-05-24T10:00:00Z",
    description: "ForgeOps monitoring stack generating excessive alert volume (340% above normal). Likely misconfigured threshold after recent metric pipeline update.",
    affectedAssets: ["ca-13"], affectedProducts: ["ep-forgeops"],
    tasks: [
      { id: "ct-8", action: "Review and adjust alert thresholds", assignee: "Marcus Liu", status: "in-progress", priority: "medium" },
      { id: "ct-9", action: "Silence non-critical alerts during investigation", assignee: "Marcus Liu", status: "completed", priority: "low" },
    ],
    timeline: [
      { timestamp: "2026-05-24T10:00:00Z", actor: "System", action: "Alert volume threshold exceeded — 340% above baseline" },
      { timestamp: "2026-05-24T10:15:00Z", actor: "Marcus Liu", action: "Acknowledged, silenced non-critical alerts" },
      { timestamp: "2026-05-24T11:00:00Z", actor: "Marcus Liu", action: "Identified metrics pipeline update as probable cause" },
    ],
  },
];

/* ================================================================
   INFRASTRUCTURE DEPENDENCY GRAPH NODES
   ================================================================ */

export const infraNodes: InfraNode[] = [
  { id: "in-1", label: "Cloudflare", category: "cloud", status: "operational", criticality: "critical", x: 400, y: 60, dependencies: [], singlePointOfFailure: true },
  { id: "in-2", label: "aegisvault.com", category: "domain", status: "operational", criticality: "critical", x: 250, y: 160, dependencies: ["in-1"], singlePointOfFailure: false },
  { id: "in-3", label: "aegisosai.com", category: "domain", status: "operational", criticality: "critical", x: 550, y: 160, dependencies: ["in-1"], singlePointOfFailure: false },
  { id: "in-4", label: "Vercel", category: "cloud", status: "operational", criticality: "critical", x: 400, y: 260, dependencies: ["in-1"], singlePointOfFailure: true },
  { id: "in-5", label: "Supabase", category: "data-store", status: "operational", criticality: "critical", x: 200, y: 360, dependencies: [], singlePointOfFailure: true },
  { id: "in-6", label: "OpenAI API", category: "ai-infra", status: "operational", criticality: "critical", x: 600, y: 360, dependencies: [], singlePointOfFailure: true },
  { id: "in-7", label: "GitHub", category: "developer", status: "operational", criticality: "critical", x: 400, y: 460, dependencies: [], singlePointOfFailure: false },
  { id: "in-8", label: "Stripe", category: "payment", status: "operational", criticality: "high", x: 100, y: 460, dependencies: [], singlePointOfFailure: false },
  { id: "in-9", label: "Twilio", category: "telecom", status: "operational", criticality: "high", x: 700, y: 460, dependencies: [], singlePointOfFailure: false },
  { id: "in-10", label: "AWS S3", category: "cloud", status: "operational", criticality: "high", x: 200, y: 540, dependencies: [], singlePointOfFailure: false },
  { id: "in-11", label: "Datadog", category: "ai-infra", status: "degraded", criticality: "medium", x: 600, y: 540, dependencies: ["in-4"], singlePointOfFailure: false },
  { id: "in-12", label: "1Password", category: "credential", status: "operational", criticality: "high", x: 400, y: 580, dependencies: [], singlePointOfFailure: false },
  { id: "in-13", label: "Google Workspace", category: "cloud", status: "operational", criticality: "high", x: 100, y: 300, dependencies: [], singlePointOfFailure: false },
];

/* ================================================================
   CONTINUITY STATS
   ================================================================ */

export const continuityStats: ContinuityStats = {
  totalAssets: 14,
  operationalAssets: 13,
  degradedAssets: 1,
  criticalAssets: 8,
  recoveryProcedures: 8,
  testedProcedures: 4,
  activeIncidents: 1,
  resolvedIncidents: 2,
  singlePointsOfFailure: 4,
  overallReadiness: 84,
};
