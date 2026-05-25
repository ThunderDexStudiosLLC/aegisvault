"use client";

import { createContext, useContext, type ReactNode } from "react";
import { ConsoleEngine } from "@/lib/console-engine";
import type { ConsoleModule, ConsoleCommand, LiveStatusMetric, ConsoleStats, ConsoleModuleId } from "@/types";

interface ConsoleContextValue {
  modules: ConsoleModule[];
  getModuleById: (id: ConsoleModuleId) => ConsoleModule | undefined;
  getOperationalModules: () => ConsoleModule[];
  getDegradedModules: () => ConsoleModule[];
  getModulesWithAlerts: () => ConsoleModule[];
  commands: ConsoleCommand[];
  getCommandsByCategory: (cat: ConsoleCommand["category"]) => ConsoleCommand[];
  getCriticalCommands: () => ConsoleCommand[];
  metrics: LiveStatusMetric[];
  getWarningMetrics: () => LiveStatusMetric[];
  stats: ConsoleStats;
}

const ConsoleCtx = createContext<ConsoleContextValue | null>(null);

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const value: ConsoleContextValue = {
    modules: ConsoleEngine.getModules(),
    getModuleById: ConsoleEngine.getModuleById,
    getOperationalModules: ConsoleEngine.getOperationalModules,
    getDegradedModules: ConsoleEngine.getDegradedModules,
    getModulesWithAlerts: ConsoleEngine.getModulesWithAlerts,
    commands: ConsoleEngine.getCommands(),
    getCommandsByCategory: ConsoleEngine.getCommandsByCategory,
    getCriticalCommands: ConsoleEngine.getCriticalCommands,
    metrics: ConsoleEngine.getMetrics(),
    getWarningMetrics: ConsoleEngine.getWarningMetrics,
    stats: ConsoleEngine.getStats(),
  };

  return <ConsoleCtx.Provider value={value}>{children}</ConsoleCtx.Provider>;
}

export function useConsole() {
  const ctx = useContext(ConsoleCtx);
  if (!ctx) throw new Error("useConsole must be used within ConsoleProvider");
  return ctx;
}
