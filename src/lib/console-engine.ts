import { consoleModules, consoleCommands, liveStatusMetrics, consoleStats } from "@/data/console-data";
import type { ConsoleModule, ConsoleCommand, LiveStatusMetric, ConsoleStats, ConsoleModuleId } from "@/types";

export const ConsoleEngine = {
  getModules: (): ConsoleModule[] => consoleModules,
  getModuleById: (id: ConsoleModuleId): ConsoleModule | undefined => consoleModules.find((m) => m.id === id),
  getOperationalModules: (): ConsoleModule[] => consoleModules.filter((m) => m.status === "operational"),
  getDegradedModules: (): ConsoleModule[] => consoleModules.filter((m) => m.status === "degraded" || m.status === "warning" || m.status === "critical"),
  getModulesWithAlerts: (): ConsoleModule[] => consoleModules.filter((m) => m.activeAlerts > 0),

  getCommands: (): ConsoleCommand[] => consoleCommands,
  getCommandsByCategory: (cat: ConsoleCommand["category"]): ConsoleCommand[] => consoleCommands.filter((c) => c.category === cat),
  getCriticalCommands: (): ConsoleCommand[] => consoleCommands.filter((c) => c.severity === "critical"),

  getMetrics: (): LiveStatusMetric[] => liveStatusMetrics,
  getWarningMetrics: (): LiveStatusMetric[] => liveStatusMetrics.filter((m) => m.status === "warning" || m.status === "critical"),
  getStats: (): ConsoleStats => consoleStats,
};
