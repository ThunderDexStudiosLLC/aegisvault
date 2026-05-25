"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type OrbState =
  | "idle"
  | "listening"
  | "processing"
  | "alert"
  | "secure"
  | "communications"
  | "founder"
  | "research"
  | "autonomous"
  | "emergency-lockdown"
  | "indexing"
  | "searching"
  | "linking-memory"
  | "generating-summaries"
  | "high-orchestration"
  | "executive-briefing"
  | "synchronization";

interface OrbContextValue {
  state: OrbState;
  setState: (state: OrbState) => void;
  pulse: () => void;
  label: string;
}

const orbLabels: Record<OrbState, string> = {
  idle: "Standing By",
  listening: "Listening",
  processing: "Processing",
  alert: "Security Alert",
  secure: "All Systems Secure",
  communications: "Communications Active",
  founder: "Founder Mode",
  research: "Research & Scanning",
  autonomous: "Autonomous Operation",
  "emergency-lockdown": "Emergency Lockdown",
  indexing: "Indexing Vault",
  searching: "Scanning Memory",
  "linking-memory": "Linking Memory",
  "generating-summaries": "Generating Summary",
  "high-orchestration": "Orchestrating",
  "executive-briefing": "Executive Briefing",
  synchronization: "Synchronizing",
};

const OrbContext = createContext<OrbContextValue | null>(null);

export function OrbProvider({ children }: { children: ReactNode }) {
  const [state, setOrbState] = useState<OrbState>("idle");

  const setState = useCallback((next: OrbState) => {
    setOrbState(next);
  }, []);

  const pulse = useCallback(() => {
    setOrbState("searching");
    setTimeout(() => setOrbState("idle"), 2000);
  }, []);

  return (
    <OrbContext.Provider value={{ state, setState, pulse, label: orbLabels[state] }}>
      {children}
    </OrbContext.Provider>
  );
}

export function useOrb() {
  const ctx = useContext(OrbContext);
  if (!ctx) throw new Error("useOrb must be used within OrbProvider");
  return ctx;
}
