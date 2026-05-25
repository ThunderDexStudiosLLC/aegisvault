"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Shield, AlertTriangle, Eye, Lock, Bot, Globe, Activity,
  ChevronDown, ChevronUp, CheckCircle, XCircle, Zap, Key,
  Users, Layers, Sparkles, Radio, FileText, AlertOctagon,
  Search, Clipboard, Download, RefreshCw,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useIronFrame } from "@/contexts/IronFrameContext";
import { useOrb } from "@/contexts/OrbContext";
import { useFeedback } from "@/components/global/OperationalFeedback";
import type { RiskSeverity } from "@/types";

const sevConfig: Record<RiskSeverity, { label: string; color: string; bg: string }> = {
  info: { label: "Info", color: "text-muted-foreground", bg: "bg-white/5" },
  low: { label: "Low", color: "text-electric", bg: "bg-electric/10" },
  medium: { label: "Medium", color: "text-warning", bg: "bg-warning/10" },
  high: { label: "High", color: "text-amber-400", bg: "bg-amber-400/10" },
  critical: { label: "Critical", color: "text-destructive", bg: "bg-destructive/10" },
};

const riskStatusConfig = {
  active: { label: "Active", color: "text-destructive", bg: "bg-destructive/10" },
  investigating: { label: "Investigating", color: "text-warning", bg: "bg-warning/10" },
  mitigated: { label: "Mitigated", color: "text-success", bg: "bg-success/10" },
  accepted: { label: "Accepted", color: "text-electric", bg: "bg-electric/10" },
};

const categoryIcons: Record<string, React.ElementType> = {
  credential: Key, access: Users, infrastructure: Globe, "ai-governance": Bot,
  insider: Eye, compliance: Layers, network: Radio,
};

const threatCategoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  advisory: { label: "Advisory", color: "text-electric", bg: "bg-electric/10" },
  "provider-incident": { label: "Provider", color: "text-warning", bg: "bg-warning/10" },
  "infrastructure-alert": { label: "Infra Alert", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  "ecosystem-risk": { label: "Ecosystem", color: "text-purple-400", bg: "bg-purple-400/10" },
  vulnerability: { label: "Vulnerability", color: "text-destructive", bg: "bg-destructive/10" },
  "breach-report": { label: "Breach", color: "text-destructive", bg: "bg-destructive/10" },
};

const graphNodeColors: Record<string, { fill: string; stroke: string; text: string }> = {
  system: { fill: "rgba(59,130,246,0.08)", stroke: "rgba(59,130,246,0.3)", text: "#60a5fa" },
  user: { fill: "rgba(16,185,129,0.08)", stroke: "rgba(16,185,129,0.3)", text: "#34d399" },
  permission: { fill: "rgba(168,85,247,0.08)", stroke: "rgba(168,85,247,0.3)", text: "#c084fc" },
  dependency: { fill: "rgba(245,158,11,0.08)", stroke: "rgba(245,158,11,0.3)", text: "#fbbf24" },
  trust: { fill: "rgba(6,182,212,0.08)", stroke: "rgba(6,182,212,0.3)", text: "#22d3ee" },
};

const graphStatusOverride: Record<string, string> = {
  warning: "rgba(245,158,11,0.5)",
  critical: "rgba(239,68,68,0.5)",
};

type ViewMode = "dashboard" | "identity" | "graph" | "ai-governance" | "threats";

export default function SecurityPage() {
  const engine = useIronFrame();
  const { setState } = useOrb();
  const { show } = useFeedback();

  const runSecAction = (label: string) => {
    setState("searching");
    show("processing", `${label}...`, "Security scan in progress");
    setTimeout(() => { show("security", `${label} completed`, "Results logged to audit trail"); setState("idle"); }, 2000);
  };
  const [view, setView] = useState<ViewMode>("dashboard");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stats = useMemo(() => engine.getStats(), [engine]);
  const risks = useMemo(() => engine.getRisks(), [engine]);
  const anomalies = useMemo(() => engine.getAnomalies(), [engine]);
  const identityRisks = useMemo(() => engine.getIdentityRisks(), [engine]);
  const drifts = useMemo(() => engine.getPermissionDrifts(), [engine]);
  const aiEvents = useMemo(() => engine.getAiGovernanceEvents(), [engine]);
  const threats = useMemo(() => engine.getThreatFeed(), [engine]);
  const graphNodes = useMemo(() => engine.getGraphNodes(), [engine]);

  useEffect(() => {
    setState("searching");
    const timer = setTimeout(() => setState("idle"), 3000);
    return () => clearTimeout(timer);
  }, [setState]);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 820 * dpr;
    canvas.height = 560 * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, 820, 560);

    graphNodes.forEach((node) => {
      node.connections.forEach((cId) => {
        const target = graphNodes.find((n) => n.id === cId);
        if (!target) return;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = "rgba(59,130,246,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });

    graphNodes.forEach((node) => {
      const cfg = graphNodeColors[node.type];
      const borderColor = graphStatusOverride[node.status] || cfg.stroke;
      const isRound = node.type === "user";
      const size = node.type === "system" ? 52 : node.type === "permission" ? 38 : 44;

      if (isRound) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = cfg.fill;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = node.status !== "secure" ? 2 : 1;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.roundRect(node.x - size, node.y - 14, size * 2, 28, 6);
        ctx.fillStyle = cfg.fill;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = node.status !== "secure" ? 2 : 1;
        ctx.stroke();
      }

      ctx.fillStyle = graphStatusOverride[node.status] || cfg.text;
      ctx.font = "11px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);

      if (node.status === "critical") {
        ctx.fillStyle = "rgba(239,68,68,0.6)";
        ctx.font = "bold 8px ui-monospace, monospace";
        ctx.fillText("RISK", node.x + size - 4, node.y - 14);
      } else if (node.status === "warning") {
        ctx.fillStyle = "rgba(245,158,11,0.5)";
        ctx.font = "bold 8px ui-monospace, monospace";
        ctx.fillText("!", node.x + size - 8, node.y - 14);
      }
    });
  }, [graphNodes]);

  useEffect(() => {
    if (view === "graph") drawGraph();
  }, [view, drawGraph]);

  const scoreColor = stats.overallScore >= 80 ? "text-success" : stats.overallScore >= 60 ? "text-warning" : "text-destructive";

  return (
    <div className="aegis-page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-orange-600/10 ring-1 ring-red-500/20">
            <Shield className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground aegis-glow-text">IronFrame Security</h1>
            <p className="text-sm text-muted-foreground/60">Security intelligence, anomaly detection, and operational defense</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("aegis-badge", scoreColor === "text-success" ? "bg-success/10 text-success" : scoreColor === "text-warning" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive")}>
            <Shield className="h-3 w-3" />
            Security Score: {stats.overallScore}
          </div>
          {stats.criticalRisks > 0 && (
            <div className="aegis-badge bg-destructive/10 text-destructive">
              <AlertOctagon className="h-3 w-3" />
              {stats.criticalRisks} critical
            </div>
          )}
          {stats.unacknowledgedThreats > 0 && (
            <div className="aegis-badge bg-warning/10 text-warning">
              <AlertTriangle className="h-3 w-3" />
              {stats.unacknowledgedThreats} unack&apos;d
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Active Risks", value: stats.activeRisks, icon: AlertTriangle, color: "text-destructive" },
          { label: "Anomalies", value: stats.anomaliesDetected, icon: Activity, color: "text-warning" },
          { label: "Identity Risks", value: stats.identityRisks, icon: Users, color: "text-amber-400" },
          { label: "AI Blocked", value: stats.blockedAiActions, icon: Bot, color: "text-purple-400" },
          { label: "Threat Intel", value: stats.threatIntelItems, icon: Radio, color: "text-cyan-400" },
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
          { key: "dashboard" as ViewMode, label: "Security Ops", icon: Shield },
          { key: "identity" as ViewMode, label: "Identity Risks", icon: Users, badge: stats.identityRisks },
          { key: "graph" as ViewMode, label: "Security Graph", icon: Layers },
          { key: "ai-governance" as ViewMode, label: "AI Governance", icon: Bot, badge: stats.blockedAiActions },
          { key: "threats" as ViewMode, label: "Threat Intel", icon: Radio, badge: stats.unacknowledgedThreats },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all",
                view === tab.key
                  ? "bg-red-500/10 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.08)]"
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

      {/* ============ SECURITY OPS DASHBOARD ============ */}
      {view === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Active Risks */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive/70" />
                Active Security Risks
              </h3>
              {risks.filter((r) => r.status === "active" || r.status === "investigating").map((risk) => {
                const sev = sevConfig[risk.severity];
                const st = riskStatusConfig[risk.status];
                const CatIcon = categoryIcons[risk.category] || Shield;
                const isExp = expandedItem === risk.id;
                return (
                  <div key={risk.id} className={cn("aegis-card rounded-xl overflow-hidden", risk.severity === "critical" && "ring-1 ring-destructive/15")}>
                    <button onClick={() => setExpandedItem(isExp ? null : risk.id)} className="flex w-full items-center gap-3 p-3.5 text-left hover:bg-white/[0.005] transition-colors">
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", sev.bg)}>
                        <CatIcon className={cn("h-4 w-4", sev.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground/90 truncate">{risk.title}</span>
                          <span className={cn("rounded px-1 py-0.5 text-[8px]", sev.bg, sev.color)}>{sev.label}</span>
                          <span className={cn("rounded px-1 py-0.5 text-[8px]", st.bg, st.color)}>{st.label}</span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/40 truncate">{risk.description}</p>
                      </div>
                      {isExp ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/30" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/30" />}
                    </button>
                    {isExp && (
                      <div className="border-t border-border/10 px-4 py-3 space-y-2 animate-fade-in">
                        <p className="text-xs text-foreground/70">{risk.description}</p>
                        <div className="rounded-lg bg-white/[0.02] p-2.5">
                          <p className="text-[9px] font-mono uppercase text-muted-foreground/40 mb-1">Recommendation</p>
                          <p className="text-xs text-foreground/60">{risk.recommendation}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {risk.affectedEntities.map((e) => <span key={e} className="rounded bg-white/[0.03] px-2 py-0.5 text-[9px] text-muted-foreground/40">{e}</span>)}
                        </div>
                        <p className="text-[9px] text-muted-foreground/30">Detected: {formatRelativeTime(risk.detectedAt)}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Anomalies */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                <Activity className="h-4 w-4 text-warning/70" />
                Security Anomalies
              </h3>
              {anomalies.map((an) => {
                const sev = sevConfig[an.severity];
                return (
                  <div key={an.id} className={cn("aegis-card rounded-xl p-3.5", !an.resolved && "ring-1 ring-warning/10")}>
                    <div className="flex items-start gap-3">
                      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5",
                        an.actorType === "ai-agent" ? "bg-purple-400/10" : an.actorType === "unknown" ? "bg-destructive/10" : "bg-electric/10"
                      )}>
                        {an.actorType === "ai-agent" ? <Bot className="h-3.5 w-3.5 text-purple-400" /> :
                         an.actorType === "unknown" ? <AlertOctagon className="h-3.5 w-3.5 text-destructive" /> :
                         <Users className="h-3.5 w-3.5 text-electric" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground/90">{an.title}</span>
                          <span className={cn("rounded px-1 py-0.5 text-[8px]", sev.bg, sev.color)}>{sev.label}</span>
                          {an.resolved ? <CheckCircle className="h-3 w-3 text-success/40" /> : <XCircle className="h-3 w-3 text-destructive/40" />}
                        </div>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/40">{an.description}</p>
                        <div className="mt-1 flex items-center gap-2 text-[9px] text-muted-foreground/30">
                          <span>{an.actor}</span>
                          {an.sourceIp && <span className="font-mono">{an.sourceIp}</span>}
                          {an.location && <span>{an.location}</span>}
                          <span>{formatRelativeTime(an.detectedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="aegis-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground/90 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-400/70" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: "Run Security Audit", icon: Clipboard, color: "text-red-400" },
                { label: "Review Access Risks", icon: Eye, color: "text-warning" },
                { label: "Lock Critical Systems", icon: Lock, color: "text-destructive" },
                { label: "Security Briefing", icon: Download, color: "text-cyan-400" },
                { label: "Permission Drift", icon: RefreshCw, color: "text-purple-400" },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.label} onClick={() => runSecAction(a.label)} className="flex flex-col items-center gap-1.5 rounded-lg p-3 hover:bg-white/[0.02] transition-colors">
                    <Icon className={cn("h-4 w-4", a.color)} />
                    <span className="text-[10px] text-foreground/60 text-center">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============ IDENTITY RISK ANALYSIS ============ */}
      {view === "identity" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Identity Risks */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400/70" />
                Identity Risk Analysis
              </h3>
              {identityRisks.map((ir) => {
                const sev = sevConfig[ir.severity];
                const isExp = expandedItem === ir.id;
                return (
                  <div key={ir.id} className="aegis-card rounded-xl overflow-hidden">
                    <button onClick={() => setExpandedItem(isExp ? null : ir.id)} className="flex w-full items-center gap-3 p-3.5 text-left hover:bg-white/[0.005] transition-colors">
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", sev.bg)}>
                        <Users className={cn("h-4 w-4", sev.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground/90">{ir.identityName}</span>
                          <span className={cn("rounded px-1 py-0.5 text-[8px]", sev.bg, sev.color)}>{ir.riskType.replace(/-/g, " ")}</span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/40 truncate">{ir.description}</p>
                      </div>
                      {isExp ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/30" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/30" />}
                    </button>
                    {isExp && (
                      <div className="border-t border-border/10 px-4 py-3 space-y-2 animate-fade-in">
                        <p className="text-xs text-foreground/70">{ir.description}</p>
                        <div className="rounded-lg bg-white/[0.02] p-2.5">
                          <p className="text-[9px] font-mono uppercase text-muted-foreground/40 mb-1">Recommendation</p>
                          <p className="text-xs text-foreground/60">{ir.recommendation}</p>
                        </div>
                        <p className="text-[9px] text-muted-foreground/30">Detected: {formatRelativeTime(ir.detectedAt)}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Permission Drift */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-purple-400/70" />
                Permission Drift Detection
              </h3>
              {drifts.map((d) => {
                const sev = sevConfig[d.severity];
                const isExp = expandedItem === d.id;
                return (
                  <div key={d.id} className="aegis-card rounded-xl overflow-hidden">
                    <button onClick={() => setExpandedItem(isExp ? null : d.id)} className="flex w-full items-center gap-3 p-3.5 text-left hover:bg-white/[0.005] transition-colors">
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", sev.bg)}>
                        <Layers className={cn("h-4 w-4", sev.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground/90">{d.identity}</span>
                          <span className={cn("rounded px-1 py-0.5 text-[8px]", sev.bg, sev.color)}>{d.driftType.replace(/-/g, " ")}</span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/40 truncate">{d.description}</p>
                      </div>
                      {isExp ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/30" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/30" />}
                    </button>
                    {isExp && (
                      <div className="border-t border-border/10 px-4 py-3 space-y-2 animate-fade-in">
                        <p className="text-xs text-foreground/70">{d.description}</p>
                        <div>
                          <p className="text-[9px] font-mono uppercase text-muted-foreground/40 mb-1">Affected Permissions</p>
                          <div className="flex flex-wrap gap-1">
                            {d.permissionsAffected.map((p) => <span key={p} className="rounded bg-white/[0.03] px-2 py-0.5 text-[9px] text-foreground/50">{p}</span>)}
                          </div>
                        </div>
                        <p className="text-[9px] text-muted-foreground/30">Role: {d.role} &bull; Detected: {formatRelativeTime(d.detectedAt)}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============ ECOSYSTEM SECURITY GRAPH ============ */}
      {view === "graph" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Ecosystem Security Graph</h2>
            <p className="text-xs text-muted-foreground/40">Systems, users, permissions, dependencies, and trust relationships</p>
          </div>
          <div className="aegis-card rounded-xl p-4">
            <div className="flex items-center gap-4 mb-3 text-[9px] text-muted-foreground/40">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: graphNodeColors.user.stroke }} /> User</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded" style={{ background: graphNodeColors.system.stroke }} /> System</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded" style={{ background: graphNodeColors.permission.stroke }} /> Permission</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded" style={{ background: graphNodeColors.dependency.stroke }} /> Dependency</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded" style={{ background: graphNodeColors.trust.stroke }} /> Trust</span>
            </div>
            <canvas ref={canvasRef} className="w-full rounded-lg" style={{ width: 820, height: 560 }} />
          </div>
        </div>
      )}

      {/* ============ AI GOVERNANCE SECURITY ============ */}
      {view === "ai-governance" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">AI Governance Security Monitor</h2>
            <p className="text-xs text-muted-foreground/40">AI permission usage, memory access behavior, restricted recall attempts, and unauthorized patterns</p>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-2">
            {[
              { label: "Total Events", value: stats.aiGovernanceEvents, color: "text-purple-400" },
              { label: "Blocked Actions", value: stats.blockedAiActions, color: "text-destructive" },
              { label: "Permission Drifts", value: stats.permissionDrifts, color: "text-warning" },
              { label: "Governance Score", value: `${Math.round(100 - (stats.blockedAiActions / stats.aiGovernanceEvents) * 100)}%`, color: "text-success" },
            ].map((s) => (
              <div key={s.label} className="aegis-card p-3 text-center">
                <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/40">{s.label}</p>
              </div>
            ))}
          </div>

          {aiEvents.map((evt) => {
            const sev = sevConfig[evt.severity];
            return (
              <div key={evt.id} className={cn("aegis-card rounded-xl p-4", evt.blocked && "ring-1 ring-destructive/15")}>
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", evt.blocked ? "bg-destructive/10" : sev.bg)}>
                    <Bot className={cn("h-4 w-4", evt.blocked ? "text-destructive" : sev.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground/90">{evt.agentName}</span>
                      <span className={cn("rounded px-1 py-0.5 text-[8px]", sev.bg, sev.color)}>{evt.category.replace(/-/g, " ")}</span>
                      {evt.blocked && <span className="rounded bg-destructive/10 px-1 py-0.5 text-[8px] text-destructive flex items-center gap-0.5"><XCircle className="h-2.5 w-2.5" />Blocked</span>}
                    </div>
                    <p className="mt-0.5 text-xs text-foreground/70">{evt.action}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground/40">{evt.details}</p>
                    <div className="mt-1 flex items-center gap-2 text-[9px] text-muted-foreground/30">
                      {evt.policyRef && <span className="font-mono">Policy: {evt.policyRef}</span>}
                      <span>{formatRelativeTime(evt.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============ THREAT INTELLIGENCE FEED ============ */}
      {view === "threats" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Threat Intelligence Feed</h2>
            <p className="text-xs text-muted-foreground/40">Security advisories, provider incidents, infrastructure alerts, and ecosystem-level risk events</p>
          </div>

          {threats.map((threat) => {
            const sev = sevConfig[threat.severity];
            const cat = threatCategoryConfig[threat.category] || { label: threat.category, color: "text-muted-foreground", bg: "bg-white/5" };
            const isExp = expandedItem === threat.id;
            return (
              <div key={threat.id} className={cn("aegis-card rounded-xl overflow-hidden", !threat.acknowledged && "ring-1 ring-warning/10")}>
                <button onClick={() => setExpandedItem(isExp ? null : threat.id)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-white/[0.005] transition-colors">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", sev.bg)}>
                    <Radio className={cn("h-4 w-4", sev.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground/90 truncate">{threat.title}</span>
                      <span className={cn("rounded px-1 py-0.5 text-[8px]", sev.bg, sev.color)}>{sev.label}</span>
                      <span className={cn("rounded px-1 py-0.5 text-[8px]", cat.bg, cat.color)}>{cat.label}</span>
                      {threat.actionRequired && !threat.acknowledged && <span className="rounded bg-destructive/10 px-1 py-0.5 text-[8px] text-destructive">Action Required</span>}
                      {threat.acknowledged && <CheckCircle className="h-3 w-3 text-success/40" />}
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground/40">{threat.source} &bull; {formatRelativeTime(threat.publishedAt)}</p>
                  </div>
                  {isExp ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/30" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/30" />}
                </button>
                {isExp && (
                  <div className="border-t border-border/10 px-4 py-3 space-y-2 animate-fade-in">
                    <p className="text-xs text-foreground/70">{threat.summary}</p>
                    <div className="flex flex-wrap gap-1">
                      {threat.affectedSystems.map((s) => <span key={s} className="rounded bg-white/[0.03] px-2 py-0.5 text-[9px] text-muted-foreground/40">{s}</span>)}
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
