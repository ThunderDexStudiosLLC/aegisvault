"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Shield, Activity, Clock, AlertTriangle, ChevronDown, ChevronUp,
  Globe, Cloud, Code, CreditCard, Phone, Bot, FileText, Key,
  Database, CheckCircle, XCircle, AlertOctagon, Zap, Server,
  RefreshCw, Download, Clipboard, Lock, Sparkles, Layers,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useContinuity } from "@/contexts/ContinuityContext";
import { useOrb } from "@/contexts/OrbContext";
import type { CriticalAssetCategory } from "@/types";

const categoryConfig: Record<CriticalAssetCategory, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  domain: { label: "Domain", color: "text-electric", bg: "bg-electric/10", icon: Globe },
  cloud: { label: "Cloud", color: "text-cyan-400", bg: "bg-cyan-400/10", icon: Cloud },
  developer: { label: "Developer", color: "text-purple-400", bg: "bg-purple-400/10", icon: Code },
  payment: { label: "Payment", color: "text-success", bg: "bg-success/10", icon: CreditCard },
  telecom: { label: "Telecom", color: "text-blue-400", bg: "bg-blue-400/10", icon: Phone },
  "ai-infra": { label: "AI Infra", color: "text-violet-400", bg: "bg-violet-400/10", icon: Bot },
  legal: { label: "Legal", color: "text-amber-400", bg: "bg-amber-400/10", icon: FileText },
  credential: { label: "Credential", color: "text-warning", bg: "bg-warning/10", icon: Key },
  "data-store": { label: "Data Store", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: Database },
};

const statusConfig = {
  operational: { label: "Operational", color: "text-success", bg: "bg-success/10", icon: CheckCircle },
  degraded: { label: "Degraded", color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle },
  down: { label: "Down", color: "text-destructive", bg: "bg-destructive/10", icon: XCircle },
  unknown: { label: "Unknown", color: "text-muted-foreground", bg: "bg-white/5", icon: AlertOctagon },
};

const criticalityColors = {
  low: "text-muted-foreground/50",
  medium: "text-electric",
  high: "text-warning",
  critical: "text-destructive",
};

const severityConfig = {
  low: { color: "text-electric", bg: "bg-electric/10" },
  medium: { color: "text-warning", bg: "bg-warning/10" },
  high: { color: "text-amber-400", bg: "bg-amber-400/10" },
  critical: { color: "text-destructive", bg: "bg-destructive/10" },
};

const incidentStatusConfig = {
  active: { label: "Active", color: "text-destructive", bg: "bg-destructive/10" },
  investigating: { label: "Investigating", color: "text-warning", bg: "bg-warning/10" },
  mitigated: { label: "Mitigated", color: "text-electric", bg: "bg-electric/10" },
  resolved: { label: "Resolved", color: "text-success", bg: "bg-success/10" },
  "post-mortem": { label: "Post-Mortem", color: "text-purple-400", bg: "bg-purple-400/10" },
};

type ViewMode = "dashboard" | "assets" | "graph" | "recovery" | "incidents";

export default function ContinuityPage() {
  const engine = useContinuity();
  const { setState } = useOrb();
  const [view, setView] = useState<ViewMode>("dashboard");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CriticalAssetCategory | "all">("all");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stats = useMemo(() => engine.getStats(), [engine]);
  const assets = useMemo(() => engine.getAssets(), [engine]);
  const procedures = useMemo(() => engine.getProcedures(), [engine]);
  const incidents = useMemo(() => engine.getIncidents(), [engine]);
  const infraNodes = useMemo(() => engine.getInfraNodes(), [engine]);
  const spofs = useMemo(() => engine.getSinglePointsOfFailure(), [engine]);

  useEffect(() => {
    setState("synchronization");
    const timer = setTimeout(() => setState("idle"), 3000);
    return () => clearTimeout(timer);
  }, [setState]);

  const filteredAssets = categoryFilter === "all" ? assets : assets.filter((a) => a.category === categoryFilter);

  /* ---- dependency graph canvas ---- */
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 820 * dpr;
    canvas.height = 640 * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, 820, 640);

    infraNodes.forEach((node) => {
      node.dependencies.forEach((depId) => {
        const dep = infraNodes.find((n) => n.id === depId);
        if (!dep) return;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(dep.x, dep.y);
        ctx.strokeStyle = "rgba(59,130,246,0.15)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    });

    infraNodes.forEach((node) => {
      const cfg = categoryConfig[node.category];
      const statusCfg = node.status === "degraded" ? "rgba(245,158,11,0.25)" : "rgba(59,130,246,0.08)";
      const border = node.singlePointOfFailure ? "rgba(239,68,68,0.4)" : node.status === "degraded" ? "rgba(245,158,11,0.4)" : "rgba(59,130,246,0.2)";

      ctx.beginPath();
      ctx.roundRect(node.x - 50, node.y - 18, 100, 36, 8);
      ctx.fillStyle = statusCfg;
      ctx.fill();
      ctx.strokeStyle = border;
      ctx.lineWidth = node.singlePointOfFailure ? 2 : 1;
      ctx.stroke();

      ctx.fillStyle = node.status === "degraded" ? "#f59e0b" : "#94a3b8";
      ctx.font = "11px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);

      if (node.singlePointOfFailure) {
        ctx.fillStyle = "rgba(239,68,68,0.5)";
        ctx.font = "bold 8px ui-monospace, monospace";
        ctx.fillText("SPOF", node.x + 38, node.y - 10);
      }
    });
  }, [infraNodes]);

  useEffect(() => {
    if (view === "graph") drawGraph();
  }, [view, drawGraph]);

  return (
    <div className="aegis-page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-red-600/10 ring-1 ring-orange-500/20">
            <Shield className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Executive Continuity</h1>
            <p className="text-sm text-muted-foreground/60">Operational recovery, critical asset registry, and infrastructure resilience</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("aegis-badge", stats.overallReadiness >= 80 ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
            <Zap className="h-3 w-3" />
            Readiness: {stats.overallReadiness}%
          </div>
          {stats.activeIncidents > 0 && (
            <div className="aegis-badge bg-destructive/10 text-destructive">
              <AlertTriangle className="h-3 w-3" />
              {stats.activeIncidents} active incident{stats.activeIncidents > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total Assets", value: stats.totalAssets, icon: Server, color: "text-electric" },
          { label: "Operational", value: stats.operationalAssets, icon: CheckCircle, color: "text-success" },
          { label: "Critical Assets", value: stats.criticalAssets, icon: AlertOctagon, color: "text-destructive" },
          { label: "Recovery Plans", value: stats.recoveryProcedures, icon: RefreshCw, color: "text-cyan-400" },
          { label: "SPOF Risks", value: stats.singlePointsOfFailure, icon: AlertTriangle, color: "text-warning" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="aegis-card p-3 text-center">
              <Icon className={cn("h-4 w-4 mx-auto", s.color)} />
              <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/40">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-white/[0.02] p-1">
        {[
          { key: "dashboard" as ViewMode, label: "Overview", icon: Layers },
          { key: "assets" as ViewMode, label: "Asset Registry", icon: Server },
          { key: "graph" as ViewMode, label: "Dependency Graph", icon: Activity },
          { key: "recovery" as ViewMode, label: "Recovery Procedures", icon: RefreshCw },
          { key: "incidents" as ViewMode, label: "Incidents", icon: AlertTriangle, badge: stats.activeIncidents },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all",
                view === tab.key
                  ? "bg-orange-500/10 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.08)]"
                  : "text-muted-foreground/50 hover:text-foreground/70"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="rounded-full bg-destructive/20 px-1.5 py-0.5 text-[9px] text-destructive">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============ OVERVIEW DASHBOARD ============ */}
      {view === "dashboard" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Critical Systems */}
          <div className="aegis-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground/90 mb-3 flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-destructive/70" />
              Critical Systems
            </h3>
            <div className="space-y-2">
              {assets.filter((a) => a.criticality === "critical").map((asset) => {
                const cfg = categoryConfig[asset.category];
                const sCfg = statusConfig[asset.status];
                const CatIcon = cfg.icon;
                const StatusIcon = sCfg.icon;
                return (
                  <div key={asset.id} className="flex items-center gap-3 rounded-lg border border-border/10 p-2.5">
                    <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", cfg.bg)}>
                      <CatIcon className={cn("h-3.5 w-3.5", cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground/90 truncate">{asset.name}</p>
                      <p className="text-[9px] text-muted-foreground/40">{asset.provider}</p>
                    </div>
                    <StatusIcon className={cn("h-3.5 w-3.5 shrink-0", sCfg.color)} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recovery Readiness */}
          <div className="aegis-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground/90 mb-3 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-cyan-400/70" />
              Recovery Readiness
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground/50">Procedures Defined</span>
                <span className="text-xs font-semibold text-foreground/70">{stats.recoveryProcedures}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground/50">Tested Procedures</span>
                <span className="text-xs font-semibold text-success">{stats.testedProcedures}/{stats.recoveryProcedures}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground/50">Single Points of Failure</span>
                <span className="text-xs font-semibold text-warning">{stats.singlePointsOfFailure}</span>
              </div>
              <div className="mt-2">
                <p className="text-[10px] text-muted-foreground/40 mb-1">Overall Readiness</p>
                <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", stats.overallReadiness >= 80 ? "bg-success/60" : "bg-warning/60")} style={{ width: `${stats.overallReadiness}%` }} />
                </div>
                <p className="mt-1 text-right text-[9px] text-muted-foreground/30">{stats.overallReadiness}%</p>
              </div>

              <div className="border-t border-border/10 pt-3">
                <p className="text-[10px] font-mono uppercase text-muted-foreground/40 mb-2">SPOF Risks</p>
                {spofs.map((n) => (
                  <div key={n.id} className="flex items-center gap-2 rounded-lg p-1.5 mb-1">
                    <AlertTriangle className="h-3 w-3 text-warning/50 shrink-0" />
                    <span className="text-xs text-foreground/60">{n.label}</span>
                    <span className="text-[9px] text-destructive/60 ml-auto">single point of failure</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Incidents */}
          <div className="aegis-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground/90 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning/70" />
              Active &amp; Recent Incidents
            </h3>
            <div className="space-y-2">
              {incidents.map((inc) => {
                const sCfg = incidentStatusConfig[inc.status];
                const sevCfg = severityConfig[inc.severity];
                return (
                  <div key={inc.id} className={cn("rounded-lg border border-border/10 p-3", inc.status !== "resolved" && "ring-1 ring-warning/10")}>
                    <div className="flex items-center gap-2">
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]", sevCfg.bg, sevCfg.color)}>{inc.severity}</span>
                      <span className="text-xs font-semibold text-foreground/90 flex-1 truncate">{inc.title}</span>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]", sCfg.bg, sCfg.color)}>{sCfg.label}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground/40">{formatRelativeTime(inc.reportedAt)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="aegis-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground/90 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-400/70" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Run Continuity Audit", icon: Clipboard, color: "text-orange-400" },
                { label: "Review Critical Risks", icon: AlertTriangle, color: "text-destructive" },
                { label: "Generate Recovery Report", icon: Download, color: "text-cyan-400" },
                { label: "Export Emergency Summary", icon: FileText, color: "text-electric" },
                { label: "Validate Backups", icon: RefreshCw, color: "text-success" },
                { label: "Lock Infrastructure", icon: Lock, color: "text-amber-400" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.label} className="flex items-center gap-2 rounded-lg p-2.5 hover:bg-white/[0.02] transition-colors text-left">
                    <Icon className={cn("h-4 w-4 shrink-0", action.color)} />
                    <span className="text-xs text-foreground/70">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============ ASSET REGISTRY ============ */}
      {view === "assets" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground/90">Critical Asset Registry</h2>
              <p className="text-xs text-muted-foreground/40">Domains, cloud providers, developer accounts, payment systems, AI infrastructure, and legal documents</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-white/[0.02] p-0.5">
              <button onClick={() => setCategoryFilter("all")} className={cn("rounded px-2 py-1 text-[10px] transition-all", categoryFilter === "all" ? "bg-orange-500/10 text-orange-400" : "text-muted-foreground/40")}>All</button>
              {(Object.keys(categoryConfig) as CriticalAssetCategory[]).map((cat) => (
                <button key={cat} onClick={() => setCategoryFilter(cat)} className={cn("rounded px-2 py-1 text-[10px] transition-all", categoryFilter === cat ? categoryConfig[cat].bg + " " + categoryConfig[cat].color : "text-muted-foreground/40")}>
                  {categoryConfig[cat].label}
                </button>
              ))}
            </div>
          </div>

          {filteredAssets.map((asset) => {
            const cfg = categoryConfig[asset.category];
            const sCfg = statusConfig[asset.status];
            const CatIcon = cfg.icon;
            const StatusIcon = sCfg.icon;
            const isExpanded = expandedItem === asset.id;
            return (
              <div key={asset.id} className={cn("aegis-card rounded-xl overflow-hidden", asset.status === "degraded" && "ring-1 ring-warning/15", asset.status === "down" && "ring-1 ring-destructive/15")}>
                <button onClick={() => setExpandedItem(isExpanded ? null : asset.id)} className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/[0.005] transition-colors">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/[0.06]", cfg.bg)}>
                    <CatIcon className={cn("h-4 w-4", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground/90">{asset.name}</span>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]", cfg.bg, cfg.color)}>{cfg.label}</span>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]", sCfg.bg, sCfg.color, "flex items-center gap-0.5")}><StatusIcon className="h-2.5 w-2.5" />{sCfg.label}</span>
                      <span className={cn("text-[9px] font-semibold", criticalityColors[asset.criticality])}>{asset.criticality}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground/50 truncate">{asset.description}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-border/10 px-5 py-4 space-y-3 animate-fade-in">
                    <div className="grid grid-cols-4 gap-3">
                      <div><p className="text-[10px] text-muted-foreground/40">Provider</p><p className="text-xs text-foreground/70">{asset.provider}</p></div>
                      <div><p className="text-[10px] text-muted-foreground/40">Owner</p><p className="text-xs text-foreground/70">{asset.owner}</p></div>
                      <div><p className="text-[10px] text-muted-foreground/40">Backup Owner</p><p className="text-xs text-foreground/70">{asset.backupOwner || "—"}</p></div>
                      <div><p className="text-[10px] text-muted-foreground/40">Last Verified</p><p className="text-xs text-foreground/70">{formatRelativeTime(asset.lastVerified)}</p></div>
                    </div>
                    {asset.renewalDate && (
                      <div className="flex items-center gap-2 rounded-lg bg-white/[0.02] p-2">
                        <Clock className="h-3 w-3 text-warning/50" />
                        <span className="text-xs text-warning/70">Renewal: {new Date(asset.renewalDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {asset.notes && <p className="text-xs text-muted-foreground/40 italic">{asset.notes}</p>}
                    {asset.dependencies.length > 0 && (
                      <div>
                        <p className="text-[10px] text-muted-foreground/40">Dependencies</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {asset.dependencies.map((d) => {
                            const dep = assets.find((a) => a.id === d);
                            return <span key={d} className="rounded bg-white/[0.03] px-2 py-0.5 text-[9px] text-foreground/50">{dep?.name || d}</span>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ============ DEPENDENCY GRAPH ============ */}
      {view === "graph" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Infrastructure Dependency Graph</h2>
            <p className="text-xs text-muted-foreground/40">Ecosystem dependencies, infrastructure relationships, and single points of failure</p>
          </div>

          <div className="aegis-card rounded-xl p-4">
            <div className="flex items-center gap-4 mb-3 text-[9px] text-muted-foreground/40">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-electric/30" /> Normal</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning/50" /> Degraded</span>
              <span className="flex items-center gap-1"><span className="h-2 w-6 rounded border border-destructive/40" /> SPOF</span>
            </div>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ width: 820, height: 640 }} />
          </div>

          {/* SPOF details */}
          <div className="aegis-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground/90 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive/70" />
              Single Points of Failure
            </h3>
            <div className="space-y-2">
              {spofs.map((n) => {
                const cfg = categoryConfig[n.category];
                const CatIcon = cfg.icon;
                return (
                  <div key={n.id} className="flex items-center gap-3 rounded-lg border border-destructive/10 p-3">
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", cfg.bg)}>
                      <CatIcon className={cn("h-4 w-4", cfg.color)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground/90">{n.label}</p>
                      <p className="text-[9px] text-muted-foreground/40">{cfg.label} &bull; {n.criticality}</p>
                    </div>
                    <span className="rounded bg-destructive/10 px-2 py-0.5 text-[9px] text-destructive">SPOF</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============ RECOVERY PROCEDURES ============ */}
      {view === "recovery" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Recovery Procedures & Playbooks</h2>
            <p className="text-xs text-muted-foreground/40">Emergency procedures, access restoration steps, escalation workflows, and recovery playbooks</p>
          </div>

          {procedures.map((proc) => {
            const sevCfg = severityConfig[proc.priority];
            const isExpanded = expandedItem === proc.id;
            return (
              <div key={proc.id} className="aegis-card rounded-xl overflow-hidden">
                <button onClick={() => setExpandedItem(isExpanded ? null : proc.id)} className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/[0.005] transition-colors">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/[0.06]", sevCfg.bg)}>
                    <RefreshCw className={cn("h-4 w-4", sevCfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground/90">{proc.title}</span>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]", sevCfg.bg, sevCfg.color)}>{proc.priority}</span>
                      <span className="rounded bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-muted-foreground/40">{proc.category.replace(/-/g, " ")}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-[10px] text-muted-foreground/40">
                      <span>Est: {proc.estimatedTime}</span>
                      <span>{proc.steps.length} steps</span>
                      {proc.lastTested ? <span className="text-success/60">Tested: {formatRelativeTime(proc.lastTested)}</span> : <span className="text-warning/60">Untested</span>}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-border/10 px-5 py-4 space-y-4 animate-fade-in">
                    {/* Steps */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Procedure Steps</p>
                      <div className="space-y-1.5">
                        {proc.steps.map((step) => (
                          <div key={step.order} className="flex items-start gap-3 rounded-lg bg-white/[0.01] p-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-electric/10 text-[9px] font-bold text-electric">{step.order}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-foreground/70">{step.action}</p>
                              <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground/30">
                                <span>{step.responsible}</span>
                                <span>&bull; ~{step.estimatedMinutes}m</span>
                                {step.requiresApproval && <span className="text-warning/60">Requires approval</span>}
                              </div>
                              {step.notes && <p className="mt-0.5 text-[9px] text-muted-foreground/30 italic">{step.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Chain */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-1">Escalation Contact Chain</p>
                      <div className="flex items-center gap-2">
                        {proc.contactChain.map((c, i) => (
                          <span key={c} className="flex items-center gap-1">
                            <span className="text-xs text-foreground/60">{c}</span>
                            {i < proc.contactChain.length - 1 && <span className="text-muted-foreground/20">→</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ============ INCIDENTS ============ */}
      {view === "incidents" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Incident Response</h2>
            <p className="text-xs text-muted-foreground/40">Incident logging, recovery task coordination, and security escalation workflows</p>
          </div>

          {incidents.map((inc) => {
            const sCfg = incidentStatusConfig[inc.status];
            const sevCfg = severityConfig[inc.severity];
            const isExpanded = expandedItem === inc.id;
            return (
              <div key={inc.id} className={cn("aegis-card rounded-xl overflow-hidden", inc.status !== "resolved" && "ring-1 ring-warning/10")}>
                <button onClick={() => setExpandedItem(isExpanded ? null : inc.id)} className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/[0.005] transition-colors">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/[0.06]", sevCfg.bg)}>
                    <AlertTriangle className={cn("h-4 w-4", sevCfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground/90">{inc.title}</span>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]", sevCfg.bg, sevCfg.color)}>{inc.severity}</span>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]", sCfg.bg, sCfg.color)}>{sCfg.label}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground/50 truncate">{inc.description}</p>
                    <p className="mt-0.5 text-[9px] text-muted-foreground/30">Reported: {formatRelativeTime(inc.reportedAt)}{inc.resolvedAt ? ` · Resolved: ${formatRelativeTime(inc.resolvedAt)}` : ""}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-border/10 px-5 py-4 space-y-4 animate-fade-in">
                    {/* Tasks */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Recovery Tasks</p>
                      <div className="space-y-1.5">
                        {inc.tasks.map((task) => {
                          const taskSev = severityConfig[task.priority];
                          const done = task.status === "completed";
                          return (
                            <div key={task.id} className="flex items-center gap-3 rounded-lg bg-white/[0.01] p-2.5">
                              {done ? <CheckCircle className="h-3.5 w-3.5 text-success/50 shrink-0" /> : <Clock className="h-3.5 w-3.5 text-warning/50 shrink-0" />}
                              <span className={cn("text-xs flex-1", done ? "text-foreground/40 line-through" : "text-foreground/70")}>{task.action}</span>
                              <span className="text-[9px] text-muted-foreground/30">{task.assignee}</span>
                              <span className={cn("rounded px-1 py-0.5 text-[8px]", taskSev.bg, taskSev.color)}>{task.priority}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Incident Timeline</p>
                      <div className="space-y-1">
                        {inc.timeline.map((evt, i) => (
                          <div key={i} className="flex items-start gap-3 rounded-lg p-2">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-electric/30 mt-1" />
                              {i < inc.timeline.length - 1 && <div className="w-px flex-1 bg-border/10 mt-1" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-foreground/70">{evt.action}</p>
                              <p className="text-[9px] text-muted-foreground/30">{evt.actor} &bull; {formatRelativeTime(evt.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
