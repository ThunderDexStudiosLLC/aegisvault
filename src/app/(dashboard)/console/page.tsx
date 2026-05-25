"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Shield, Lock, Key, Fingerprint, AlertTriangle, CheckCircle,
  Clock, Eye, Activity, RefreshCw, Monitor, Bot,
  Zap, Radio, Server, Globe, Layers, Brain,
  Play, Terminal, ChevronDown, ChevronUp, Cpu,
  TrendingUp, TrendingDown, Minus, ShieldAlert,
  Radar, Crown, Ban,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useConsole } from "@/contexts/ConsoleContext";
import { useOrb } from "@/contexts/OrbContext";
import { useFeedback } from "@/components/global/OperationalFeedback";

type ViewMode = "status" | "command" | "modules" | "ai" | "graph";

const viewTabs: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: "status", label: "Live Status", icon: Radio },
  { id: "command", label: "Command Center", icon: Terminal },
  { id: "modules", label: "Modules", icon: Cpu },
  { id: "ai", label: "AI Governance", icon: Bot },
  { id: "graph", label: "Infrastructure", icon: Globe },
];

const moduleIcons: Record<string, React.ElementType> = {
  security: Radar, identity: Fingerprint, workspaces: Layers,
  "ai-governance": Bot, timeline: Clock, trust: Lock,
  continuity: Server, audit: Eye, incidents: ShieldAlert, ecosystem: Globe,
};

const statusColors: Record<string, string> = {
  operational: "text-success", degraded: "text-amber-400", warning: "text-orange-400",
  critical: "text-destructive", offline: "text-muted-foreground/30",
};

const statusBg: Record<string, string> = {
  operational: "bg-success/10", degraded: "bg-amber-400/10", warning: "bg-orange-400/10",
  critical: "bg-destructive/10", offline: "bg-white/[0.03]",
};

const cmdCategoryColors: Record<string, string> = {
  security: "text-orange-400", identity: "text-electric", governance: "text-purple-400",
  continuity: "text-cyan-400", audit: "text-emerald-400", workspace: "text-teal-400", ai: "text-violet-400",
};

const severityBadge: Record<string, string> = {
  standard: "bg-electric/[0.06] text-electric/50",
  elevated: "bg-amber-400/10 text-amber-400",
  critical: "bg-destructive/10 text-destructive",
};

export default function ConsolePage() {
  const [view, setView] = useState<ViewMode>("status");
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [executedCmd, setExecutedCmd] = useState<string | null>(null);
  const con = useConsole();
  const { setState } = useOrb();
  const { show } = useFeedback();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const executeCommand = (cmdId: string, label: string, severity: string) => {
    if (severity === "critical") {
      setExecutedCmd(executedCmd === cmdId ? null : cmdId);
      if (executedCmd !== cmdId) {
        setState("alert");
        show("warning", `${label} requires confirmation`, "Founder-level authorization needed");
        setTimeout(() => setState("high-orchestration"), 2000);
      }
    } else {
      setExecutedCmd(cmdId);
      setState("processing");
      show("processing", `Executing: ${label}`, "Command queued for execution");
      setTimeout(() => {
        show("success", `${label} completed`, "Operational log entry created");
        setState("high-orchestration");
        setExecutedCmd(null);
      }, 2000);
    }
  };

  useEffect(() => { setState("high-orchestration"); return () => setState("idle"); }, [setState]);

  const postureColor = con.stats.overallPosture === "secure" ? "text-success" : con.stats.overallPosture === "monitoring" ? "text-electric" : con.stats.overallPosture === "elevated" ? "text-amber-400" : "text-destructive";
  const postureBg = con.stats.overallPosture === "secure" ? "bg-success/10" : con.stats.overallPosture === "monitoring" ? "bg-electric/10" : con.stats.overallPosture === "elevated" ? "bg-amber-400/10" : "bg-destructive/10";

  const trendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-success" />;
    if (trend === "down") return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-muted-foreground/20" />;
  };

  // Infrastructure graph
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width = canvas.parentElement?.clientWidth ?? 900;
    const h = canvas.height = 500;
    ctx.clearRect(0, 0, w, h);

    const modules = con.modules;
    const centerX = w / 2;
    const centerY = h / 2;

    // Central hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
    ctx.fill();
    ctx.fillStyle = "rgba(59, 130, 246, 0.7)";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("AEGIS", centerX, centerY - 3);
    ctx.fillText("CONSOLE", centerX, centerY + 8);

    // Module nodes
    const nodeRadius = 18;
    modules.forEach((mod, i) => {
      const angle = (i / modules.length) * Math.PI * 2 - Math.PI / 2;
      const rx = w * 0.32;
      const ry = h * 0.36;
      const x = centerX + Math.cos(angle) * rx;
      const y = centerY + Math.sin(angle) * ry;

      // Connection line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      const lineColor = mod.status === "operational" ? "rgba(34, 197, 94, 0.15)" : mod.status === "degraded" ? "rgba(251, 191, 36, 0.2)" : mod.status === "warning" ? "rgba(249, 115, 22, 0.2)" : "rgba(239, 68, 68, 0.2)";
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Animated pulse
      const pulseRadius = nodeRadius + 4 + Math.sin(Date.now() / 800 + i) * 3;
      ctx.beginPath();
      ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
      const pulseColor = mod.status === "operational" ? "rgba(34, 197, 94, 0.08)" : mod.status === "degraded" ? "rgba(251, 191, 36, 0.1)" : "rgba(249, 115, 22, 0.1)";
      ctx.strokeStyle = pulseColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Node
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      const nodeColor = mod.status === "operational" ? "rgba(34, 197, 94, 0.12)" : mod.status === "degraded" ? "rgba(251, 191, 36, 0.12)" : mod.status === "warning" ? "rgba(249, 115, 22, 0.12)" : "rgba(239, 68, 68, 0.12)";
      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Score
      const scoreColor = mod.score >= 90 ? "rgba(34, 197, 94, 0.8)" : mod.score >= 80 ? "rgba(59, 130, 246, 0.8)" : mod.score >= 70 ? "rgba(251, 191, 36, 0.8)" : "rgba(239, 68, 68, 0.8)";
      ctx.fillStyle = scoreColor;
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${mod.score}%`, x, y + 4);

      // Label
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "9px monospace";
      const name = mod.name.length > 18 ? mod.name.slice(0, 18) + "…" : mod.name;
      ctx.fillText(name, x, y + nodeRadius + 14);

      // Alert badge
      if (mod.activeAlerts > 0) {
        ctx.beginPath();
        ctx.arc(x + nodeRadius - 4, y - nodeRadius + 4, 7, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 8px sans-serif";
        ctx.fillText(String(mod.activeAlerts), x + nodeRadius - 4, y - nodeRadius + 7);
      }
    });

    // Cross-module connections
    const connections = [
      [0, 1], [0, 5], [1, 2], [2, 3], [3, 4], [5, 6], [6, 8], [0, 8], [7, 9], [3, 9],
    ];
    ctx.globalAlpha = 0.06;
    for (const [a, b] of connections) {
      const angleA = (a / modules.length) * Math.PI * 2 - Math.PI / 2;
      const angleB = (b / modules.length) * Math.PI * 2 - Math.PI / 2;
      const rx = w * 0.32;
      const ry = h * 0.36;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angleA) * rx, centerY + Math.sin(angleA) * ry);
      ctx.lineTo(centerX + Math.cos(angleB) * rx, centerY + Math.sin(angleB) * ry);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, [con.modules]);

  useEffect(() => {
    if (view !== "graph") return;
    let frameId: number;
    const animate = () => { drawGraph(); frameId = requestAnimationFrame(animate); };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [view, drawGraph]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground/90 tracking-tight">Enterprise Console</h1>
          <p className="text-sm text-muted-foreground/50 mt-1">Master operational command &middot; Executive intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-1.5", postureBg, postureColor === "text-success" ? "border-success/10" : postureColor === "text-electric" ? "border-electric/10" : "border-amber-400/10")}>
            <Shield className={cn("h-3.5 w-3.5", postureColor)} />
            <span className={cn("text-xs font-mono uppercase", postureColor)}>{con.stats.overallPosture}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-electric/10 bg-electric/[0.04] px-3 py-1.5">
            <Activity className="h-3.5 w-3.5 text-electric/60" />
            <span className="text-xs text-electric/70 font-mono">{con.stats.overallScore}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white/[0.02] p-1 border border-border/10">
        {viewTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setView(tab.id)} className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all",
              view === tab.id ? "bg-electric/[0.08] text-electric-glow shadow-sm" : "text-muted-foreground/50 hover:text-foreground/70 hover:bg-white/[0.02]"
            )}>
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* LIVE STATUS */}
      {/* ============================================================ */}
      {view === "status" && (
        <div className="space-y-6">
          {/* Overall Posture */}
          <div className={cn("aegis-card p-5 border-l-2", postureColor === "text-success" ? "border-l-success" : postureColor === "text-electric" ? "border-l-electric" : "border-l-amber-400")}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", postureBg)}>
                  <Shield className={cn("h-6 w-6", postureColor)} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground/90">Operational Security Posture</h2>
                  <p className="text-xs text-muted-foreground/40">{con.stats.modulesOperational}/{con.stats.totalModules} modules operational &bull; Last audit: {formatRelativeTime(con.stats.lastFullAudit)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-3xl font-bold", postureColor)}>{con.stats.overallScore}%</p>
                <p className="text-[9px] font-mono uppercase text-muted-foreground/30">OVERALL SCORE</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[
                { label: "Active Sessions", value: con.stats.activeSessions, icon: Monitor, color: "text-electric" },
                { label: "AI Agents", value: con.stats.activeAiAgents, icon: Bot, color: "text-violet-400" },
                { label: "Incidents", value: con.stats.activeIncidents, icon: AlertTriangle, color: con.stats.activeIncidents > 0 ? "text-amber-400" : "text-success" },
                { label: "Pending Actions", value: con.stats.pendingActions, icon: Clock, color: con.stats.pendingActions > 0 ? "text-amber-400" : "text-success" },
                { label: "Modules OK", value: `${con.stats.modulesOperational}/${con.stats.totalModules}`, icon: CheckCircle, color: con.stats.modulesOperational === con.stats.totalModules ? "text-success" : "text-amber-400" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-lg bg-white/[0.02] p-3 text-center">
                    <Icon className={cn("h-4 w-4 mx-auto mb-1", stat.color)} />
                    <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                    <p className="text-[8px] font-mono uppercase text-muted-foreground/30">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Metrics */}
          <div className="grid grid-cols-5 gap-3">
            {con.metrics.map((metric) => (
              <div key={metric.id} className={cn("aegis-card p-3", metric.status === "warning" && "border-amber-400/5", metric.status === "critical" && "border-destructive/10")}>
                <div className="flex items-center justify-between mb-1">
                  {trendIcon(metric.trend)}
                  <span className={cn("text-lg font-bold",
                    metric.status === "healthy" ? "text-success" : metric.status === "warning" ? "text-amber-400" : "text-destructive"
                  )}>{metric.value}{metric.unit || ""}</span>
                </div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/40">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Module Quick Status */}
          <div className="aegis-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mb-3">Module Status Overview</p>
            <div className="grid grid-cols-5 gap-2">
              {con.modules.map((mod) => {
                const Icon = moduleIcons[mod.id] || Shield;
                return (
                  <div key={mod.id} className={cn("rounded-lg border bg-white/[0.01] p-3 text-center",
                    mod.status === "operational" ? "border-success/5" : mod.status === "degraded" ? "border-amber-400/10" : mod.status === "warning" ? "border-orange-400/10" : "border-destructive/10"
                  )}>
                    <Icon className={cn("h-4 w-4 mx-auto mb-1.5", statusColors[mod.status])} />
                    <p className="text-[10px] font-medium text-foreground/70 leading-tight">{mod.name}</p>
                    <p className={cn("text-sm font-bold mt-1", mod.score >= 90 ? "text-success" : mod.score >= 80 ? "text-electric" : mod.score >= 70 ? "text-amber-400" : "text-destructive")}>{mod.score}%</p>
                    {mod.activeAlerts > 0 && (
                      <span className="inline-block mt-1 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[8px] text-destructive">{mod.activeAlerts} alert{mod.activeAlerts > 1 ? "s" : ""}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alerts */}
          {con.getDegradedModules().length > 0 && (
            <div className="aegis-card p-4 border-amber-400/5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400/50 mb-3">Attention Required</p>
              <div className="space-y-2">
                {con.getDegradedModules().map((mod) => {
                  const Icon = moduleIcons[mod.id] || Shield;
                  return (
                    <div key={mod.id} className={cn("flex items-center gap-3 rounded-lg border px-4 py-3", statusBg[mod.status], mod.status === "warning" ? "border-orange-400/10" : "border-amber-400/10")}>
                      <Icon className={cn("h-4 w-4", statusColors[mod.status])} />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground/80">{mod.name}</p>
                        <p className="text-[9px] text-muted-foreground/30">{mod.description}</p>
                      </div>
                      <span className={cn("text-[8px] font-mono uppercase px-1.5 py-0.5 rounded", statusBg[mod.status], statusColors[mod.status])}>{mod.status}</span>
                      <span className={cn("text-sm font-bold", mod.score >= 80 ? "text-amber-400" : "text-destructive")}>{mod.score}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* COMMAND CENTER */}
      {/* ============================================================ */}
      {view === "command" && (
        <div className="space-y-6">
          {/* Critical Commands */}
          <div className="aegis-card p-4 border-destructive/5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-destructive/50 mb-3">Critical Operations</p>
            <div className="grid grid-cols-3 gap-3">
              {con.getCriticalCommands().map((cmd) => (
                <button key={cmd.id} onClick={() => executeCommand(cmd.id, cmd.label, cmd.severity)}
                  className={cn("flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                    executedCmd === cmd.id ? "border-destructive/20 bg-destructive/[0.04]" : "border-destructive/5 bg-white/[0.01] hover:bg-destructive/[0.02] hover:border-destructive/10"
                  )}>
                  <Ban className="h-5 w-5 text-destructive/60 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">{cmd.label}</p>
                    <p className="text-[10px] text-muted-foreground/40 mt-0.5">{cmd.description}</p>
                    {executedCmd === cmd.id && (
                      <div className="mt-2 rounded-lg bg-destructive/10 p-2">
                        <p className="text-[10px] text-destructive font-medium">⚠ Requires founder confirmation</p>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* All Commands */}
          <div className="aegis-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mb-3">All Commands</p>
            <div className="grid grid-cols-2 gap-2">
              {con.commands.filter((c) => c.severity !== "critical").map((cmd) => (
                <button key={cmd.id} onClick={() => executeCommand(cmd.id, cmd.label, cmd.severity)}
                  className={cn("flex items-start gap-3 rounded-xl border p-3 text-left transition-all",
                    executedCmd === cmd.id ? "border-electric/15 bg-electric/[0.04]" : "border-border/10 bg-white/[0.01] hover:bg-white/[0.02]"
                  )}>
                  <Play className={cn("h-4 w-4 mt-0.5 shrink-0", cmdCategoryColors[cmd.category])} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-foreground/80">{cmd.label}</p>
                      <span className={cn("text-[7px] font-mono uppercase px-1 py-0.5 rounded", severityBadge[cmd.severity])}>{cmd.severity}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground/30 mt-0.5">{cmd.description}</p>
                    {executedCmd === cmd.id && (
                      <div className="mt-2 rounded-lg bg-electric/[0.04] p-2 flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-electric/60" />
                        <p className="text-[10px] text-electric/60 font-medium">Command queued for execution</p>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Command Categories */}
          <div className="aegis-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mb-3">Commands by Category</p>
            <div className="flex gap-2 flex-wrap">
              {(["security", "identity", "governance", "continuity", "audit", "workspace", "ai"] as const).map((cat) => {
                const count = con.getCommandsByCategory(cat).length;
                return (
                  <div key={cat} className="flex items-center gap-1.5 rounded-lg border border-border/10 bg-white/[0.02] px-3 py-1.5">
                    <span className={cn("text-[10px] font-medium capitalize", cmdCategoryColors[cat])}>{cat}</span>
                    <span className="text-[8px] font-mono text-muted-foreground/20">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODULES */}
      {/* ============================================================ */}
      {view === "modules" && (
        <div className="space-y-6">
          {/* Module grid */}
          <div className="grid grid-cols-2 gap-3">
            {con.modules.map((mod) => {
              const Icon = moduleIcons[mod.id] || Shield;
              const expanded = expandedModule === mod.id;
              return (
                <div key={mod.id} className={cn("aegis-card p-4",
                  mod.status !== "operational" && "border-amber-400/5"
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", statusBg[mod.status])}>
                        <Icon className={cn("h-5 w-5", statusColors[mod.status])} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground/90">{mod.name}</h3>
                        <p className="text-[9px] text-muted-foreground/30 mt-0.5">{mod.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-bold", mod.score >= 90 ? "text-success" : mod.score >= 80 ? "text-electric" : mod.score >= 70 ? "text-amber-400" : "text-destructive")}>{mod.score}%</span>
                      <button onClick={() => setExpandedModule(expanded ? null : mod.id)} className="p-1 rounded hover:bg-white/[0.03]">
                        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                      </button>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mt-3 relative h-1.5 rounded-full bg-white/[0.03]">
                    <div className={cn("absolute left-0 top-0 h-full rounded-full transition-all",
                      mod.score >= 90 ? "bg-success" : mod.score >= 80 ? "bg-electric" : mod.score >= 70 ? "bg-amber-400" : "bg-destructive"
                    )} style={{ width: `${mod.score}%` }} />
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-[9px]">
                    <span className={cn("font-mono uppercase px-1.5 py-0.5 rounded", statusBg[mod.status], statusColors[mod.status])}>{mod.status}</span>
                    {mod.activeAlerts > 0 && <span className="text-destructive">{mod.activeAlerts} alert{mod.activeAlerts > 1 ? "s" : ""}</span>}
                    <span className="text-muted-foreground/20">Checked: {formatRelativeTime(mod.lastChecked)}</span>
                  </div>

                  {expanded && (
                    <div className="mt-3 border-t border-border/10 pt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div><span className="text-muted-foreground/30">Score:</span> <span className="text-foreground/60 font-mono">{mod.score}/100</span></div>
                        <div><span className="text-muted-foreground/30">Status:</span> <span className={statusColors[mod.status]}>{mod.status}</span></div>
                        <div><span className="text-muted-foreground/30">Alerts:</span> <span className={mod.activeAlerts > 0 ? "text-destructive" : "text-success"}>{mod.activeAlerts}</span></div>
                        <div><span className="text-muted-foreground/30">Last Check:</span> <span className="text-foreground/60">{formatRelativeTime(mod.lastChecked)}</span></div>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => { show("processing", `Loading ${mod.name} details`); setTimeout(() => show("success", `${mod.name} — ${mod.score}% health`, mod.description), 1500); }} className="rounded-lg border border-border/10 bg-white/[0.02] px-2.5 py-1 text-[10px] text-foreground/50 hover:bg-electric/[0.04] hover:text-electric transition-all">View Details</button>
                        <button onClick={() => { setState("searching"); show("processing", `Auditing ${mod.name}...`); setTimeout(() => { show("success", `${mod.name} audit complete`, `Score: ${mod.score}% — ${mod.activeAlerts} active alerts`); setState("high-orchestration"); }, 2500); }} className="rounded-lg border border-border/10 bg-white/[0.02] px-2.5 py-1 text-[10px] text-foreground/50 hover:bg-electric/[0.04] hover:text-electric transition-all">Run Audit</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* AI GOVERNANCE */}
      {/* ============================================================ */}
      {view === "ai" && (
        <div className="space-y-6">
          {/* AI Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Active Agents", value: con.stats.activeAiAgents, color: "text-violet-400", icon: Bot },
              { label: "Governance Score", value: "91%", color: "text-success", icon: Shield },
              { label: "Memory Access Events", value: 8934, color: "text-electric", icon: Brain },
              { label: "Blocked Actions", value: 3, color: "text-destructive", icon: Ban },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="aegis-card p-4">
                  <div className="flex items-center justify-between">
                    <Icon className={cn("h-4 w-4", stat.color)} />
                    <span className={cn("text-lg font-bold", stat.color)}>{typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}</span>
                  </div>
                  <p className="mt-1.5 text-[9px] font-mono uppercase tracking-wider text-muted-foreground/40">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* AI Agent Status */}
          <div className="aegis-card p-4">
            <p className="text-sm font-semibold text-foreground/80 mb-3">Agent Compliance Overview</p>
            <div className="space-y-2">
              {[
                { name: "AegisOSAI Orchestrator", role: "orchestrator", compliance: 95, status: "active", workspace: "Enterprise" },
                { name: "ForgeOps Deploy Agent", role: "operations", compliance: 92, status: "active", workspace: "Engineering" },
                { name: "IronFrame Sentinel", role: "security", compliance: 98, status: "active", workspace: "Security Ops" },
                { name: "Infrastructure Monitor", role: "analyst", compliance: 94, status: "active", workspace: "Infrastructure" },
                { name: "Executive Briefing Agent", role: "analyst", compliance: 96, status: "active", workspace: "Executive" },
                { name: "Ops Automation Agent", role: "operations", compliance: 91, status: "paused", workspace: "Operations" },
                { name: "Security Compliance Scanner", role: "security", compliance: 87, status: "restricted", workspace: "Enterprise" },
              ].map((agent) => (
                <div key={agent.name} className={cn("flex items-center gap-3 rounded-lg border bg-white/[0.01] px-4 py-3",
                  agent.compliance < 90 ? "border-amber-400/10" : "border-border/5"
                )}>
                  <Bot className={cn("h-4 w-4",
                    agent.status === "active" ? "text-violet-400" : agent.status === "paused" ? "text-amber-400" : "text-destructive"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground/80">{agent.name}</p>
                    <p className="text-[9px] text-muted-foreground/30">{agent.role} &bull; {agent.workspace}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/[0.03]">
                      <div className={cn("h-full rounded-full", agent.compliance >= 90 ? "bg-success" : "bg-amber-400")} style={{ width: `${agent.compliance}%` }} />
                    </div>
                    <span className={cn("text-xs font-bold w-10 text-right", agent.compliance >= 90 ? "text-success" : "text-amber-400")}>{agent.compliance}%</span>
                    <span className={cn("text-[8px] font-mono px-1.5 py-0.5 rounded",
                      agent.status === "active" ? "bg-success/10 text-success" :
                      agent.status === "paused" ? "bg-amber-400/10 text-amber-400" :
                      "bg-destructive/10 text-destructive"
                    )}>{agent.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Policies */}
          <div className="aegis-card p-4">
            <p className="text-sm font-semibold text-foreground/80 mb-3">Active Governance Policies</p>
            <div className="space-y-1.5">
              {[
                { policy: "Founder-private workspace access denied to all AI agents", status: "enforced" },
                { policy: "Restricted workspace access — metadata-only for approved agents", status: "enforced" },
                { policy: "Cross-workspace operations require orchestrator-level clearance", status: "enforced" },
                { policy: "AI memory recall limited to classification-appropriate data", status: "enforced" },
                { policy: "Agent actions generate immutable audit log entries", status: "enforced" },
                { policy: "Governance compliance below 90% triggers automatic restriction", status: "active" },
              ].map((item) => (
                <div key={item.policy} className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2">
                  <CheckCircle className="h-3 w-3 text-success/60 shrink-0" />
                  <p className="text-[10px] text-foreground/50 flex-1">{item.policy}</p>
                  <span className="text-[8px] font-mono text-success/50">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* INFRASTRUCTURE GRAPH */}
      {/* ============================================================ */}
      {view === "graph" && (
        <div className="space-y-6">
          <div className="aegis-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground/80">Infrastructure Module Graph</p>
              <div className="flex gap-3 text-[9px]">
                {[
                  { color: "rgba(34,197,94,0.8)", label: "Operational" },
                  { color: "rgba(251,191,36,0.8)", label: "Degraded" },
                  { color: "rgba(249,115,22,0.8)", label: "Warning" },
                  { color: "rgba(239,68,68,0.8)", label: "Critical" },
                ].map((legend) => (
                  <div key={legend.label} className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: legend.color }} />
                    <span className="text-muted-foreground/30">{legend.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-lg bg-white/[0.01] border border-border/5 overflow-hidden" style={{ height: 500 }}>
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>
          </div>

          {/* Module dependency summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="aegis-card p-4">
              <p className="text-sm font-semibold text-foreground/80 mb-3">Cross-Module Dependencies</p>
              <div className="space-y-1.5">
                {[
                  { from: "Security", to: "Identity", type: "bidirectional" },
                  { from: "Security", to: "Trust Infrastructure", type: "bidirectional" },
                  { from: "Identity", to: "Workspaces", type: "feeds" },
                  { from: "Workspaces", to: "AI Governance", type: "feeds" },
                  { from: "AI Governance", to: "Timeline", type: "logs to" },
                  { from: "Trust", to: "Continuity", type: "feeds" },
                  { from: "Continuity", to: "Incidents", type: "triggers" },
                  { from: "Security", to: "Incidents", type: "triggers" },
                  { from: "Audit", to: "Ecosystem", type: "feeds" },
                  { from: "AI Governance", to: "Ecosystem", type: "feeds" },
                ].map((dep, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-1.5 text-[10px]">
                    <span className="text-electric/60">{dep.from}</span>
                    <span className="text-muted-foreground/20">→</span>
                    <span className="text-foreground/50">{dep.to}</span>
                    <span className="ml-auto text-[8px] font-mono text-muted-foreground/20">{dep.type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="aegis-card p-4">
              <p className="text-sm font-semibold text-foreground/80 mb-3">System Health Summary</p>
              <div className="space-y-2">
                {con.modules.map((mod) => {
                  const Icon = moduleIcons[mod.id] || Shield;
                  return (
                    <div key={mod.id} className="flex items-center gap-2">
                      <Icon className={cn("h-3 w-3", statusColors[mod.status])} />
                      <span className="text-[10px] text-foreground/60 flex-1">{mod.name}</span>
                      <div className="w-24 h-1 rounded-full bg-white/[0.03]">
                        <div className={cn("h-full rounded-full", mod.score >= 90 ? "bg-success" : mod.score >= 80 ? "bg-electric" : mod.score >= 70 ? "bg-amber-400" : "bg-destructive")} style={{ width: `${mod.score}%` }} />
                      </div>
                      <span className={cn("text-[10px] font-mono w-8 text-right", mod.score >= 90 ? "text-success" : mod.score >= 80 ? "text-electric" : "text-amber-400")}>{mod.score}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
