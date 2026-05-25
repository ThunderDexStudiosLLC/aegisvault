import type {
  SecurityRisk, SecurityAnomaly, IdentityRisk, PermissionDrift,
  AiGovernanceEvent, ThreatIntelItem, SecurityGraphNode, IronFrameStats,
  RiskSeverity,
} from "@/types";

export class IronFrameEngine {
  private risks: SecurityRisk[];
  private anomalies: SecurityAnomaly[];
  private identityRisks: IdentityRisk[];
  private drifts: PermissionDrift[];
  private aiEvents: AiGovernanceEvent[];
  private threatFeed: ThreatIntelItem[];
  private graphNodes: SecurityGraphNode[];
  private stats: IronFrameStats;

  constructor(
    risks: SecurityRisk[],
    anomalies: SecurityAnomaly[],
    identityRisks: IdentityRisk[],
    drifts: PermissionDrift[],
    aiEvents: AiGovernanceEvent[],
    threatFeed: ThreatIntelItem[],
    graphNodes: SecurityGraphNode[],
    stats: IronFrameStats,
  ) {
    this.risks = risks;
    this.anomalies = anomalies;
    this.identityRisks = identityRisks;
    this.drifts = drifts;
    this.aiEvents = aiEvents;
    this.threatFeed = threatFeed;
    this.graphNodes = graphNodes;
    this.stats = stats;
  }

  getRisks(): SecurityRisk[] { return this.risks; }
  getActiveRisks(): SecurityRisk[] { return this.risks.filter((r) => r.status === "active" || r.status === "investigating"); }
  getRisksBySeverity(s: RiskSeverity): SecurityRisk[] { return this.risks.filter((r) => r.severity === s); }

  getAnomalies(): SecurityAnomaly[] { return this.anomalies; }
  getUnresolvedAnomalies(): SecurityAnomaly[] { return this.anomalies.filter((a) => !a.resolved); }

  getIdentityRisks(): IdentityRisk[] { return this.identityRisks; }

  getPermissionDrifts(): PermissionDrift[] { return this.drifts; }

  getAiGovernanceEvents(): AiGovernanceEvent[] { return this.aiEvents; }
  getBlockedAiActions(): AiGovernanceEvent[] { return this.aiEvents.filter((e) => e.blocked); }

  getThreatFeed(): ThreatIntelItem[] { return this.threatFeed; }
  getUnacknowledgedThreats(): ThreatIntelItem[] { return this.threatFeed.filter((t) => !t.acknowledged); }
  getActionRequiredThreats(): ThreatIntelItem[] { return this.threatFeed.filter((t) => t.actionRequired && !t.acknowledged); }

  getGraphNodes(): SecurityGraphNode[] { return this.graphNodes; }

  getStats(): IronFrameStats { return this.stats; }
}
