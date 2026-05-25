"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { EcosystemEngine } from "@/lib/ecosystem-engine";
import {
  ecosystemProducts, ecosystemLinks, ecosystemWorkflows, ecosystemRecommendations,
} from "@/data/ecosystem-data";

const EcosystemContext = createContext<EcosystemEngine | null>(null);

export function EcosystemProvider({ children }: { children: ReactNode }) {
  const engine = useMemo(
    () => new EcosystemEngine(ecosystemProducts, ecosystemLinks, ecosystemWorkflows, ecosystemRecommendations),
    []
  );

  return (
    <EcosystemContext.Provider value={engine}>
      {children}
    </EcosystemContext.Provider>
  );
}

export function useEcosystem() {
  const ctx = useContext(EcosystemContext);
  if (!ctx) throw new Error("useEcosystem must be used within EcosystemProvider");
  return ctx;
}
