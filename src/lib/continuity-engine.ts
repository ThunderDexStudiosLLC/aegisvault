import type {
  CriticalAsset, RecoveryProcedure, ContinuityIncident,
  InfraNode, ContinuityStats, CriticalAssetCategory,
} from "@/types";

export class ContinuityEngine {
  private assets: CriticalAsset[];
  private procedures: RecoveryProcedure[];
  private incidents: ContinuityIncident[];
  private nodes: InfraNode[];
  private stats: ContinuityStats;

  constructor(
    assets: CriticalAsset[],
    procedures: RecoveryProcedure[],
    incidents: ContinuityIncident[],
    nodes: InfraNode[],
    stats: ContinuityStats,
  ) {
    this.assets = assets;
    this.procedures = procedures;
    this.incidents = incidents;
    this.nodes = nodes;
    this.stats = stats;
  }

  getAssets(): CriticalAsset[] { return this.assets; }
  getAssetsByCategory(c: CriticalAssetCategory): CriticalAsset[] { return this.assets.filter((a) => a.category === c); }
  getCriticalAssets(): CriticalAsset[] { return this.assets.filter((a) => a.criticality === "critical"); }
  getDegradedAssets(): CriticalAsset[] { return this.assets.filter((a) => a.status === "degraded" || a.status === "down"); }
  getAssetById(id: string): CriticalAsset | undefined { return this.assets.find((a) => a.id === id); }

  getProcedures(): RecoveryProcedure[] { return this.procedures; }
  getProcedureById(id: string): RecoveryProcedure | undefined { return this.procedures.find((p) => p.id === id); }
  getUntestedProcedures(): RecoveryProcedure[] { return this.procedures.filter((p) => !p.lastTested); }

  getIncidents(): ContinuityIncident[] { return this.incidents; }
  getActiveIncidents(): ContinuityIncident[] { return this.incidents.filter((i) => i.status !== "resolved" && i.status !== "post-mortem"); }
  getResolvedIncidents(): ContinuityIncident[] { return this.incidents.filter((i) => i.status === "resolved" || i.status === "post-mortem"); }

  getInfraNodes(): InfraNode[] { return this.nodes; }
  getSinglePointsOfFailure(): InfraNode[] { return this.nodes.filter((n) => n.singlePointOfFailure); }

  getStats(): ContinuityStats { return this.stats; }
}
