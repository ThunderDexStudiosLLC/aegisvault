import type {
  SecurityRisk, SecurityAnomaly, IdentityRisk, PermissionDrift,
  AiGovernanceEvent, ThreatIntelItem, SecurityGraphNode, IronFrameStats,
} from "@/types";

/* ================================================================
   SECURITY RISKS
   ================================================================ */

export const securityRisks: SecurityRisk[] = [
  { id: "sr-1", title: "Unrotated OpenAI Production API Key", description: "Production OpenAI API key has not been rotated in 47 days, exceeding the 30-day rotation policy. Key is used by AegisOSAI and ThunderCode.", category: "credential", severity: "high", status: "active", detectedAt: "2026-05-23T10:00:00Z", affectedEntities: ["AegisOSAI", "ThunderCode", "OpenAI API"], recommendation: "Rotate the API key immediately and update all dependent service configurations." },
  { id: "sr-2", title: "Operations Manager Missing MFA", description: "Maya Patel (Operations) has no MFA configured. Account has access to customer data, communication logs, and vendor credentials.", category: "access", severity: "high", status: "active", detectedAt: "2026-05-20T08:00:00Z", affectedEntities: ["Maya Patel", "CallAxisAI", "Vendor Portal"], recommendation: "Enforce MFA enrollment within 48 hours. Restrict access to sensitive resources until MFA is configured." },
  { id: "sr-3", title: "Deprecated Staging Environment Active", description: "A deprecated staging environment on Vercel still has valid database connection strings and API keys. Previously involved in credential exposure incident.", category: "infrastructure", severity: "critical", status: "investigating", detectedAt: "2026-05-24T14:00:00Z", affectedEntities: ["Vercel Staging", "Supabase", "OpenAI API"], recommendation: "Immediately decommission the staging environment and revoke all associated credentials." },
  { id: "sr-4", title: "Datadog Alert Threshold Misconfiguration", description: "ForgeOps monitoring generating 340% above normal alert volume after metric pipeline update. Alert fatigue risk.", category: "infrastructure", severity: "medium", status: "investigating", detectedAt: "2026-05-24T10:00:00Z", affectedEntities: ["ForgeOps AI", "Datadog"], recommendation: "Review and recalibrate alert thresholds. Implement alert deduplication rules." },
  { id: "sr-5", title: "Finance Account Pending Onboarding", description: "Jordan Blake (Finance) has pending account status for 12 days with no MFA, no trusted devices, and 45% security score.", category: "access", severity: "medium", status: "active", detectedAt: "2026-05-13T09:00:00Z", affectedEntities: ["Jordan Blake"], recommendation: "Complete onboarding process or deactivate account if hire is not confirmed." },
  { id: "sr-6", title: "Cross-Product Auth Fragmentation", description: "4 ecosystem products implement separate authentication flows. No centralized SSO. Increases attack surface and credential sprawl.", category: "compliance", severity: "high", status: "accepted", detectedAt: "2026-05-15T11:00:00Z", affectedEntities: ["AegisVault", "AegisOSAI", "CallAxisAI", "ForgeOps AI"], recommendation: "Prioritize auth centralization through AegisOSAI plugin architecture. Target Q3 2026.", mitigatedAt: undefined },
  { id: "sr-7", title: "AWS S3 Backup Cross-Region Replication Lag", description: "Cross-region replication from us-east-1 to us-west-2 showing 4-hour lag in recent sync cycle. Normal is under 15 minutes.", category: "infrastructure", severity: "low", status: "mitigated", detectedAt: "2026-05-22T06:00:00Z", affectedEntities: ["AWS S3", "Backup Infrastructure"], recommendation: "Monitor replication metrics. Escalate to AWS if lag persists beyond 6 hours.", mitigatedAt: "2026-05-22T10:00:00Z" },
  { id: "sr-8", title: "Potential Insider Risk — Elevated Access Pattern", description: "Marcus Liu accessed infrastructure-sensitive memories 8 times in 24 hours, 3x above his baseline. Pattern consistent with pre-departure data gathering.", category: "insider", severity: "medium", status: "investigating", detectedAt: "2026-05-24T18:00:00Z", affectedEntities: ["Marcus Liu", "Infrastructure Secrets"], recommendation: "Review access logs with Security Lead. Conduct informal check-in. Do not alert subject until investigation concludes." },
];

/* ================================================================
   ANOMALIES
   ================================================================ */

export const securityAnomalies: SecurityAnomaly[] = [
  { id: "sa-1", title: "Failed Login from Moscow IP", description: "3 failed login attempts on founder account from 185.220.xx.xx (Moscow, Russia). No known business connections to this region.", category: "access", severity: "critical", detectedAt: "2026-05-24T02:17:00Z", actor: "Unknown", actorType: "unknown", sourceIp: "185.220.xx.xx", location: "Moscow, Russia", resolved: false },
  { id: "sa-2", title: "AegisOSAI API Volume Spike", description: "AI agent API call volume 340% above baseline in 2-hour window. No corresponding user activity or scheduled tasks.", category: "ai-governance", severity: "high", detectedAt: "2026-05-23T22:00:00Z", actor: "AegisOSAI Agent", actorType: "ai-agent", resolved: false },
  { id: "sa-3", title: "Off-Hours Database Query Burst", description: "47 database queries executed between 3:00-3:15 AM from Marcus Liu session. Pattern unusual for this user.", category: "access", severity: "medium", detectedAt: "2026-05-24T03:15:00Z", actor: "Marcus Liu", actorType: "human", sourceIp: "73.162.xx.xx", location: "San Francisco, CA", resolved: false },
  { id: "sa-4", title: "New Device Login — Sarah Chen", description: "Security Lead logged in from unregistered iPhone 16. Device fingerprint not in trusted device registry.", category: "access", severity: "low", detectedAt: "2026-05-24T09:30:00Z", actor: "Sarah Chen", actorType: "human", location: "San Jose, CA", resolved: true },
  { id: "sa-5", title: "Restricted Memory Recall Attempt", description: "AegisOSAI agent attempted full content recall on founder-only fundraising memory. Access degraded to denied per governance policy.", category: "ai-governance", severity: "high", detectedAt: "2026-05-24T16:00:00Z", actor: "AegisOSAI Agent", actorType: "ai-agent", resolved: true },
  { id: "sa-6", title: "Credential Scan Detected", description: "Automated credential scanning pattern detected from external IP targeting login endpoint. 142 attempts in 10 minutes.", category: "network", severity: "critical", detectedAt: "2026-05-25T01:00:00Z", actor: "Unknown", actorType: "unknown", sourceIp: "45.33.xx.xx", location: "Amsterdam, NL", resolved: false },
];

/* ================================================================
   IDENTITY RISKS
   ================================================================ */

export const identityRisks: IdentityRisk[] = [
  { id: "ir-1", identityName: "Maya Patel", riskType: "no-mfa", severity: "high", description: "Operations Manager has no MFA configured. Account has access to customer communication logs, vendor portal, and operational data.", detectedAt: "2026-05-20T08:00:00Z", recommendation: "Enforce TOTP or hardware key enrollment within 48 hours." },
  { id: "ir-2", identityName: "Jordan Blake", riskType: "dormant-account", severity: "medium", description: "Finance Lead account pending for 12 days. No login activity, no MFA, no trusted devices. 45% security score.", detectedAt: "2026-05-13T09:00:00Z", recommendation: "Complete onboarding or deactivate account." },
  { id: "ir-3", identityName: "Marcus Liu", riskType: "unusual-behavior", severity: "medium", description: "Lead Engineer accessed infrastructure-sensitive memories 8 times in 24 hours (3x baseline). Off-hours database queries detected.", detectedAt: "2026-05-24T18:00:00Z", recommendation: "Review access logs. Conduct informal check-in before escalation." },
  { id: "ir-4", identityName: "Alex Rivera", riskType: "excessive-permissions", severity: "low", description: "CTO has backup-owner access to 9 of 14 critical assets. Concentration of access creates succession risk if account compromised.", detectedAt: "2026-05-22T12:00:00Z", recommendation: "Distribute backup-owner roles across Security Lead and Operations Manager." },
  { id: "ir-5", identityName: "AegisOSAI Agent", riskType: "excessive-permissions", severity: "medium", description: "AI agent has full recall access to all public and internal memories (20 of 16 governed). API volume anomaly suggests scope may be too broad.", detectedAt: "2026-05-23T22:00:00Z", recommendation: "Restrict AI agent to summary-only access for internal memories. Implement rate limiting." },
  { id: "ir-6", identityName: "Brendon Kahmann", riskType: "shared-account", severity: "low", description: "Founder Stripe account credentials shared with Alex Rivera for payment system backup. Direct credential sharing increases exposure.", detectedAt: "2026-05-18T10:00:00Z", recommendation: "Create delegated admin access in Stripe instead of sharing credentials." },
  { id: "ir-7", identityName: "Maya Patel", riskType: "stale-access", severity: "low", description: "Operations Manager retains access to ThunderCode repository despite no commits or activity in 60 days.", detectedAt: "2026-05-20T08:00:00Z", recommendation: "Revoke ThunderCode access. Re-grant if needed for future work." },
];

/* ================================================================
   PERMISSION DRIFTS
   ================================================================ */

export const permissionDrifts: PermissionDrift[] = [
  { id: "pd-1", identity: "Alex Rivera", role: "CTO / Executive", driftType: "role-creep", description: "CTO accumulated backup-owner access to 9 critical assets over 3 months. Original role definition specified 4.", permissionsAffected: ["Stripe backup-owner", "Twilio backup-owner", "Google Workspace backup-owner", "1Password backup-owner", "AWS S3 backup-owner"], detectedAt: "2026-05-22T12:00:00Z", severity: "medium" },
  { id: "pd-2", identity: "Maya Patel", role: "Operations Manager", driftType: "unused-permissions", description: "Operations Manager has write access to ThunderCode, ForgeOps, and CivicOps repositories with no activity in 60+ days.", permissionsAffected: ["thundercode:write", "forgeops:write", "civicops:write"], detectedAt: "2026-05-20T08:00:00Z", severity: "low" },
  { id: "pd-3", identity: "AegisOSAI Agent", role: "AI Agent", driftType: "privilege-escalation", description: "AI agent memory recall scope expanded from summary-only to full access for internal memories without formal approval.", permissionsAffected: ["internal-memory:full-recall", "public-memory:full-recall"], detectedAt: "2026-05-23T22:00:00Z", severity: "high" },
  { id: "pd-4", identity: "Marcus Liu", role: "Lead Engineer", driftType: "cross-boundary", description: "Engineer accessed infrastructure-sensitive memories outside Engineering zone. Zone boundaries should restrict to Engineering and DevOps only.", permissionsAffected: ["infra-secrets:read", "security-config:read"], detectedAt: "2026-05-24T18:00:00Z", severity: "medium" },
];

/* ================================================================
   AI GOVERNANCE EVENTS
   ================================================================ */

export const aiGovernanceEvents: AiGovernanceEvent[] = [
  { id: "age-1", agentName: "AegisOSAI Agent", action: "Full content recall on founder-only memory", category: "restricted-recall", severity: "high", timestamp: "2026-05-24T16:00:00Z", details: "Agent attempted to recall Series A fundraising memory (founder-only classification). Access denied per governance policy. Agent received empty response.", blocked: true, policyRef: "Founder-Only Memory Access (mar-5)" },
  { id: "age-2", agentName: "AegisOSAI Agent", action: "Metadata extraction on restricted partnership memory", category: "memory-access", severity: "medium", timestamp: "2026-05-24T14:00:00Z", details: "Agent accessed Microsoft partnership memory. Full recall degraded to metadata-only per restricted classification policy.", blocked: false, policyRef: "Restricted Memory Access (mar-4)" },
  { id: "age-3", agentName: "AegisOSAI Agent", action: "API volume 340% above baseline", category: "unauthorized-pattern", severity: "high", timestamp: "2026-05-23T22:00:00Z", details: "Agent generated 2,847 API calls in 2-hour window without corresponding user request or scheduled task. Pattern matches autonomous exploration behavior.", blocked: false },
  { id: "age-4", agentName: "AegisOSAI Agent", action: "Bulk recall across all internal memories", category: "scope-violation", severity: "medium", timestamp: "2026-05-23T20:00:00Z", details: "Agent recalled 14 internal memories in rapid succession for ecosystem health assessment. Within policy but approaching rate limit.", blocked: false, policyRef: "Internal Memory Access (mar-2)" },
  { id: "age-5", agentName: "AegisOSAI Agent", action: "Attempted access to infrastructure secrets zone", category: "restricted-recall", severity: "critical", timestamp: "2026-05-22T04:00:00Z", details: "Agent attempted to recall production infrastructure secrets (database connection strings, API keys). Access denied. Event escalated to Security Lead.", blocked: true, policyRef: "Infrastructure-Sensitive Memory Access (mar-7)" },
  { id: "age-6", agentName: "AegisOSAI Agent", action: "Data export request to external endpoint", category: "data-exfiltration-check", severity: "critical", timestamp: "2026-05-21T15:00:00Z", details: "Agent requested export of aggregated deployment metrics to external analytics endpoint. Request blocked pending security review. No data exfiltrated.", blocked: true },
  { id: "age-7", agentName: "AegisOSAI Agent", action: "Normal operational memory recall", category: "memory-access", severity: "info", timestamp: "2026-05-25T04:30:00Z", details: "Agent recalled weekly standup notes and ForgeOps deployment metrics for daily orchestration cycle. Full access per public/internal classification.", blocked: false, policyRef: "Public Memory Access (mar-1)" },
  { id: "age-8", agentName: "AegisOSAI Agent", action: "Permission scope self-assessment", category: "permission-usage", severity: "info", timestamp: "2026-05-25T04:00:00Z", details: "Agent ran internal permission scope check against governance policies. All current permissions within defined boundaries.", blocked: false },
];

/* ================================================================
   THREAT INTELLIGENCE FEED
   ================================================================ */

export const threatIntelFeed: ThreatIntelItem[] = [
  { id: "ti-1", title: "Supabase Auth Bypass — CVE-2026-4821", source: "Supabase Security Advisory", category: "vulnerability", severity: "critical", publishedAt: "2026-05-24T00:00:00Z", summary: "Critical authentication bypass vulnerability in Supabase GoTrue versions prior to 2.151.0. Allows unauthenticated access to protected resources via crafted JWT.", affectedSystems: ["Supabase Production"], actionRequired: true, acknowledged: false },
  { id: "ti-2", title: "Vercel Edge Function Cold Start Exploit", source: "Vercel Security Blog", category: "advisory", severity: "high", publishedAt: "2026-05-22T00:00:00Z", summary: "Edge functions may expose environment variables during cold start race condition. Patch available in Vercel CLI 35.2.1.", affectedSystems: ["Vercel Production"], actionRequired: true, acknowledged: true },
  { id: "ti-3", title: "OpenAI Rate Limit Policy Change", source: "OpenAI Changelog", category: "provider-incident", severity: "medium", publishedAt: "2026-05-23T00:00:00Z", summary: "OpenAI reducing rate limits for GPT-4 Turbo by 20% for Tier 2 accounts effective June 1. May affect AegisOSAI orchestration throughput.", affectedSystems: ["OpenAI API", "AegisOSAI"], actionRequired: true, acknowledged: false },
  { id: "ti-4", title: "GitHub Actions Supply Chain Attack — tj-actions/changed-files", source: "GitHub Security Advisory", category: "vulnerability", severity: "high", publishedAt: "2026-05-20T00:00:00Z", summary: "Popular GitHub Action compromised via maintainer account takeover. Malicious versions exfiltrate CI/CD secrets. Review all workflow dependencies.", affectedSystems: ["GitHub Organization"], actionRequired: true, acknowledged: true },
  { id: "ti-5", title: "Cloudflare Global Network Degradation", source: "Cloudflare Status", category: "infrastructure-alert", severity: "medium", publishedAt: "2026-05-25T02:00:00Z", summary: "Intermittent packet loss reported across US-East and EU-West PoPs. Cloudflare engineering investigating. May affect DNS resolution latency.", affectedSystems: ["Cloudflare DNS", "aegisvault.com", "aegisosai.com"], actionRequired: false, acknowledged: false },
  { id: "ti-6", title: "AI Model Poisoning Research — LLM Context Injection", source: "MITRE ATT&CK", category: "ecosystem-risk", severity: "medium", publishedAt: "2026-05-18T00:00:00Z", summary: "New research demonstrates context injection attacks against LLM-based agents. Attackers can manipulate agent behavior by injecting instructions into retrieved context.", affectedSystems: ["AegisOSAI", "ThunderCode"], actionRequired: false, acknowledged: true },
  { id: "ti-7", title: "Stripe Webhook Signature Verification Bug", source: "Stripe Status", category: "provider-incident", severity: "low", publishedAt: "2026-05-21T00:00:00Z", summary: "Stripe identified edge case where webhook signature verification may pass for malformed payloads on specific SDK versions. Update stripe-node to 16.2.0+.", affectedSystems: ["Stripe Connect"], actionRequired: true, acknowledged: true },
];

/* ================================================================
   SECURITY GRAPH NODES
   ================================================================ */

export const securityGraphNodes: SecurityGraphNode[] = [
  { id: "sgn-1", label: "Brendon Kahmann", type: "user", status: "secure", x: 400, y: 60, connections: ["sgn-6", "sgn-7", "sgn-8", "sgn-9", "sgn-14"] },
  { id: "sgn-2", label: "Alex Rivera", type: "user", status: "warning", x: 200, y: 140, connections: ["sgn-6", "sgn-7", "sgn-8", "sgn-10", "sgn-11"] },
  { id: "sgn-3", label: "Sarah Chen", type: "user", status: "secure", x: 600, y: 140, connections: ["sgn-7", "sgn-8", "sgn-12"] },
  { id: "sgn-4", label: "Marcus Liu", type: "user", status: "warning", x: 150, y: 260, connections: ["sgn-6", "sgn-10", "sgn-11"] },
  { id: "sgn-5", label: "Maya Patel", type: "user", status: "critical", x: 650, y: 260, connections: ["sgn-13"] },
  { id: "sgn-6", label: "AegisVault", type: "system", status: "secure", x: 300, y: 340, connections: ["sgn-7", "sgn-10"] },
  { id: "sgn-7", label: "AegisOSAI", type: "system", status: "warning", x: 500, y: 340, connections: ["sgn-6", "sgn-10", "sgn-15"] },
  { id: "sgn-8", label: "Admin", type: "permission", status: "secure", x: 400, y: 200, connections: [] },
  { id: "sgn-9", label: "Founder-Only", type: "permission", status: "secure", x: 500, y: 120, connections: [] },
  { id: "sgn-10", label: "Supabase", type: "dependency", status: "secure", x: 200, y: 440, connections: [] },
  { id: "sgn-11", label: "GitHub", type: "dependency", status: "secure", x: 100, y: 380, connections: [] },
  { id: "sgn-12", label: "1Password", type: "trust", status: "secure", x: 700, y: 380, connections: [] },
  { id: "sgn-13", label: "CallAxisAI", type: "system", status: "secure", x: 700, y: 180, connections: ["sgn-15"] },
  { id: "sgn-14", label: "Stripe", type: "dependency", status: "secure", x: 300, y: 480, connections: [] },
  { id: "sgn-15", label: "OpenAI", type: "dependency", status: "warning", x: 500, y: 480, connections: [] },
];

/* ================================================================
   IRONFRAME STATS
   ================================================================ */

export const ironFrameStats: IronFrameStats = {
  overallScore: 74,
  activeRisks: 5,
  criticalRisks: 1,
  anomaliesDetected: 6,
  identityRisks: 7,
  permissionDrifts: 4,
  aiGovernanceEvents: 8,
  blockedAiActions: 3,
  threatIntelItems: 7,
  unacknowledgedThreats: 3,
};
