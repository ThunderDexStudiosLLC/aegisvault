import {
  encryptionKeys, trustedDevices, activeSessions, securityIntelEvents,
  trustScores, lockdownState, encryptionStats,
} from "@/data/encryption-data";
import type {
  EncryptionKey, TrustInfraDevice, ActiveSession, SecurityIntelEvent,
  TrustScore, LockdownState, EncryptionStats, KeyType, KeyStatus,
  DeviceTrustLevel, SessionRisk,
} from "@/types";

export const EncryptionEngine = {
  getKeys: (): EncryptionKey[] => encryptionKeys,
  getKeysByType: (type: KeyType): EncryptionKey[] => encryptionKeys.filter((k) => k.type === type),
  getKeysByStatus: (status: KeyStatus): EncryptionKey[] => encryptionKeys.filter((k) => k.status === status),
  getActiveKeys: (): EncryptionKey[] => encryptionKeys.filter((k) => k.status === "active"),
  getKeysNeedingRotation: (): EncryptionKey[] => encryptionKeys.filter((k) => k.status === "active" && k.rotationDueDays < 90),
  getCompromisedKeys: (): EncryptionKey[] => encryptionKeys.filter((k) => k.status === "compromised" || k.exposureRisk === "high" || k.exposureRisk === "medium"),
  getHardwareProtectedKeys: (): EncryptionKey[] => encryptionKeys.filter((k) => k.hardwareProtected),

  getDevices: (): TrustInfraDevice[] => trustedDevices,
  getDevicesByTrust: (level: DeviceTrustLevel): TrustInfraDevice[] => trustedDevices.filter((d) => d.trustLevel === level),
  getTrustedDevices: (): TrustInfraDevice[] => trustedDevices.filter((d) => d.trustLevel === "trusted" || d.trustLevel === "verified"),
  getBlockedDevices: (): TrustInfraDevice[] => trustedDevices.filter((d) => d.trustLevel === "blocked"),

  getSessions: (): ActiveSession[] => activeSessions,
  getSessionsByRisk: (risk: SessionRisk): ActiveSession[] => activeSessions.filter((s) => s.risk === risk),
  getHighRiskSessions: (): ActiveSession[] => activeSessions.filter((s) => s.risk === "high" || s.risk === "critical"),
  getUnverifiedSessions: (): ActiveSession[] => activeSessions.filter((s) => !s.mfaVerified),

  getSecurityEvents: (): SecurityIntelEvent[] => securityIntelEvents,
  getCriticalEvents: (): SecurityIntelEvent[] => securityIntelEvents.filter((e) => e.severity === "critical" || e.severity === "high"),
  getActiveInvestigations: (): SecurityIntelEvent[] => securityIntelEvents.filter((e) => e.status === "investigating" || e.status === "detected"),
  getEventsByType: (type: SecurityIntelEvent["type"]): SecurityIntelEvent[] => securityIntelEvents.filter((e) => e.type === type),

  getTrustScores: (): TrustScore[] => trustScores,
  getLockdownState: (): LockdownState => lockdownState,
  getStats: (): EncryptionStats => encryptionStats,
};
