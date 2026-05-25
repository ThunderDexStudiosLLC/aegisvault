"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { ContinuityEngine } from "@/lib/continuity-engine";
import {
  criticalAssets, recoveryProcedures, continuityIncidents,
  infraNodes, continuityStats,
} from "@/data/continuity-data";

const ContinuityContext = createContext<ContinuityEngine | null>(null);

export function ContinuityProvider({ children }: { children: ReactNode }) {
  const engine = useMemo(
    () => new ContinuityEngine(
      criticalAssets, recoveryProcedures, continuityIncidents,
      infraNodes, continuityStats,
    ),
    []
  );

  return (
    <ContinuityContext.Provider value={engine}>
      {children}
    </ContinuityContext.Provider>
  );
}

export function useContinuity() {
  const ctx = useContext(ContinuityContext);
  if (!ctx) throw new Error("useContinuity must be used within ContinuityProvider");
  return ctx;
}
