import type {
  EncryptionKey, TrustInfraDevice, ActiveSession, SecurityIntelEvent,
  TrustScore, LockdownState, EncryptionStats,
} from "@/types";

export const encryptionKeys: EncryptionKey[] = [
  {
    id: "key-master", name: "AegisVault Master Key", type: "master", algorithm: "AES-256-GCM",
    status: "active", createdAt: "2024-01-15T00:00:00Z", lastRotatedAt: "2026-04-01T00:00:00Z",
    expiresAt: "2027-04-01T00:00:00Z", rotationDueDays: 311, bitStrength: 256, usageCount: 0,
    scope: "Global — all workspace key derivation", exposureRisk: "none", hardwareProtected: true,
  },
  {
    id: "key-founder", name: "Founder Encryption Key", type: "workspace", algorithm: "AES-256-GCM",
    status: "active", createdAt: "2024-01-15T00:00:00Z", lastRotatedAt: "2026-05-01T00:00:00Z",
    expiresAt: "2026-11-01T00:00:00Z", rotationDueDays: 160, bitStrength: 256, usageCount: 847,
    scope: "Founder Private workspace", derivedFrom: "key-master", exposureRisk: "none", hardwareProtected: true,
  },
  {
    id: "key-exec", name: "Executive Workspace Key", type: "workspace", algorithm: "AES-256-GCM",
    status: "active", createdAt: "2024-02-01T00:00:00Z", lastRotatedAt: "2026-04-15T00:00:00Z",
    expiresAt: "2026-10-15T00:00:00Z", rotationDueDays: 143, bitStrength: 256, usageCount: 2341,
    scope: "Executive Command workspace", derivedFrom: "key-master", exposureRisk: "none", hardwareProtected: false,
  },
  {
    id: "key-eng", name: "Engineering Workspace Key", type: "workspace", algorithm: "AES-256-GCM",
    status: "active", createdAt: "2024-02-15T00:00:00Z", lastRotatedAt: "2026-03-01T00:00:00Z",
    expiresAt: "2026-09-01T00:00:00Z", rotationDueDays: 99, bitStrength: 256, usageCount: 5891,
    scope: "Engineering workspace", derivedFrom: "key-master", exposureRisk: "low", hardwareProtected: false,
  },
  {
    id: "key-sec", name: "Security Ops Key", type: "workspace", algorithm: "ChaCha20-Poly1305",
    status: "active", createdAt: "2024-03-01T00:00:00Z", lastRotatedAt: "2026-05-10T00:00:00Z",
    expiresAt: "2026-11-10T00:00:00Z", rotationDueDays: 169, bitStrength: 256, usageCount: 3214,
    scope: "Security Operations workspace", derivedFrom: "key-master", exposureRisk: "none", hardwareProtected: true,
  },
  {
    id: "key-field-pii", name: "PII Field Encryption Key", type: "field", algorithm: "AES-256-GCM",
    status: "active", createdAt: "2024-04-01T00:00:00Z", lastRotatedAt: "2026-04-20T00:00:00Z",
    expiresAt: "2026-10-20T00:00:00Z", rotationDueDays: 148, bitStrength: 256, usageCount: 12456,
    scope: "All PII fields (email, phone, SSN, addresses)", exposureRisk: "none", hardwareProtected: false,
  },
  {
    id: "key-field-financial", name: "Financial Data Key", type: "field", algorithm: "AES-256-GCM",
    status: "active", createdAt: "2024-04-01T00:00:00Z", lastRotatedAt: "2026-05-15T00:00:00Z",
    expiresAt: "2026-11-15T00:00:00Z", rotationDueDays: 174, bitStrength: 256, usageCount: 3891,
    scope: "Financial records, payment data, revenue figures", exposureRisk: "none", hardwareProtected: true,
  },
  {
    id: "key-backup", name: "Backup Encryption Key", type: "backup", algorithm: "AES-256-GCM",
    status: "active", createdAt: "2024-01-15T00:00:00Z", lastRotatedAt: "2026-03-15T00:00:00Z",
    expiresAt: "2026-09-15T00:00:00Z", rotationDueDays: 113, bitStrength: 256, usageCount: 52,
    scope: "All encrypted backup archives", exposureRisk: "none", hardwareProtected: true,
  },
  {
    id: "key-session", name: "Session Encryption Key", type: "session", algorithm: "ChaCha20-Poly1305",
    status: "rotating", createdAt: "2026-05-20T00:00:00Z", lastRotatedAt: "2026-05-20T00:00:00Z",
    expiresAt: "2026-06-20T00:00:00Z", rotationDueDays: 26, bitStrength: 256, usageCount: 1247,
    scope: "Active session tokens and cookies", exposureRisk: "low", hardwareProtected: false,
  },
  {
    id: "key-ai-memory", name: "AI Memory Encryption Key", type: "ai-memory", algorithm: "AES-256-GCM",
    status: "active", createdAt: "2024-06-01T00:00:00Z", lastRotatedAt: "2026-04-01T00:00:00Z",
    expiresAt: "2026-10-01T00:00:00Z", rotationDueDays: 129, bitStrength: 256, usageCount: 8934,
    scope: "All AI agent memory stores and context windows", exposureRisk: "none", hardwareProtected: false,
  },
  {
    id: "key-audit", name: "Audit Trail Encryption Key", type: "audit", algorithm: "AES-256-GCM",
    status: "active", createdAt: "2024-01-15T00:00:00Z", lastRotatedAt: "2026-02-01T00:00:00Z",
    expiresAt: "2026-08-01T00:00:00Z", rotationDueDays: 68, bitStrength: 256, usageCount: 45621,
    scope: "Immutable audit log entries", exposureRisk: "none", hardwareProtected: true,
  },
  {
    id: "key-recovery", name: "Emergency Recovery Key", type: "recovery", algorithm: "RSA-4096",
    status: "active", createdAt: "2024-01-15T00:00:00Z", lastRotatedAt: "2026-01-15T00:00:00Z",
    expiresAt: "2028-01-15T00:00:00Z", rotationDueDays: 600, bitStrength: 4096, usageCount: 0,
    scope: "Emergency master key recovery — offline cold storage", exposureRisk: "none", hardwareProtected: true,
  },
  {
    id: "key-signing", name: "Code Signing Key", type: "master", algorithm: "Ed25519",
    status: "active", createdAt: "2024-03-01T00:00:00Z", lastRotatedAt: "2026-03-01T00:00:00Z",
    expiresAt: "2027-03-01T00:00:00Z", rotationDueDays: 280, bitStrength: 256, usageCount: 412,
    scope: "Deployment artifact signing and verification", exposureRisk: "none", hardwareProtected: true,
  },
  {
    id: "key-staging-old", name: "Staging Environment Key (DEPRECATED)", type: "workspace", algorithm: "AES-256-CBC",
    status: "revoked", createdAt: "2024-02-01T00:00:00Z", lastRotatedAt: "2025-06-01T00:00:00Z",
    expiresAt: "2025-12-01T00:00:00Z", rotationDueDays: 0, bitStrength: 256, usageCount: 14231,
    scope: "Former staging environment — DECOMMISSIONED", exposureRisk: "medium", hardwareProtected: false,
  },
];

export const trustedDevices: TrustInfraDevice[] = [
  {
    id: "dev-1", name: "Brendon's MacBook Pro", type: "desktop", trustLevel: "trusted",
    owner: "Brendon Kahmann", os: "macOS 15.4", browser: "Chrome 126",
    lastSeen: "2026-05-25T04:30:00Z", firstSeen: "2024-01-15T00:00:00Z",
    location: "Denver, CO", ipAddress: "73.162.xx.xx", trustScore: 98,
    biometricCapable: true, hardwareKeyBound: true, fingerprint: "a8f3c9d1e2b4",
  },
  {
    id: "dev-2", name: "Brendon's iPhone 16 Pro", type: "mobile", trustLevel: "trusted",
    owner: "Brendon Kahmann", os: "iOS 19.5", browser: "Safari",
    lastSeen: "2026-05-25T02:00:00Z", firstSeen: "2024-09-20T00:00:00Z",
    location: "Denver, CO", ipAddress: "73.162.xx.xx", trustScore: 95,
    biometricCapable: true, hardwareKeyBound: false, fingerprint: "b7e2d4c3f1a9",
  },
  {
    id: "dev-3", name: "Alex's ThinkPad X1", type: "desktop", trustLevel: "trusted",
    owner: "Alex Rivera", os: "Ubuntu 24.04", browser: "Firefox 128",
    lastSeen: "2026-05-25T05:00:00Z", firstSeen: "2024-02-15T00:00:00Z",
    location: "San Francisco, CA", ipAddress: "104.28.xx.xx", trustScore: 92,
    biometricCapable: false, hardwareKeyBound: true, fingerprint: "c4d5e6f7a8b9",
  },
  {
    id: "dev-4", name: "Sarah's MacBook Air", type: "desktop", trustLevel: "trusted",
    owner: "Sarah Chen", os: "macOS 15.4", browser: "Chrome 126",
    lastSeen: "2026-05-25T04:45:00Z", firstSeen: "2024-03-01T00:00:00Z",
    location: "Seattle, WA", ipAddress: "76.191.xx.xx", trustScore: 96,
    biometricCapable: true, hardwareKeyBound: true, fingerprint: "d6e7f8a9b0c1",
  },
  {
    id: "dev-5", name: "Marcus's Dev Workstation", type: "desktop", trustLevel: "verified",
    owner: "Marcus Liu", os: "Arch Linux", browser: "Chrome 126",
    lastSeen: "2026-05-25T05:10:00Z", firstSeen: "2024-04-01T00:00:00Z",
    location: "Austin, TX", ipAddress: "99.47.xx.xx", trustScore: 84,
    biometricCapable: false, hardwareKeyBound: false, fingerprint: "e8f9a0b1c2d3",
  },
  {
    id: "dev-6", name: "Production Server — Vercel Edge", type: "server", trustLevel: "trusted",
    owner: "System", os: "Vercel Runtime", browser: undefined,
    lastSeen: "2026-05-25T05:20:00Z", firstSeen: "2024-02-01T00:00:00Z",
    location: "us-east-1", ipAddress: "76.76.21.xx", trustScore: 99,
    biometricCapable: false, hardwareKeyBound: false, fingerprint: "f0a1b2c3d4e5",
  },
  {
    id: "dev-7", name: "YubiKey 5C NFC — Brendon", type: "hardware-key", trustLevel: "trusted",
    owner: "Brendon Kahmann", os: "FIDO2/U2F", browser: undefined,
    lastSeen: "2026-05-25T04:30:00Z", firstSeen: "2024-01-15T00:00:00Z",
    location: "Denver, CO", ipAddress: "N/A", trustScore: 100,
    biometricCapable: false, hardwareKeyBound: true, fingerprint: "yk5c-a8f3c9d1",
  },
  {
    id: "dev-8", name: "Unknown Device — Moscow", type: "desktop", trustLevel: "blocked",
    owner: "Unknown", os: "Windows 11", browser: "Chrome 125",
    lastSeen: "2026-05-24T03:00:00Z", firstSeen: "2026-05-24T03:00:00Z",
    location: "Moscow, Russia", ipAddress: "91.214.xx.xx", trustScore: 0,
    biometricCapable: false, hardwareKeyBound: false, fingerprint: "BLOCKED-91214",
  },
];

export const activeSessions: ActiveSession[] = [
  {
    id: "sess-1", userId: "wm-1", userName: "Brendon Kahmann", deviceId: "dev-1", deviceName: "MacBook Pro",
    startedAt: "2026-05-25T01:00:00Z", lastActivity: "2026-05-25T04:30:00Z", expiresAt: "2026-05-25T13:00:00Z",
    risk: "low", location: "Denver, CO", ipAddress: "73.162.xx.xx",
    verified: true, stepUpAuth: true, mfaVerified: true, continuousVerification: true, riskFactors: [],
  },
  {
    id: "sess-2", userId: "wm-2", userName: "Alex Rivera", deviceId: "dev-3", deviceName: "ThinkPad X1",
    startedAt: "2026-05-25T00:30:00Z", lastActivity: "2026-05-25T05:00:00Z", expiresAt: "2026-05-25T12:30:00Z",
    risk: "low", location: "San Francisco, CA", ipAddress: "104.28.xx.xx",
    verified: true, stepUpAuth: false, mfaVerified: true, continuousVerification: true, riskFactors: [],
  },
  {
    id: "sess-3", userId: "wm-3", userName: "Sarah Chen", deviceId: "dev-4", deviceName: "MacBook Air",
    startedAt: "2026-05-25T02:00:00Z", lastActivity: "2026-05-25T04:45:00Z", expiresAt: "2026-05-25T14:00:00Z",
    risk: "low", location: "Seattle, WA", ipAddress: "76.191.xx.xx",
    verified: true, stepUpAuth: true, mfaVerified: true, continuousVerification: true, riskFactors: [],
  },
  {
    id: "sess-4", userId: "wm-4", userName: "Marcus Liu", deviceId: "dev-5", deviceName: "Dev Workstation",
    startedAt: "2026-05-25T03:00:00Z", lastActivity: "2026-05-25T05:10:00Z", expiresAt: "2026-05-25T15:00:00Z",
    risk: "medium", location: "Austin, TX", ipAddress: "99.47.xx.xx",
    verified: true, stepUpAuth: false, mfaVerified: true, continuousVerification: false,
    riskFactors: ["No hardware key", "Continuous verification disabled"],
  },
  {
    id: "sess-5", userId: "wm-5", userName: "Maya Patel", deviceId: "dev-9", deviceName: "Personal Laptop",
    startedAt: "2026-05-24T20:00:00Z", lastActivity: "2026-05-25T02:30:00Z", expiresAt: "2026-05-25T08:00:00Z",
    risk: "high", location: "Chicago, IL", ipAddress: "68.31.xx.xx",
    verified: true, stepUpAuth: false, mfaVerified: false, continuousVerification: false,
    riskFactors: ["No MFA", "Unregistered device", "No hardware key", "Session expiring soon"],
  },
  {
    id: "sess-6", userId: "agent-1", userName: "AegisOSAI Orchestrator", deviceId: "dev-6", deviceName: "Vercel Edge",
    startedAt: "2026-05-25T00:00:00Z", lastActivity: "2026-05-25T05:15:00Z", expiresAt: "2026-05-26T00:00:00Z",
    risk: "low", location: "us-east-1", ipAddress: "76.76.21.xx",
    verified: true, stepUpAuth: false, mfaVerified: false, continuousVerification: true, riskFactors: [],
  },
];

export const securityIntelEvents: SecurityIntelEvent[] = [
  {
    id: "sie-1", type: "suspicious-login", severity: "critical",
    title: "Blocked login attempt from Moscow, Russia",
    description: "142 failed login attempts detected from IP 91.214.xx.xx within 15 minutes. Source IP has been automatically blocked. Credential stuffing pattern detected.",
    actor: "Unknown", location: "Moscow, Russia", timestamp: "2026-05-24T03:00:00Z",
    status: "mitigated", automated: true, relatedEntities: ["dev-8", "ws-ironreserve"],
  },
  {
    id: "sie-2", type: "impossible-travel", severity: "high",
    title: "Impossible travel detected — Maya Patel",
    description: "Login from Chicago, IL detected 2 hours after session in Denver, CO. Geographic distance incompatible with travel time. Session flagged for review.",
    actor: "Maya Patel", location: "Chicago, IL → Denver, CO", timestamp: "2026-05-24T20:00:00Z",
    status: "investigating", automated: true, relatedEntities: ["wm-5", "sess-5"],
  },
  {
    id: "sie-3", type: "stale-permission", severity: "warning",
    title: "Jordan Blake — 72 hours inactive, retains full access",
    description: "User has not been active for 72+ hours but retains read-only workspace access. Recommend access review or temporary suspension per zero-trust policy.",
    actor: "Jordan Blake", timestamp: "2026-05-25T00:00:00Z",
    status: "detected", automated: true, relatedEntities: ["wm-6", "ws-operations"],
  },
  {
    id: "sie-4", type: "credential-exposure", severity: "high",
    title: "Deprecated staging API key detected in public repository",
    description: "Automated scan detected a revoked staging environment API key in a public GitHub repository fork. Key was already revoked but exposure indicates potential historical access.",
    timestamp: "2026-05-23T14:00:00Z",
    status: "resolved", automated: true, relatedEntities: ["key-staging-old"],
  },
  {
    id: "sie-5", type: "anomalous-behavior", severity: "warning",
    title: "AegisOSAI — 340% API volume spike",
    description: "AI orchestrator API call volume increased 340% above 30-day baseline. Correlates with cross-workspace summary generation. No malicious pattern detected but monitoring continues.",
    actor: "AegisOSAI Orchestrator", timestamp: "2026-05-24T10:00:00Z",
    status: "investigating", automated: true, relatedEntities: ["agent-1"],
  },
  {
    id: "sie-6", type: "ai-misuse", severity: "warning",
    title: "Security Scanner attempted founder-private workspace access",
    description: "Security Compliance Scanner (agent-7) attempted to enumerate founder-private workspace contents. Access was denied per governance policy. Agent compliance score reduced.",
    actor: "Security Compliance Scanner", timestamp: "2026-05-24T22:00:00Z",
    status: "mitigated", automated: true, relatedEntities: ["agent-7", "ws-founder"],
  },
  {
    id: "sie-7", type: "brute-force", severity: "critical",
    title: "Distributed credential scan — 4 source IPs",
    description: "Coordinated credential scanning detected from 4 different IP addresses across 3 countries. All attempts blocked. Pattern consistent with automated attack framework.",
    location: "Multiple (NL, RO, VN)", timestamp: "2026-05-23T06:00:00Z",
    status: "mitigated", automated: true, relatedEntities: ["ws-ironreserve"],
  },
  {
    id: "sie-8", type: "privilege-escalation", severity: "high",
    title: "CTO role accumulated 9 resource permissions (original: 4)",
    description: "Permission drift detected for Alex Rivera (CTO). Current access includes 9 distinct resource scopes vs. original role baseline of 4. Recommend role review.",
    actor: "Alex Rivera", timestamp: "2026-05-22T00:00:00Z",
    status: "detected", automated: true, relatedEntities: ["wm-2"],
  },
  {
    id: "sie-9", type: "anomalous-behavior", severity: "info",
    title: "Off-hours database query pattern — Marcus Liu",
    description: "Infrastructure queries detected between 02:00-04:00 local time, outside normal working hours. Pattern consistent with deployment window — likely benign.",
    actor: "Marcus Liu", timestamp: "2026-05-25T03:00:00Z",
    status: "resolved", automated: true, relatedEntities: ["wm-4"],
  },
  {
    id: "sie-10", type: "suspicious-login", severity: "warning",
    title: "New device login — Marcus Liu from Austin, TX",
    description: "First-time device detected for Marcus Liu. Device fingerprint does not match any registered devices. MFA was verified successfully.",
    actor: "Marcus Liu", location: "Austin, TX", timestamp: "2026-05-25T03:00:00Z",
    status: "resolved", automated: true, relatedEntities: ["wm-4", "dev-5"],
  },
];

export const trustScores: TrustScore[] = [
  {
    category: "Encryption Health", score: 94, maxScore: 100, trend: "stable",
    factors: [
      { name: "All active keys within rotation schedule", impact: "positive", detail: "12/14 keys active with valid expiration" },
      { name: "Hardware protection on critical keys", impact: "positive", detail: "7 of 14 keys hardware-protected" },
      { name: "Audit trail key approaching rotation", impact: "negative", detail: "68 days until rotation due" },
      { name: "Deprecated staging key exposure", impact: "negative", detail: "Revoked key detected in public repo" },
    ],
  },
  {
    category: "Device Trust", score: 87, maxScore: 100, trend: "improving",
    factors: [
      { name: "6 of 7 known devices trusted or verified", impact: "positive", detail: "1 blocked device (Moscow)" },
      { name: "Hardware keys active for 3 users", impact: "positive", detail: "Brendon, Alex, Sarah" },
      { name: "Biometric capability on 3 devices", impact: "positive", detail: "MacBook Pro, iPhone, MacBook Air" },
      { name: "1 unregistered device in active session", impact: "negative", detail: "Maya Patel's personal laptop" },
    ],
  },
  {
    category: "Session Integrity", score: 82, maxScore: 100, trend: "stable",
    factors: [
      { name: "4 of 6 sessions fully verified", impact: "positive", detail: "MFA + continuous verification" },
      { name: "1 high-risk session detected", impact: "negative", detail: "Maya Patel — no MFA, unregistered device" },
      { name: "1 medium-risk session", impact: "negative", detail: "Marcus Liu — no hardware key, CV disabled" },
      { name: "All AI agent sessions verified", impact: "positive", detail: "Continuous verification active" },
    ],
  },
  {
    category: "Identity Confidence", score: 89, maxScore: 100, trend: "stable",
    factors: [
      { name: "6 of 8 members MFA-enabled", impact: "positive", detail: "75% MFA adoption" },
      { name: "Founder has hardware key + biometric", impact: "positive", detail: "Maximum identity assurance" },
      { name: "2 members without MFA", impact: "negative", detail: "Maya Patel, Jordan Blake" },
      { name: "1 inactive member retains access", impact: "negative", detail: "Jordan Blake — 72h inactive" },
    ],
  },
  {
    category: "AI Governance Integrity", score: 91, maxScore: 100, trend: "declining",
    factors: [
      { name: "6 of 7 agents governance-compliant", impact: "positive", detail: ">90% compliance score" },
      { name: "All founder-private access denied correctly", impact: "positive", detail: "Zero unauthorized AI access" },
      { name: "1 agent below compliance threshold", impact: "negative", detail: "Security Compliance Scanner at 87%" },
      { name: "AegisOSAI volume spike under investigation", impact: "negative", detail: "340% above baseline" },
    ],
  },
  {
    category: "Operational Trust Score", score: 88, maxScore: 100, trend: "stable",
    factors: [
      { name: "Zero successful unauthorized access", impact: "positive", detail: "All breaches blocked" },
      { name: "Encryption coverage at 96%", impact: "positive", detail: "4% unencrypted legacy fields remaining" },
      { name: "Zero-trust compliance at 84%", impact: "negative", detail: "Session and device gaps" },
      { name: "2 active security investigations", impact: "negative", detail: "Impossible travel, API volume spike" },
    ],
  },
];

export const lockdownState: LockdownState = {
  level: "none",
  affectedWorkspaces: [],
  revokedSessions: 0,
  frozenAiAgents: 0,
  frozenCredentials: 0,
};

export const encryptionStats: EncryptionStats = {
  totalKeys: 14,
  activeKeys: 12,
  rotationsDue: 2,
  trustedDevices: 7,
  activeSessions: 6,
  highRiskSessions: 1,
  overallTrustScore: 88,
  encryptionCoverage: 96,
  securityEvents24h: 5,
  lockdownLevel: "none",
  zeroTrustCompliance: 84,
  keyHealthScore: 94,
};
