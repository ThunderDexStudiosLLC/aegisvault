"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { MemoryEngine } from "@/lib/memory-engine";
import { memoryNodes, memoryClusters, memoryLinks, memorySummaries } from "@/data/memory-data";

const MemoryContext = createContext<MemoryEngine | null>(null);

export function MemoryProvider({ children }: { children: ReactNode }) {
  const engine = useMemo(
    () => new MemoryEngine(memoryNodes, memoryClusters, memoryLinks, memorySummaries),
    []
  );

  return (
    <MemoryContext.Provider value={engine}>
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemory() {
  const ctx = useContext(MemoryContext);
  if (!ctx) throw new Error("useMemory must be used within MemoryProvider");
  return ctx;
}
