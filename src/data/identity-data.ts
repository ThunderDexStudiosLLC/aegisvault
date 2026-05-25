import type {
  IdentityProfile, AccessRole, StoredCredential, AccessEvent,
  EmergencyContact, SecurityPosture,
} from "@/types";

/* ================================================================
   IDENTITY PROFILES
   ================================================================ */

export const identityProfiles: IdentityProfile[] = [
  {
    id: "id-bren",
    displayName: "Brendon Kahmann",
    email: "bren@ironreserve.io",
    role: "Founder & CEO",
    department: "Executive",
    status: "active",
    mfaEnabled: true,
    mfaMethods: ["totp", "hardware-key"],
    lastLogin: "2026-05-25T04:30:00Z",
    createdAt: "2026-03-15T08:00:00Z",
    securityScore: 94,
    permissions: ["system:admin", "vault:full", "identity:admin", "ecosystem:admin", "billing:admin"],
    workspaceIds: ["ws-ironreserve", "ws-kahmannai", "ws-civicops"],
    trustedDevices: [
      { id: "td-1", name: "MacBook Pro 16\"", type: "desktop", os: "macOS 15.4", browser: "Chrome 126", lastActive: "2026-05-25T04:30:00Z", location: "Austin, TX", trusted: true, fingerprint: "a1b2c3d4" },
      { id: "td-2", name: "iPhone 16 Pro", type: "mobile", os: "iOS 19.5", lastActive: "2026-05-24T22:15:00Z", location: "Austin, TX", trusted: true, fingerprint: "e5f6g7h8" },
      { id: "td-3", name: "iPad Pro M4", type: "tablet", os: "iPadOS 19.5", browser: "Safari", lastActive: "2026-05-23T18:00:00Z", location: "Austin, TX", trusted: true, fingerprint: "i9j0k1l2" },
    ],
    activeSessions: [
      { id: "ses-1", identityId: "id-bren", deviceId: "td-1", ipAddress: "73.162.xx.xx", location: "Austin, TX", startedAt: "2026-05-25T04:00:00Z", lastActivity: "2026-05-25T04:30:00Z", status: "active", userAgent: "Chrome/126 macOS" },
      { id: "ses-2", identityId: "id-bren", deviceId: "td-2", ipAddress: "73.162.xx.xx", location: "Austin, TX", startedAt: "2026-05-24T20:00:00Z", lastActivity: "2026-05-24T22:15:00Z", status: "idle", userAgent: "Safari/iOS" },
    ],
  },
  {
    id: "id-alex",
    displayName: "Alex Rivera",
    email: "alex@ironreserve.io",
    role: "CTO",
    department: "Engineering",
    status: "active",
    mfaEnabled: true,
    mfaMethods: ["totp"],
    lastLogin: "2026-05-25T03:45:00Z",
    createdAt: "2026-03-20T10:00:00Z",
    securityScore: 88,
    permissions: ["vault:read-write", "identity:read", "ecosystem:read-write", "engineering:admin"],
    workspaceIds: ["ws-ironreserve", "ws-kahmannai"],
    trustedDevices: [
      { id: "td-4", name: "ThinkPad X1 Carbon", type: "desktop", os: "Ubuntu 24.04", browser: "Firefox 130", lastActive: "2026-05-25T03:45:00Z", location: "San Francisco, CA", trusted: true, fingerprint: "m3n4o5p6" },
    ],
    activeSessions: [
      { id: "ses-3", identityId: "id-alex", deviceId: "td-4", ipAddress: "104.28.xx.xx", location: "San Francisco, CA", startedAt: "2026-05-25T02:00:00Z", lastActivity: "2026-05-25T03:45:00Z", status: "active" },
    ],
  },
  {
    id: "id-sarah",
    displayName: "Sarah Chen",
    email: "sarah@ironreserve.io",
    role: "Security Lead",
    department: "Security",
    status: "active",
    mfaEnabled: true,
    mfaMethods: ["totp", "hardware-key", "biometric"],
    lastLogin: "2026-05-24T16:00:00Z",
    createdAt: "2026-04-01T09:00:00Z",
    securityScore: 97,
    permissions: ["vault:read-write", "identity:admin", "security:admin", "audit:admin"],
    workspaceIds: ["ws-ironreserve"],
    trustedDevices: [
      { id: "td-5", name: "MacBook Air M3", type: "desktop", os: "macOS 15.4", browser: "Chrome 126", lastActive: "2026-05-24T16:00:00Z", location: "Seattle, WA", trusted: true, fingerprint: "q7r8s9t0" },
      { id: "td-6", name: "YubiKey 5C NFC", type: "server", os: "Hardware Key", lastActive: "2026-05-24T16:00:00Z", trusted: true, fingerprint: "u1v2w3x4" },
    ],
    activeSessions: [],
  },
  {
    id: "id-marcus",
    displayName: "Marcus Liu",
    email: "marcus@ironreserve.io",
    role: "Lead Engineer",
    department: "Engineering",
    status: "active",
    mfaEnabled: true,
    mfaMethods: ["totp"],
    lastLogin: "2026-05-24T22:00:00Z",
    createdAt: "2026-04-10T11:00:00Z",
    securityScore: 82,
    permissions: ["vault:read", "engineering:read-write", "forgeops:admin", "thundercode:admin"],
    workspaceIds: ["ws-ironreserve", "ws-kahmannai"],
    trustedDevices: [
      { id: "td-7", name: "MacBook Pro 14\"", type: "desktop", os: "macOS 15.4", browser: "Chrome 126", lastActive: "2026-05-24T22:00:00Z", location: "New York, NY", trusted: true, fingerprint: "y5z6a7b8" },
    ],
    activeSessions: [],
  },
  {
    id: "id-maya",
    displayName: "Maya Patel",
    email: "maya@ironreserve.io",
    role: "Operations Manager",
    department: "Operations",
    status: "active",
    mfaEnabled: false,
    mfaMethods: [],
    lastLogin: "2026-05-23T14:00:00Z",
    createdAt: "2026-04-15T14:00:00Z",
    securityScore: 64,
    permissions: ["vault:read", "callaxis:read-write", "operations:read-write"],
    workspaceIds: ["ws-ironreserve"],
    trustedDevices: [
      { id: "td-8", name: "Dell XPS 15", type: "desktop", os: "Windows 11", browser: "Edge 126", lastActive: "2026-05-23T14:00:00Z", location: "Austin, TX", trusted: true, fingerprint: "c9d0e1f2" },
    ],
    activeSessions: [],
  },
  {
    id: "id-aegisai",
    displayName: "AegisOSAI Agent",
    email: "agent@aegisosai.internal",
    role: "AI Orchestration Agent",
    department: "AI Systems",
    status: "active",
    mfaEnabled: false,
    mfaMethods: [],
    lastLogin: "2026-05-25T04:30:00Z",
    createdAt: "2026-05-01T00:00:00Z",
    securityScore: 90,
    permissions: ["ecosystem:execute", "memory:read-write", "workflow:execute", "analytics:read"],
    workspaceIds: ["ws-ironreserve", "ws-kahmannai"],
    trustedDevices: [
      { id: "td-9", name: "AegisOSAI Orchestration Server", type: "ai-agent", os: "AegisOS Runtime v0.9", lastActive: "2026-05-25T04:30:00Z", trusted: true, fingerprint: "ai-orch-001" },
    ],
    activeSessions: [
      { id: "ses-4", identityId: "id-aegisai", deviceId: "td-9", ipAddress: "10.0.xx.xx", startedAt: "2026-05-25T00:00:00Z", lastActivity: "2026-05-25T04:30:00Z", status: "active" },
    ],
  },
  {
    id: "id-jordan",
    displayName: "Jordan Blake",
    email: "jordan@ironreserve.io",
    role: "Finance Lead",
    department: "Finance",
    status: "pending",
    mfaEnabled: false,
    mfaMethods: [],
    lastLogin: "2026-05-20T10:00:00Z",
    createdAt: "2026-05-15T09:00:00Z",
    securityScore: 45,
    permissions: ["aegispay:admin", "billing:read-write"],
    workspaceIds: ["ws-ironreserve"],
    trustedDevices: [],
    activeSessions: [],
  },
];

/* ================================================================
   ACCESS ROLES
   ================================================================ */

export const accessRoles: AccessRole[] = [
  {
    id: "ar-founder",
    name: "Founder",
    description: "Full system access with identity governance, ecosystem administration, and emergency recovery capabilities.",
    level: "system",
    permissions: [
      { id: "p1", resource: "system", actions: ["read", "write", "delete", "admin"], scope: "global" },
      { id: "p2", resource: "identity", actions: ["read", "write", "delete", "admin"], scope: "global" },
      { id: "p3", resource: "vault", actions: ["read", "write", "delete", "admin"], scope: "global" },
      { id: "p4", resource: "ecosystem", actions: ["read", "write", "admin", "execute"], scope: "global" },
      { id: "p5", resource: "billing", actions: ["read", "write", "admin"], scope: "global" },
    ],
    memberCount: 1,
    createdAt: "2026-03-15T08:00:00Z",
    isSystem: true,
    color: "#f59e0b",
  },
  {
    id: "ar-executive",
    name: "Executive",
    description: "Organization-wide read-write access with limited identity management and ecosystem oversight.",
    level: "organization",
    permissions: [
      { id: "p6", resource: "vault", actions: ["read", "write"], scope: "organization" },
      { id: "p7", resource: "identity", actions: ["read"], scope: "organization" },
      { id: "p8", resource: "ecosystem", actions: ["read", "write"], scope: "organization" },
      { id: "p9", resource: "analytics", actions: ["read"], scope: "organization" },
    ],
    memberCount: 2,
    createdAt: "2026-03-20T10:00:00Z",
    isSystem: true,
    color: "#8b5cf6",
  },
  {
    id: "ar-security",
    name: "Security Admin",
    description: "Full security and identity management access. Can audit, monitor, and configure access policies.",
    level: "system",
    permissions: [
      { id: "p10", resource: "identity", actions: ["read", "write", "admin"], scope: "global" },
      { id: "p11", resource: "security", actions: ["read", "write", "admin"], scope: "global" },
      { id: "p12", resource: "audit", actions: ["read", "write", "admin"], scope: "global" },
      { id: "p13", resource: "credentials", actions: ["read", "admin"], scope: "global" },
    ],
    memberCount: 1,
    createdAt: "2026-04-01T09:00:00Z",
    isSystem: true,
    color: "#ef4444",
  },
  {
    id: "ar-engineer",
    name: "Engineer",
    description: "Read-write access to engineering workspaces, CI/CD, and development infrastructure.",
    level: "workspace",
    permissions: [
      { id: "p14", resource: "vault", actions: ["read"], scope: "workspace" },
      { id: "p15", resource: "engineering", actions: ["read", "write", "execute"], scope: "workspace" },
      { id: "p16", resource: "forgeops", actions: ["read", "write", "execute"], scope: "workspace" },
    ],
    memberCount: 3,
    createdAt: "2026-04-10T11:00:00Z",
    isSystem: true,
    color: "#3b82f6",
  },
  {
    id: "ar-operations",
    name: "Operations",
    description: "Read-write access to operational systems and communication platforms.",
    level: "workspace",
    permissions: [
      { id: "p17", resource: "vault", actions: ["read"], scope: "workspace" },
      { id: "p18", resource: "operations", actions: ["read", "write"], scope: "workspace" },
      { id: "p19", resource: "callaxis", actions: ["read", "write"], scope: "workspace" },
    ],
    memberCount: 2,
    createdAt: "2026-04-15T14:00:00Z",
    isSystem: true,
    color: "#06b6d4",
  },
  {
    id: "ar-ai-agent",
    name: "AI Agent",
    description: "Scoped execution access for AI orchestration agents. Can read memory, execute workflows, and access analytics.",
    level: "ai-agent",
    permissions: [
      { id: "p20", resource: "memory", actions: ["read", "write"], scope: "global" },
      { id: "p21", resource: "workflow", actions: ["execute"], scope: "global" },
      { id: "p22", resource: "ecosystem", actions: ["execute"], scope: "global" },
      { id: "p23", resource: "analytics", actions: ["read"], scope: "global" },
    ],
    memberCount: 1,
    createdAt: "2026-05-01T00:00:00Z",
    isSystem: true,
    color: "#22c55e",
  },
  {
    id: "ar-viewer",
    name: "Viewer",
    description: "Read-only access across permitted workspaces. Cannot modify data or credentials.",
    level: "project",
    permissions: [
      { id: "p24", resource: "vault", actions: ["read"], scope: "project" },
      { id: "p25", resource: "analytics", actions: ["read"], scope: "project" },
    ],
    memberCount: 0,
    createdAt: "2026-03-15T08:00:00Z",
    isSystem: true,
    color: "#64748b",
  },
];

/* ================================================================
   STORED CREDENTIALS
   ================================================================ */

export const storedCredentials: StoredCredential[] = [
  { id: "sc-1", name: "Supabase Production", type: "api-key", service: "Supabase", encrypted: true, strength: "excellent", createdAt: "2026-04-05T08:00:00Z", updatedAt: "2026-05-15T10:00:00Z", expiresAt: "2027-04-05T08:00:00Z", lastUsed: "2026-05-25T04:30:00Z", usageCount: 1247, rotationDue: "2026-07-05T08:00:00Z", tags: ["production", "database", "aegisvault"], linkedProductId: "ep-aegisvault" },
  { id: "sc-2", name: "OpenAI API Key", type: "api-key", service: "OpenAI", encrypted: true, strength: "excellent", createdAt: "2026-04-10T09:00:00Z", updatedAt: "2026-05-10T12:00:00Z", lastUsed: "2026-05-25T03:00:00Z", usageCount: 856, rotationDue: "2026-06-10T09:00:00Z", tags: ["ai", "embeddings", "search"], linkedProductId: "ep-aegisvault" },
  { id: "sc-3", name: "GitHub Deploy Token", type: "oauth-token", service: "GitHub", username: "ThunderDexStudiosLLC", encrypted: true, strength: "strong", createdAt: "2026-04-08T14:00:00Z", updatedAt: "2026-05-20T09:00:00Z", expiresAt: "2026-08-08T14:00:00Z", lastUsed: "2026-05-25T04:00:00Z", usageCount: 342, tags: ["ci-cd", "deployment"], linkedProductId: "ep-forgeops" },
  { id: "sc-4", name: "Vercel Production", type: "api-key", service: "Vercel", encrypted: true, strength: "excellent", createdAt: "2026-04-12T11:00:00Z", updatedAt: "2026-05-18T16:00:00Z", lastUsed: "2026-05-24T22:00:00Z", usageCount: 198, tags: ["deployment", "hosting"], linkedProductId: "ep-forgeops" },
  { id: "sc-5", name: "Stripe Secret Key", type: "api-key", service: "Stripe", encrypted: true, strength: "excellent", createdAt: "2026-05-15T10:00:00Z", updatedAt: "2026-05-15T10:00:00Z", lastUsed: "2026-05-20T14:00:00Z", usageCount: 23, rotationDue: "2026-08-15T10:00:00Z", tags: ["payments", "billing"], linkedProductId: "ep-aegispay" },
  { id: "sc-6", name: "Production SSH Key", type: "ssh-key", service: "Infrastructure", encrypted: true, strength: "excellent", createdAt: "2026-04-05T08:00:00Z", updatedAt: "2026-04-05T08:00:00Z", lastUsed: "2026-05-24T18:00:00Z", usageCount: 87, tags: ["infrastructure", "servers"], linkedProductId: "ep-forgeops" },
  { id: "sc-7", name: "TLS Certificate — *.aegisvault.io", type: "certificate", service: "Let's Encrypt", encrypted: true, createdAt: "2026-04-20T00:00:00Z", updatedAt: "2026-04-20T00:00:00Z", expiresAt: "2026-07-20T00:00:00Z", usageCount: 0, rotationDue: "2026-07-10T00:00:00Z", tags: ["ssl", "certificate", "production"] },
  { id: "sc-8", name: "Twilio API Key", type: "api-key", service: "Twilio", encrypted: true, strength: "strong", createdAt: "2026-04-25T09:00:00Z", updatedAt: "2026-05-10T11:00:00Z", lastUsed: "2026-05-24T15:00:00Z", usageCount: 534, tags: ["communication", "sms", "calls"], linkedProductId: "ep-callaxis" },
  { id: "sc-9", name: "AWS Root Recovery", type: "recovery-code", service: "AWS", encrypted: true, createdAt: "2026-03-15T08:00:00Z", updatedAt: "2026-03-15T08:00:00Z", usageCount: 0, tags: ["emergency", "recovery", "infrastructure"] },
  { id: "sc-10", name: "Database Master Password", type: "password", service: "PostgreSQL", username: "aegis_admin", encrypted: true, strength: "excellent", createdAt: "2026-04-05T08:00:00Z", updatedAt: "2026-05-01T10:00:00Z", lastUsed: "2026-05-20T09:00:00Z", usageCount: 15, rotationDue: "2026-06-01T10:00:00Z", tags: ["database", "production", "critical"] },
  { id: "sc-11", name: "AegisOSAI Service Token", type: "infra-secret", service: "AegisOSAI", encrypted: true, strength: "excellent", createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-05-20T14:00:00Z", lastUsed: "2026-05-25T04:30:00Z", usageCount: 3400, tags: ["ai-agent", "orchestration", "internal"], linkedProductId: "ep-aegisosai" },
  { id: "sc-12", name: "Staging Environment", type: "password", service: "Staging Cluster", username: "staging_admin", encrypted: true, strength: "fair", createdAt: "2026-04-15T10:00:00Z", updatedAt: "2026-04-15T10:00:00Z", lastUsed: "2026-05-22T11:00:00Z", usageCount: 45, rotationDue: "2026-05-25T00:00:00Z", tags: ["staging", "testing"], notes: "Rotation overdue" },
];

/* ================================================================
   ACCESS EVENTS
   ================================================================ */

export const accessEvents: AccessEvent[] = [
  { id: "ae-1", type: "login", identityId: "id-bren", identityName: "Brendon Kahmann", description: "Successful login via TOTP MFA", ipAddress: "73.162.xx.xx", location: "Austin, TX", deviceInfo: "Chrome/126 macOS", timestamp: "2026-05-25T04:00:00Z", severity: "info", resolved: true },
  { id: "ae-2", type: "session-created", identityId: "id-aegisai", identityName: "AegisOSAI Agent", description: "AI agent session initialized — daily orchestration cycle", ipAddress: "10.0.xx.xx", timestamp: "2026-05-25T00:00:00Z", severity: "info", resolved: true },
  { id: "ae-3", type: "login", identityId: "id-alex", identityName: "Alex Rivera", description: "Successful login via TOTP MFA", ipAddress: "104.28.xx.xx", location: "San Francisco, CA", deviceInfo: "Firefox/130 Ubuntu", timestamp: "2026-05-25T02:00:00Z", severity: "info", resolved: true },
  { id: "ae-4", type: "credential-access", identityId: "id-bren", identityName: "Brendon Kahmann", description: "Accessed Supabase Production API key", ipAddress: "73.162.xx.xx", location: "Austin, TX", timestamp: "2026-05-24T22:30:00Z", severity: "info", resolved: true },
  { id: "ae-5", type: "failed-login", identityId: "id-maya", identityName: "Maya Patel", description: "Failed login attempt — incorrect password (attempt 1/5)", ipAddress: "73.162.xx.xx", location: "Austin, TX", deviceInfo: "Edge/126 Windows", timestamp: "2026-05-24T14:05:00Z", severity: "warning", resolved: true },
  { id: "ae-6", type: "login", identityId: "id-maya", identityName: "Maya Patel", description: "Successful login after password correction", ipAddress: "73.162.xx.xx", location: "Austin, TX", timestamp: "2026-05-24T14:06:00Z", severity: "info", resolved: true },
  { id: "ae-7", type: "anomaly", identityId: "id-marcus", identityName: "Marcus Liu", description: "Login from new location — New York, NY (previously San Francisco only)", ipAddress: "156.42.xx.xx", location: "New York, NY", deviceInfo: "Chrome/126 macOS", timestamp: "2026-05-24T09:00:00Z", severity: "warning", resolved: true },
  { id: "ae-8", type: "permission-change", identityId: "id-jordan", identityName: "Jordan Blake", description: "Granted aegispay:admin permission by Brendon Kahmann", ipAddress: "73.162.xx.xx", timestamp: "2026-05-23T16:00:00Z", severity: "info", resolved: true },
  { id: "ae-9", type: "key-rotation", identityId: "id-bren", identityName: "Brendon Kahmann", description: "Rotated OpenAI API key — scheduled rotation", ipAddress: "73.162.xx.xx", location: "Austin, TX", timestamp: "2026-05-22T10:00:00Z", severity: "info", resolved: true },
  { id: "ae-10", type: "mfa-challenge", identityId: "id-sarah", identityName: "Sarah Chen", description: "Hardware key MFA challenge — YubiKey 5C NFC verified", ipAddress: "198.51.xx.xx", location: "Seattle, WA", timestamp: "2026-05-22T09:00:00Z", severity: "info", resolved: true },
  { id: "ae-11", type: "anomaly", identityId: "id-bren", identityName: "System", description: "Unusual API call volume from AegisOSAI agent — 340% above baseline", ipAddress: "10.0.xx.xx", timestamp: "2026-05-21T03:00:00Z", severity: "critical", resolved: false },
  { id: "ae-12", type: "failed-login", identityId: "id-bren", identityName: "Unknown", description: "Failed login attempt on founder account from unrecognized IP", ipAddress: "45.33.xx.xx", location: "Moscow, RU", timestamp: "2026-05-20T18:30:00Z", severity: "critical", resolved: true },
];

/* ================================================================
   EMERGENCY CONTACTS
   ================================================================ */

export const emergencyContacts: EmergencyContact[] = [
  { id: "ec-1", name: "Alex Rivera", email: "alex@ironreserve.io", phone: "+1-415-555-0192", role: "delegated-admin", accessLevel: "limited", activationCondition: "Founder unavailable for 72+ hours or declared emergency", verified: true, addedAt: "2026-03-20T10:00:00Z", lastVerified: "2026-05-15T09:00:00Z" },
  { id: "ec-2", name: "Sarah Chen", email: "sarah@ironreserve.io", phone: "+1-206-555-0147", role: "operational-backup", accessLevel: "read-only", activationCondition: "Security incident or founder-declared emergency", verified: true, addedAt: "2026-04-01T09:00:00Z", lastVerified: "2026-05-10T14:00:00Z" },
  { id: "ec-3", name: "Victoria Chen", email: "victoria@horizonventures.com", role: "legal-custodian", accessLevel: "emergency-only", activationCondition: "Legal custodian for organizational continuity if founder incapacitated", verified: true, addedAt: "2026-05-03T14:00:00Z", lastVerified: "2026-05-03T14:00:00Z" },
  { id: "ec-4", name: "James Morrison", email: "james@microsoft.com", role: "recovery-contact", accessLevel: "emergency-only", activationCondition: "External recovery verification contact", verified: false, addedAt: "2026-04-28T10:00:00Z" },
];

/* ================================================================
   SECURITY POSTURE
   ================================================================ */

export const securityPosture: SecurityPosture = {
  overallScore: 78,
  mfaAdoption: 71,
  credentialHealth: 83,
  deviceTrust: 85,
  accessHygiene: 72,
  anomalyRate: 0.03,
  lastAudit: "2026-05-15T09:00:00Z",
  recommendations: [
    "Enable MFA for Maya Patel and Jordan Blake — 2 identities without multi-factor authentication",
    "Rotate staging environment password — overdue by 5 days",
    "Review AegisOSAI agent API call volume anomaly from May 21",
    "Complete Jordan Blake onboarding — identity still in pending status",
    "Schedule TLS certificate renewal — expires July 20",
    "Investigate failed login attempt from Moscow on founder account",
  ],
};
