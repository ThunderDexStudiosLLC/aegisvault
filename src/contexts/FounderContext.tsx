"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { FounderCommandEngine } from "@/lib/founder-engine";
import {
  founderDigests, strategicResurfaces, continuityReminders,
  founderDecisionLogs, executiveContinuitySummaries,
} from "@/data/founder-data";

const FounderContext = createContext<FounderCommandEngine | null>(null);

export function FounderProvider({ children }: { children: ReactNode }) {
  const engine = useMemo(
    () => new FounderCommandEngine(
      founderDigests, strategicResurfaces, continuityReminders,
      founderDecisionLogs, executiveContinuitySummaries,
    ),
    []
  );

  return (
    <FounderContext.Provider value={engine}>
      {children}
    </FounderContext.Provider>
  );
}

export function useFounder() {
  const ctx = useContext(FounderContext);
  if (!ctx) throw new Error("useFounder must be used within FounderProvider");
  return ctx;
}
