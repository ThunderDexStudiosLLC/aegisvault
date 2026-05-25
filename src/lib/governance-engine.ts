import type {
  GovernedMemory, MemoryAccessRule, MemoryRetentionPolicy,
  MemoryAuditEntry, FounderProtectionZone, GovernanceStats,
  MemoryClassification,
} from "@/types";

export class GovernanceEngine {
  private memories: GovernedMemory[];
  private accessRules: MemoryAccessRule[];
  private retentionPolicies: MemoryRetentionPolicy[];
  private auditLog: MemoryAuditEntry[];
  private zones: FounderProtectionZone[];
  private stats: GovernanceStats;

  constructor(
    memories: GovernedMemory[],
    accessRules: MemoryAccessRule[],
    retentionPolicies: MemoryRetentionPolicy[],
    auditLog: MemoryAuditEntry[],
    zones: FounderProtectionZone[],
    stats: GovernanceStats,
  ) {
    this.memories = memories;
    this.accessRules = accessRules;
    this.retentionPolicies = retentionPolicies;
    this.auditLog = auditLog;
    this.zones = zones;
    this.stats = stats;
  }

  getMemories(): GovernedMemory[] { return this.memories; }
  getMemoriesByClassification(c: MemoryClassification): GovernedMemory[] { return this.memories.filter((m) => m.classification === c); }
  getLockedMemories(): GovernedMemory[] { return this.memories.filter((m) => m.locked); }
  getRedactedMemories(): GovernedMemory[] { return this.memories.filter((m) => m.redacted); }

  getAccessRules(): MemoryAccessRule[] { return this.accessRules; }
  getRuleForClassification(c: MemoryClassification): MemoryAccessRule | undefined { return this.accessRules.find((r) => r.classification === c); }

  getRetentionPolicies(): MemoryRetentionPolicy[] { return this.retentionPolicies; }
  getLegalHoldPolicies(): MemoryRetentionPolicy[] { return this.retentionPolicies.filter((p) => p.legalHold); }

  getAuditLog(): MemoryAuditEntry[] { return this.auditLog; }
  getAuditByMemory(memoryId: string): MemoryAuditEntry[] { return this.auditLog.filter((e) => e.memoryId === memoryId); }
  getAuditByActor(name: string): MemoryAuditEntry[] { return this.auditLog.filter((e) => e.performedBy === name); }
  getAiAuditEntries(): MemoryAuditEntry[] { return this.auditLog.filter((e) => e.performedByType === "ai-agent"); }
  getRecentAudit(count: number): MemoryAuditEntry[] { return this.auditLog.slice(0, count); }

  getZones(): FounderProtectionZone[] { return this.zones; }
  getLockedZones(): FounderProtectionZone[] { return this.zones.filter((z) => z.locked); }

  getStats(): GovernanceStats { return this.stats; }
}
