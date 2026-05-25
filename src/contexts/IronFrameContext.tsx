"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { IronFrameEngine } from "@/lib/ironframe-engine";
import {
  securityRisks, securityAnomalies, identityRisks, permissionDrifts,
  aiGovernanceEvents, threatIntelFeed, securityGraphNodes, ironFrameStats,
} from "@/data/ironframe-data";

const IronFrameContext = createContext<IronFrameEngine | null>(null);

export function IronFrameProvider({ children }: { children: ReactNode }) {
  const engine = useMemo(
    () => new IronFrameEngine(
      securityRisks, securityAnomalies, identityRisks, permissionDrifts,
      aiGovernanceEvents, threatIntelFeed, securityGraphNodes, ironFrameStats,
    ),
    []
  );

  return (
    <IronFrameContext.Provider value={engine}>
      {children}
    </IronFrameContext.Provider>
  );
}

export function useIronFrame() {
  const ctx = useContext(IronFrameContext);
  if (!ctx) throw new Error("useIronFrame must be used within IronFrameProvider");
  return ctx;
}
