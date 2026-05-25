import type {
  FounderDigest, StrategicResurface, ContinuityReminder,
  FounderDecisionLog, ExecutiveContinuitySummary,
} from "@/types";

export class FounderCommandEngine {
  private digests: FounderDigest[];
  private resurfaces: StrategicResurface[];
  private reminders: ContinuityReminder[];
  private decisionLogs: FounderDecisionLog[];
  private summaries: ExecutiveContinuitySummary[];

  constructor(
    digests: FounderDigest[],
    resurfaces: StrategicResurface[],
    reminders: ContinuityReminder[],
    decisionLogs: FounderDecisionLog[],
    summaries: ExecutiveContinuitySummary[],
  ) {
    this.digests = digests;
    this.resurfaces = resurfaces;
    this.reminders = reminders;
    this.decisionLogs = decisionLogs;
    this.summaries = summaries;
  }

  getTodayDigest(): FounderDigest | undefined {
    return this.digests[0];
  }

  getAllDigests(): FounderDigest[] {
    return this.digests;
  }

  getActiveResurfaces(): StrategicResurface[] {
    return this.resurfaces.filter((r) => !r.dismissed);
  }

  getAllResurfaces(): StrategicResurface[] {
    return this.resurfaces;
  }

  dismissResurface(id: string): void {
    const resurface = this.resurfaces.find((r) => r.id === id);
    if (resurface) resurface.dismissed = true;
  }

  getActiveReminders(): ContinuityReminder[] {
    return this.reminders.filter((r) => r.status === "active");
  }

  getAllReminders(): ContinuityReminder[] {
    return this.reminders;
  }

  snoozeReminder(id: string): void {
    const reminder = this.reminders.find((r) => r.id === id);
    if (reminder) reminder.status = "snoozed";
  }

  resolveReminder(id: string): void {
    const reminder = this.reminders.find((r) => r.id === id);
    if (reminder) reminder.status = "resolved";
  }

  getDecisionLogs(): FounderDecisionLog[] {
    return this.decisionLogs;
  }

  getActiveDecisions(): FounderDecisionLog[] {
    return this.decisionLogs.filter((d) => d.status === "active");
  }

  getPendingDecisions(): FounderDecisionLog[] {
    return this.decisionLogs.filter((d) => d.status === "pending-review");
  }

  getContinuitySummaries(): ExecutiveContinuitySummary[] {
    return this.summaries;
  }

  getLatestSummary(): ExecutiveContinuitySummary | undefined {
    return this.summaries[0];
  }

  getCriticalItems(): {
    resurfaces: StrategicResurface[];
    reminders: ContinuityReminder[];
    decisions: FounderDecisionLog[];
  } {
    return {
      resurfaces: this.resurfaces.filter((r) => !r.dismissed && (r.urgency === "critical" || r.urgency === "high")),
      reminders: this.reminders.filter((r) => r.status === "active" && (r.priority === "critical" || r.priority === "high")),
      decisions: this.decisionLogs.filter((d) => d.status === "pending-review"),
    };
  }

  getFounderStats(): {
    totalResurfaces: number;
    activeResurfaces: number;
    activeReminders: number;
    pendingDecisions: number;
    totalDecisions: number;
    unresolvedPriorities: number;
  } {
    const digest = this.getTodayDigest();
    return {
      totalResurfaces: this.resurfaces.length,
      activeResurfaces: this.resurfaces.filter((r) => !r.dismissed).length,
      activeReminders: this.reminders.filter((r) => r.status === "active").length,
      pendingDecisions: this.decisionLogs.filter((d) => d.status === "pending-review").length,
      totalDecisions: this.decisionLogs.length,
      unresolvedPriorities: digest?.unresolvedCount ?? 0,
    };
  }
}
