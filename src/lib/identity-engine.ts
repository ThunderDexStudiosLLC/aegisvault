import type {
  IdentityProfile, AccessRole, StoredCredential, AccessEvent,
  EmergencyContact, SecurityPosture, CredentialType,
} from "@/types";

export class IdentityEngine {
  private profiles: IdentityProfile[];
  private roles: AccessRole[];
  private credentials: StoredCredential[];
  private events: AccessEvent[];
  private emergencyContacts: EmergencyContact[];
  private posture: SecurityPosture;

  constructor(
    profiles: IdentityProfile[],
    roles: AccessRole[],
    credentials: StoredCredential[],
    events: AccessEvent[],
    emergencyContacts: EmergencyContact[],
    posture: SecurityPosture,
  ) {
    this.profiles = profiles;
    this.roles = roles;
    this.credentials = credentials;
    this.events = events;
    this.emergencyContacts = emergencyContacts;
    this.posture = posture;
  }

  getProfiles(): IdentityProfile[] { return this.profiles; }
  getProfile(id: string): IdentityProfile | undefined { return this.profiles.find((p) => p.id === id); }
  getActiveProfiles(): IdentityProfile[] { return this.profiles.filter((p) => p.status === "active"); }

  getRoles(): AccessRole[] { return this.roles; }
  getRole(id: string): AccessRole | undefined { return this.roles.find((r) => r.id === id); }

  getCredentials(): StoredCredential[] { return this.credentials; }
  getCredentialsByType(type: CredentialType): StoredCredential[] { return this.credentials.filter((c) => c.type === type); }
  getExpiringCredentials(withinDays: number): StoredCredential[] {
    const cutoff = new Date(Date.now() + withinDays * 86400000).toISOString();
    return this.credentials.filter((c) => c.expiresAt && c.expiresAt < cutoff);
  }
  getRotationDueCredentials(): StoredCredential[] {
    const now = new Date().toISOString();
    return this.credentials.filter((c) => c.rotationDue && c.rotationDue < now);
  }

  getEvents(): AccessEvent[] { return this.events; }
  getRecentEvents(count: number): AccessEvent[] { return this.events.slice(0, count); }
  getCriticalEvents(): AccessEvent[] { return this.events.filter((e) => e.severity === "critical"); }
  getUnresolvedEvents(): AccessEvent[] { return this.events.filter((e) => !e.resolved); }

  getEmergencyContacts(): EmergencyContact[] { return this.emergencyContacts; }
  getVerifiedContacts(): EmergencyContact[] { return this.emergencyContacts.filter((c) => c.verified); }

  getSecurityPosture(): SecurityPosture { return this.posture; }

  getStats(): {
    totalIdentities: number;
    activeIdentities: number;
    activeSessions: number;
    totalCredentials: number;
    rotationsDue: number;
    unresolvedEvents: number;
    mfaEnabled: number;
    totalDevices: number;
  } {
    const activeSessions = this.profiles.reduce((sum, p) => sum + p.activeSessions.filter((s) => s.status === "active").length, 0);
    const totalDevices = this.profiles.reduce((sum, p) => sum + p.trustedDevices.length, 0);
    return {
      totalIdentities: this.profiles.length,
      activeIdentities: this.profiles.filter((p) => p.status === "active").length,
      activeSessions,
      totalCredentials: this.credentials.length,
      rotationsDue: this.getRotationDueCredentials().length,
      unresolvedEvents: this.getUnresolvedEvents().length,
      mfaEnabled: this.profiles.filter((p) => p.mfaEnabled).length,
      totalDevices,
    };
  }
}
