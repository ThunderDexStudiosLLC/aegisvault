"use client";

import { createContext, useContext, type ReactNode } from "react";
import { EncryptionEngine } from "@/lib/encryption-engine";
import type {
  EncryptionKey, TrustInfraDevice, ActiveSession, SecurityIntelEvent,
  TrustScore, LockdownState, EncryptionStats, KeyType, KeyStatus,
  DeviceTrustLevel, SessionRisk,
} from "@/types";

interface EncryptionContextValue {
  keys: EncryptionKey[];
  getKeysByType: (type: KeyType) => EncryptionKey[];
  getKeysByStatus: (status: KeyStatus) => EncryptionKey[];
  getActiveKeys: () => EncryptionKey[];
  getKeysNeedingRotation: () => EncryptionKey[];
  getCompromisedKeys: () => EncryptionKey[];
  getHardwareProtectedKeys: () => EncryptionKey[];
  devices: TrustInfraDevice[];
  getDevicesByTrust: (level: DeviceTrustLevel) => TrustInfraDevice[];
  getTrustedDevices: () => TrustInfraDevice[];
  getBlockedDevices: () => TrustInfraDevice[];
  sessions: ActiveSession[];
  getSessionsByRisk: (risk: SessionRisk) => ActiveSession[];
  getHighRiskSessions: () => ActiveSession[];
  getUnverifiedSessions: () => ActiveSession[];
  securityEvents: SecurityIntelEvent[];
  getCriticalEvents: () => SecurityIntelEvent[];
  getActiveInvestigations: () => SecurityIntelEvent[];
  getEventsByType: (type: SecurityIntelEvent["type"]) => SecurityIntelEvent[];
  trustScores: TrustScore[];
  lockdownState: LockdownState;
  stats: EncryptionStats;
}

const EncryptionContext = createContext<EncryptionContextValue | null>(null);

export function EncryptionProvider({ children }: { children: ReactNode }) {
  const value: EncryptionContextValue = {
    keys: EncryptionEngine.getKeys(),
    getKeysByType: EncryptionEngine.getKeysByType,
    getKeysByStatus: EncryptionEngine.getKeysByStatus,
    getActiveKeys: EncryptionEngine.getActiveKeys,
    getKeysNeedingRotation: EncryptionEngine.getKeysNeedingRotation,
    getCompromisedKeys: EncryptionEngine.getCompromisedKeys,
    getHardwareProtectedKeys: EncryptionEngine.getHardwareProtectedKeys,
    devices: EncryptionEngine.getDevices(),
    getDevicesByTrust: EncryptionEngine.getDevicesByTrust,
    getTrustedDevices: EncryptionEngine.getTrustedDevices,
    getBlockedDevices: EncryptionEngine.getBlockedDevices,
    sessions: EncryptionEngine.getSessions(),
    getSessionsByRisk: EncryptionEngine.getSessionsByRisk,
    getHighRiskSessions: EncryptionEngine.getHighRiskSessions,
    getUnverifiedSessions: EncryptionEngine.getUnverifiedSessions,
    securityEvents: EncryptionEngine.getSecurityEvents(),
    getCriticalEvents: EncryptionEngine.getCriticalEvents,
    getActiveInvestigations: EncryptionEngine.getActiveInvestigations,
    getEventsByType: EncryptionEngine.getEventsByType,
    trustScores: EncryptionEngine.getTrustScores(),
    lockdownState: EncryptionEngine.getLockdownState(),
    stats: EncryptionEngine.getStats(),
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption() {
  const ctx = useContext(EncryptionContext);
  if (!ctx) throw new Error("useEncryption must be used within EncryptionProvider");
  return ctx;
}
