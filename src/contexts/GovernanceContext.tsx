"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { GovernanceEngine } from "@/lib/governance-engine";
import {
  governedMemories, memoryAccessRules, memoryRetentionPolicies,
  memoryAuditLog, founderProtectionZones, governanceStats,
} from "@/data/governance-data";

const GovernanceContext = createContext<GovernanceEngine | null>(null);

export function GovernanceProvider({ children }: { children: ReactNode }) {
  const engine = useMemo(
    () => new GovernanceEngine(
      governedMemories, memoryAccessRules, memoryRetentionPolicies,
      memoryAuditLog, founderProtectionZones, governanceStats,
    ),
    []
  );

  return (
    <GovernanceContext.Provider value={engine}>
      {children}
    </GovernanceContext.Provider>
  );
}

export function useGovernance() {
  const ctx = useContext(GovernanceContext);
  if (!ctx) throw new Error("useGovernance must be used within GovernanceProvider");
  return ctx;
}
