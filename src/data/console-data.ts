import type {
  ConsoleModule, ConsoleCommand, LiveStatusMetric, ConsoleStats,
} from "@/types";

export const consoleModules: ConsoleModule[] = [
  { id: "security", name: "IronFrame Security", status: "warning", score: 74, activeAlerts: 3, lastChecked: "2026-05-25T05:20:00Z", description: "Active security intelligence, anomaly detection, threat monitoring" },
  { id: "identity", name: "Identity & Access", status: "operational", score: 88, activeAlerts: 1, lastChecked: "2026-05-25T05:20:00Z", description: "Identity profiles, RBAC, credential vault, access monitoring" },
  { id: "workspaces", name: "Workspace Management", status: "operational", score: 91, activeAlerts: 0, lastChecked: "2026-05-25T05:20:00Z", description: "8 workspace types, enterprise RBAC, AI agent governance" },
  { id: "ai-governance", name: "AI Governance", status: "operational", score: 91, activeAlerts: 1, lastChecked: "2026-05-25T05:20:00Z", description: "AI memory access, governance compliance, agent monitoring" },
  { id: "timeline", name: "Operational Timeline", status: "operational", score: 95, activeAlerts: 0, lastChecked: "2026-05-25T05:20:00Z", description: "25 events tracked, 8 continuity threads, executive recall" },
  { id: "trust", name: "Trust Infrastructure", status: "operational", score: 88, activeAlerts: 2, lastChecked: "2026-05-25T05:20:00Z", description: "Encryption health, device trust, zero-trust compliance" },
  { id: "continuity", name: "Continuity Systems", status: "operational", score: 84, activeAlerts: 1, lastChecked: "2026-05-25T05:20:00Z", description: "Critical asset registry, recovery procedures, dependency mapping" },
  { id: "audit", name: "Audit & Compliance", status: "operational", score: 92, activeAlerts: 0, lastChecked: "2026-05-25T05:20:00Z", description: "Immutable audit logs, governance compliance, retention policies" },
  { id: "incidents", name: "Incident Response", status: "degraded", score: 78, activeAlerts: 2, lastChecked: "2026-05-25T05:20:00Z", description: "Active investigations, response coordination, escalation workflows" },
  { id: "ecosystem", name: "Ecosystem Security", status: "operational", score: 85, activeAlerts: 0, lastChecked: "2026-05-25T05:20:00Z", description: "Cross-product security graph, dependency analysis, trust relationships" },
];

export const consoleCommands: ConsoleCommand[] = [
  { id: "cmd-audit", label: "Launch Security Audit", description: "Full security posture analysis across all workspaces and modules", category: "audit", severity: "standard", requiresConfirmation: false },
  { id: "cmd-freeze", label: "Freeze Access", description: "Immediately suspend all non-founder access and revoke active sessions", category: "security", severity: "critical", requiresConfirmation: true },
  { id: "cmd-rotate", label: "Rotate Credentials", description: "Initiate key rotation for all workspace and session encryption keys", category: "security", severity: "elevated", requiresConfirmation: true },
  { id: "cmd-perms", label: "Review Permissions", description: "Generate permission drift report across all roles and workspaces", category: "identity", severity: "standard", requiresConfirmation: false },
  { id: "cmd-incident", label: "Simulate Incident", description: "Run tabletop incident response simulation for recovery validation", category: "continuity", severity: "elevated", requiresConfirmation: true },
  { id: "cmd-continuity", label: "Run Continuity Checks", description: "Validate backup integrity, recovery procedures, and asset registry", category: "continuity", severity: "standard", requiresConfirmation: false },
  { id: "cmd-report", label: "Export Executive Report", description: "Generate comprehensive operational intelligence report for stakeholders", category: "audit", severity: "standard", requiresConfirmation: false },
  { id: "cmd-ai-review", label: "Review AI Actions", description: "Audit all AI agent actions, memory access events, and governance compliance", category: "ai", severity: "standard", requiresConfirmation: false },
  { id: "cmd-isolate", label: "Isolate Workspace", description: "Quarantine a workspace — revoke cross-boundary access and freeze AI agents", category: "workspace", severity: "critical", requiresConfirmation: true },
  { id: "cmd-lockdown", label: "Emergency Lockdown", description: "Full platform lockdown — freeze all access, AI, and external integrations", category: "security", severity: "critical", requiresConfirmation: true },
  { id: "cmd-gov-report", label: "Governance Report", description: "Generate AI memory governance compliance report with classification audit", category: "governance", severity: "standard", requiresConfirmation: false },
  { id: "cmd-trust-scan", label: "Trust Score Scan", description: "Recalculate trust scores across encryption, devices, sessions, and identity", category: "security", severity: "standard", requiresConfirmation: false },
];

export const liveStatusMetrics: LiveStatusMetric[] = [
  { id: "ls-posture", label: "Security Posture", value: 86, unit: "%", trend: "stable", status: "healthy" },
  { id: "ls-sessions", label: "Active Sessions", value: 6, trend: "stable", status: "healthy" },
  { id: "ls-agents", label: "Active AI Agents", value: 5, trend: "stable", status: "healthy" },
  { id: "ls-trust", label: "Trust Score", value: 88, unit: "%", trend: "stable", status: "healthy" },
  { id: "ls-encryption", label: "Encryption Health", value: 94, unit: "%", trend: "stable", status: "healthy" },
  { id: "ls-incidents", label: "Active Incidents", value: 2, trend: "down", status: "warning" },
  { id: "ls-recovery", label: "Recovery Readiness", value: 84, unit: "%", trend: "up", status: "healthy" },
  { id: "ls-governance", label: "Governance Integrity", value: 91, unit: "%", trend: "stable", status: "healthy" },
  { id: "ls-zero-trust", label: "Zero-Trust Compliance", value: 84, unit: "%", trend: "up", status: "warning" },
  { id: "ls-mfa", label: "MFA Adoption", value: 75, unit: "%", trend: "stable", status: "warning" },
];

export const consoleStats: ConsoleStats = {
  overallPosture: "monitoring",
  overallScore: 86,
  modulesOperational: 8,
  totalModules: 10,
  activeIncidents: 2,
  activeSessions: 6,
  activeAiAgents: 5,
  pendingActions: 4,
  lastFullAudit: "2026-05-20T10:00:00Z",
};
