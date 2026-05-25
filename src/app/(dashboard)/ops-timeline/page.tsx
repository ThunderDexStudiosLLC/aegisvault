"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Clock, Flag, AlertTriangle, Zap, Shield, Globe, Bot,
  MessageSquare, Eye, Activity, Search, ChevronDown, ChevronUp,
  Pin, Lock, Filter, Cpu, RefreshCw, Camera, Link2,
  Layers, PlayCircle, PauseCircle, CheckCircle, Archive,
  TrendingUp, TrendingDown, Minus, Brain,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useTimeline } from "@/contexts/TimelineContext";
import { useOrb } from "@/contexts/OrbContext";
import type { TimelineCategory, OpsMemoryType } from "@/types";

type ViewMode = "timeline" | "recall" | "continuity" | "snapshots" | "graph";

const viewTabs: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "recall", label: "Executive Recall", icon: Brain },
  { id: "continuity", label: "Continuity", icon: Link2 },
  { id: "snapshots", label: "Snapshots", icon: Camera },
  { id: "graph", label: "Visualization", icon: Layers },
];

const categoryIcons: Record<TimelineCategory, React.ElementType> = {
  decision: Flag,
  incident: AlertTriangle,
  workflow: Zap,
  access: Eye,
  milestone: CheckCircle,
  "ai-action": Bot,
  security: Shield,
  communication: MessageSquare,
  governance: Lock,
  ecosystem: Globe,
};

const categoryColors: Record<TimelineCategory, string> = {
  decision: "text-electric", incident: "text-destructive", workflow: "text-cyan-400",
  access: "text-emerald-400", milestone: "text-success", "ai-action": "text-violet-400",
  security: "text-orange-400", communication: "text-amber-400", governance: "text-purple-400",
  ecosystem: "text-teal-400",
};

const severityColors: Record<string, string> = {
  info: "bg-electric/[0.06] text-electric/50", warning: "bg-warning/10 text-warning",
  high: "bg-orange-400/10 text-orange-400", critical: "bg-destructive/10 text-destructive",
};

const memoryTypeColors: Record<OpsMemoryType, string> = {
  operational: "text-cyan-400", executive: "text-electric", legal: "text-purple-400",
  infrastructure: "text-amber-400", communications: "text-emerald-400", security: "text-orange-400",
  "ai-activity": "text-violet-400", governance: "text-purple-400", strategic: "text-teal-400",
  "founder-private": "text-destructive",
};

const allCategories: TimelineCategory[] = ["decision", "incident", "workflow", "access", "milestone", "ai-action", "security", "communication", "governance", "ecosystem"];

export default function OpsTimelinePage() {
  const [view, setView] = useState<ViewMode>("timeline");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<TimelineCategory | "all">("all");
  const tl = useTimeline();
  const { setState } = useOrb();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { setState("linking-memory"); return () => setState("idle"); }, [setState]);

  const filteredEvents = (() => {
    let evts = tl.events;
    if (categoryFilter !== "all") evts = evts.filter((e) => e.category === categoryFilter);
    if (searchQuery.trim()) evts = tl.searchEvents(searchQuery);
    return [...evts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  })();

  // Graph visualization
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width = canvas.parentElement?.clientWidth ?? 900;
    const h = canvas.height = 500;
    ctx.clearRect(0, 0, w, h);

    const events = tl.events;
    const nodeRadius = 8;
    const nodes = events.map((e, i) => {
      const angle = (i / events.length) * Math.PI * 2;
      const rx = w * 0.38;
      const ry = h * 0.38;
      return { ...e, x: w / 2 + Math.cos(angle) * rx, y: h / 2 + Math.sin(angle) * ry };
    });

    // Draw links
    ctx.globalAlpha = 0.15;
    for (const node of nodes) {
      for (const linkedId of node.linkedEventIds) {
        const target = nodes.find((n) => n.id === linkedId);
        if (target) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    ctx.globalAlpha = 1;
    for (const node of nodes) {
      const color = node.severity === "critical" ? "#ef4444" : node.severity === "high" ? "#f97316" : node.category === "ai-action" ? "#8b5cf6" : node.category === "security" ? "#f97316" : node.category === "decision" ? "#3b82f6" : node.category === "milestone" ? "#22c55e" : "#06b6d4";
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (node.pinned) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      const label = node.title.length > 28 ? node.title.slice(0, 28) + "…" : node.title;
      ctx.fillText(label, node.x, node.y + nodeRadius + 12);
    }

    // Center label
    ctx.fillStyle = "rgba(100,160,255,0.15)";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(100,160,255,0.5)";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("OPS", w / 2, h / 2 - 2);
    ctx.fillText("TIMELINE", w / 2, h / 2 + 10);
  }, [tl.events]);

  useEffect(() => {
    if (view === "graph") { const id = requestAnimationFrame(drawGraph); return () => cancelAnimationFrame(id); }
  }, [view, drawGraph]);

  const threadStatusIcon = (status: string) => {
    if (status === "active") return <PlayCircle className="h-3.5 w-3.5 text-success" />;
    if (status === "paused") return <PauseCircle className="h-3.5 w-3.5 text-amber-400" />;
    if (status === "resolved") return <CheckCircle className="h-3.5 w-3.5 text-electric" />;
    return <Archive className="h-3.5 w-3.5 text-muted-foreground/30" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground/90 tracking-tight">Operational Intelligence Timeline</h1>
          <p className="text-sm text-muted-foreground/50 mt-1">Secure operational memory &middot; Executive recall &middot; Continuity intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-electric/10 bg-electric/[0.04] px-3 py-1.5">
            <Clock className="h-3.5 w-3.5 text-electric/60" />
            <span className="text-xs text-electric/70 font-mono">{tl.stats.totalEvents} Events</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-success/10 bg-success/[0.04] px-3 py-1.5">
            <Link2 className="h-3.5 w-3.5 text-success/60" />
            <span className="text-xs text-success/70 font-mono">{tl.stats.activeThreads} Threads</span>
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
      {/* TIMELINE VIEW */}
      {/* ============================================================ */}
      {view === "timeline" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Total Events", value: tl.stats.totalEvents, color: "text-electric", icon: Activity },
              { label: "Pinned", value: tl.stats.pinnedEvents, color: "text-amber-400", icon: Pin },
              { label: "Today", value: tl.stats.eventsToday, color: "text-success", icon: Clock },
              { label: "AI Generated", value: tl.stats.aiGeneratedEvents, color: "text-violet-400", icon: Bot },
              { label: "Encrypted", value: tl.stats.encryptedEvents, color: "text-cyan-400", icon: Lock },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="aegis-card p-3">
                  <div className="flex items-center justify-between">
                    <Icon className={cn("h-3.5 w-3.5", stat.color)} />
                    <span className={cn("text-lg font-bold", stat.color)}>{stat.value}</span>
                  </div>
                  <p className="mt-1.5 text-[9px] font-mono uppercase tracking-wider text-muted-foreground/40">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Search + Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
              <input type="text" placeholder="Search timeline events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border/10 bg-white/[0.02] py-2 pl-10 pr-4 text-sm text-foreground/80 placeholder:text-muted-foreground/20 focus:border-electric/20 focus:outline-none" />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border/10 bg-white/[0.02] px-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground/30" />
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as TimelineCategory | "all")}
                className="bg-transparent text-xs text-foreground/60 border-none outline-none py-2 pr-4">
                <option value="all">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="aegis-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mb-3">Event Categories</p>
            <div className="flex gap-2 flex-wrap">
              {allCategories.map((cat) => {
                const Icon = categoryIcons[cat];
                const count = tl.stats.categoryCounts[cat];
                return (
                  <button key={cat} onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
                    className={cn("flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition-all",
                      categoryFilter === cat ? "bg-electric/[0.08] border-electric/15 text-electric" : "border-border/10 text-muted-foreground/40 hover:bg-white/[0.02]"
                    )}>
                    <Icon className="h-3 w-3" />
                    <span className="capitalize">{cat.replace(/-/g, " ")}</span>
                    <span className="font-mono text-[8px] opacity-50">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event List */}
          <div className="space-y-2">
            {filteredEvents.map((evt) => {
              const Icon = categoryIcons[evt.category];
              const expanded = expandedEvent === evt.id;
              const linkedEvents = tl.getLinkedEvents(evt.id);
              return (
                <div key={evt.id} className={cn("aegis-card p-4",
                  evt.severity === "critical" && "border-destructive/10",
                  evt.pinned && "border-electric/10"
                )}>
                  <div className="flex items-start gap-3">
                    {/* Timeline connector */}
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl shrink-0",
                      evt.severity === "critical" ? "bg-destructive/10" : evt.severity === "high" ? "bg-orange-400/10" :
                      `bg-white/[0.03]`
                    )}>
                      <Icon className={cn("h-4 w-4", categoryColors[evt.category])} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-foreground/90">{evt.title}</h3>
                        {evt.pinned && <Pin className="h-3 w-3 text-amber-400/60" />}
                        {evt.encrypted && <Lock className="h-3 w-3 text-electric/40" />}
                        {evt.aiGenerated && <Bot className="h-3 w-3 text-violet-400/40" />}
                      </div>
                      <div className="flex items-center gap-2 text-[9px]">
                        <span className={cn("font-mono uppercase", categoryColors[evt.category])}>{evt.category.replace(/-/g, " ")}</span>
                        <span className="text-muted-foreground/20">&bull;</span>
                        <span className={cn("font-mono uppercase", memoryTypeColors[evt.memoryType])}>{evt.memoryType.replace(/-/g, " ")}</span>
                        <span className="text-muted-foreground/20">&bull;</span>
                        <span className="text-muted-foreground/40">{evt.actor}</span>
                        <span className="text-muted-foreground/20">&bull;</span>
                        <span className="text-muted-foreground/30">{formatRelativeTime(evt.timestamp)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {evt.severity !== "info" && (
                        <span className={cn("text-[8px] font-mono uppercase px-1.5 py-0.5 rounded", severityColors[evt.severity])}>{evt.severity}</span>
                      )}
                      {linkedEvents.length > 0 && (
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.03] text-muted-foreground/30">{linkedEvents.length} linked</span>
                      )}
                      <button onClick={() => setExpandedEvent(expanded ? null : evt.id)} className="p-1 rounded hover:bg-white/[0.03]">
                        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-3 border-t border-border/10 pt-3 space-y-3">
                      <p className="text-[11px] text-foreground/50">{evt.description}</p>

                      <div className="flex flex-wrap gap-1">
                        {evt.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-white/[0.03] px-2 py-0.5 text-[9px] text-foreground/40 font-mono">{tag}</span>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div><span className="text-muted-foreground/30">Workspace:</span> <span className="text-foreground/50 font-mono">{evt.workspaceId}</span></div>
                        <div><span className="text-muted-foreground/30">Governance:</span> <span className={evt.governanceCompliant ? "text-success" : "text-destructive"}>{evt.governanceCompliant ? "Compliant" : "Non-compliant"}</span></div>
                        <div><span className="text-muted-foreground/30">Audit:</span> <span className={evt.auditLogged ? "text-success" : "text-amber-400"}>{evt.auditLogged ? "Logged" : "Pending"}</span></div>
                      </div>

                      {linkedEvents.length > 0 && (
                        <div>
                          <p className="text-[9px] font-mono uppercase text-muted-foreground/25 mb-1">Linked Events</p>
                          <div className="space-y-1">
                            {linkedEvents.map((le) => {
                              const LIcon = categoryIcons[le.category];
                              return (
                                <div key={le.id} className="flex items-center gap-2 rounded-lg bg-white/[0.02] p-2">
                                  <LIcon className={cn("h-3 w-3", categoryColors[le.category])} />
                                  <span className="text-[10px] text-foreground/50">{le.title}</span>
                                  <span className="text-[8px] text-muted-foreground/20">{formatRelativeTime(le.timestamp)}</span>
                                </div>
                              );
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
        </div>
      )}

      {/* ============================================================ */}
      {/* EXECUTIVE RECALL */}
      {/* ============================================================ */}
      {view === "recall" && (
        <div className="space-y-6">
          {/* Recall Query Suggestions */}
          <div className="aegis-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mb-3">Executive Recall Commands</p>
            <div className="grid grid-cols-2 gap-2">
              {tl.recallQueries.map((rq) => (
                <button key={rq.id} onClick={() => setSearchQuery(rq.query)} className="flex items-start gap-3 rounded-xl border border-border/10 bg-white/[0.01] p-3 text-left hover:bg-electric/[0.02] hover:border-electric/10 transition-all">
                  <Brain className="h-4 w-4 text-electric/50 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground/70">{rq.query}</p>
                    <p className="text-[9px] text-muted-foreground/30 mt-0.5">{rq.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] font-mono text-electric/40">{rq.resultCount} results</span>
                      <span className="text-[8px] text-muted-foreground/20">&bull;</span>
                      <span className="text-[8px] text-muted-foreground/20">{rq.executedBy}</span>
                      {rq.aiAssisted && <Bot className="h-2.5 w-2.5 text-violet-400/40" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pinned Events */}
          <div className="aegis-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Pin className="h-3.5 w-3.5 text-amber-400/60" />
              <p className="text-sm font-semibold text-foreground/80">Pinned Events</p>
            </div>
            <div className="space-y-2">
              {tl.getPinnedEvents().map((evt) => {
                const Icon = categoryIcons[evt.category];
                return (
                  <div key={evt.id} className="flex items-center gap-3 rounded-lg border border-amber-400/5 bg-amber-400/[0.02] px-4 py-3">
                    <Icon className={cn("h-4 w-4", categoryColors[evt.category])} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground/80">{evt.title}</p>
                      <p className="text-[9px] text-muted-foreground/30">{evt.actor} &bull; {formatRelativeTime(evt.timestamp)}</p>
                    </div>
                    <span className={cn("text-[8px] font-mono uppercase px-1.5 py-0.5 rounded", severityColors[evt.severity])}>{evt.severity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical Events */}
          <div className="aegis-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive/60" />
              <p className="text-sm font-semibold text-foreground/80">Critical & High-Severity Events</p>
            </div>
            <div className="space-y-2">
              {tl.getCriticalEvents().map((evt) => {
                const Icon = categoryIcons[evt.category];
                return (
                  <div key={evt.id} className={cn("flex items-center gap-3 rounded-lg border px-4 py-3",
                    evt.severity === "critical" ? "border-destructive/10 bg-destructive/[0.02]" : "border-orange-400/10 bg-orange-400/[0.02]"
                  )}>
                    <Icon className={cn("h-4 w-4", evt.severity === "critical" ? "text-destructive" : "text-orange-400")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground/80">{evt.title}</p>
                      <p className="text-[9px] text-muted-foreground/30">{evt.actor} &bull; {formatRelativeTime(evt.timestamp)}</p>
                    </div>
                    <span className={cn("text-[8px] font-mono uppercase px-1.5 py-0.5 rounded", severityColors[evt.severity])}>{evt.severity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI-Generated Intelligence */}
          <div className="aegis-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="h-3.5 w-3.5 text-violet-400/60" />
              <p className="text-sm font-semibold text-foreground/80">AI-Generated Intelligence</p>
            </div>
            <div className="space-y-2">
              {tl.getAiGeneratedEvents().map((evt) => {
                const Icon = categoryIcons[evt.category];
                return (
                  <div key={evt.id} className="flex items-center gap-3 rounded-lg border border-violet-400/5 bg-violet-400/[0.02] px-4 py-3">
                    <Icon className={cn("h-4 w-4", categoryColors[evt.category])} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground/80">{evt.title}</p>
                      <p className="text-[9px] text-muted-foreground/30">{evt.actor} &bull; {formatRelativeTime(evt.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CONTINUITY THREADS */}
      {/* ============================================================ */}
      {view === "continuity" && (
        <div className="space-y-6">
          {/* Thread stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Active Threads", value: tl.getActiveThreads().length, color: "text-success" },
              { label: "Paused", value: tl.getPausedThreads().length, color: "text-amber-400" },
              { label: "Unresolved", value: tl.getUnresolvedThreads().length, color: "text-destructive" },
              { label: "Total Threads", value: tl.threads.length, color: "text-electric" },
            ].map((stat) => (
              <div key={stat.label} className="aegis-card p-4">
                <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Thread List */}
          <div className="space-y-2">
            {tl.threads.map((thread) => {
              const expanded = expandedThread === thread.id;
              const threadEvents = tl.getThreadEvents(thread.id);
              const Icon = categoryIcons[thread.category];
              return (
                <div key={thread.id} className={cn("aegis-card p-4",
                  thread.unresolved && thread.priority === "critical" && "border-destructive/10"
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{threadStatusIcon(thread.status)}</div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground/90">{thread.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5 text-[9px]">
                          <Icon className={cn("h-3 w-3", categoryColors[thread.category])} />
                          <span className={cn("font-mono uppercase", categoryColors[thread.category])}>{thread.category.replace(/-/g, " ")}</span>
                          <span className="text-muted-foreground/20">&bull;</span>
                          <span className={cn("font-mono uppercase", memoryTypeColors[thread.memoryType])}>{thread.memoryType.replace(/-/g, " ")}</span>
                          <span className="text-muted-foreground/20">&bull;</span>
                          <span className="text-muted-foreground/40">{thread.owner}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[8px] font-mono uppercase px-1.5 py-0.5 rounded",
                        thread.priority === "critical" ? "bg-destructive/10 text-destructive" :
                        thread.priority === "high" ? "bg-orange-400/10 text-orange-400" :
                        thread.priority === "medium" ? "bg-amber-400/10 text-amber-400" :
                        "bg-white/[0.03] text-muted-foreground/30"
                      )}>{thread.priority}</span>
                      <span className={cn("text-[8px] font-mono px-1.5 py-0.5 rounded",
                        thread.status === "active" ? "bg-success/10 text-success" :
                        thread.status === "paused" ? "bg-amber-400/10 text-amber-400" :
                        thread.status === "resolved" ? "bg-electric/10 text-electric" :
                        "bg-white/[0.03] text-muted-foreground/30"
                      )}>{thread.status}</span>
                      <span className="text-[8px] font-mono text-muted-foreground/20">{threadEvents.length} events</span>
                      <button onClick={() => setExpandedThread(expanded ? null : thread.id)} className="p-1 rounded hover:bg-white/[0.03]">
                        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-3 border-t border-border/10 pt-3 space-y-3">
                      <p className="text-[11px] text-foreground/40">{thread.description}</p>

                      {/* AI Summary */}
                      <div className="rounded-lg bg-electric/[0.03] border border-electric/5 p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Bot className="h-3 w-3 text-electric/50" />
                          <span className="text-[9px] font-mono uppercase text-electric/40">AI Continuity Summary</span>
                        </div>
                        <p className="text-[11px] text-foreground/50">{thread.aiSummary}</p>
                      </div>

                      {/* Thread timeline dates */}
                      <div className="flex items-center gap-4 text-[9px] text-muted-foreground/30">
                        <span>Started: {formatRelativeTime(thread.startedAt)}</span>
                        <span>Last update: {formatRelativeTime(thread.lastUpdatedAt)}</span>
                      </div>

                      {/* Linked events */}
                      <div>
                        <p className="text-[9px] font-mono uppercase text-muted-foreground/25 mb-1.5">Thread Events</p>
                        <div className="space-y-1">
                          {threadEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((evt) => {
                            const EIcon = categoryIcons[evt.category];
                            return (
                              <div key={evt.id} className="flex items-center gap-2 rounded-lg bg-white/[0.02] p-2">
                                <EIcon className={cn("h-3 w-3", categoryColors[evt.category])} />
                                <span className="text-[10px] text-foreground/50 flex-1">{evt.title}</span>
                                <span className="text-[8px] text-muted-foreground/20">{formatRelativeTime(evt.timestamp)}</span>
                              </div>
                            );
                          })}
                        </div>
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
      {/* SNAPSHOTS */}
      {/* ============================================================ */}
      {view === "snapshots" && (
        <div className="space-y-6">
          <div className="aegis-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mb-3">Quick Actions</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Capture Snapshot", icon: Camera },
                { label: "Export Timeline", icon: RefreshCw },
                { label: "Generate AI Summary", icon: Bot },
                { label: "Search Memory", icon: Search },
              ].map((action) => {
                const AIcon = action.icon;
                return (
                  <button key={action.label} className="flex items-center gap-1.5 rounded-lg border border-border/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-foreground/60 hover:bg-electric/[0.04] hover:text-electric hover:border-electric/15 transition-all">
                    <AIcon className="h-3 w-3" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            {tl.snapshots.map((snap) => (
              <div key={snap.id} className="aegis-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10">
                      <Camera className="h-5 w-5 text-electric" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground/90">{snap.title}</h3>
                      <p className="text-[9px] text-muted-foreground/30">Captured by {snap.capturedBy} &bull; {formatRelativeTime(snap.capturedAt)}</p>
                    </div>
                  </div>
                  {snap.encrypted && <Lock className="h-3.5 w-3.5 text-electric/40" />}
                </div>
                <div className="grid grid-cols-3 gap-3 text-[10px]">
                  <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                    <p className="text-lg font-bold text-electric">{snap.eventCount}</p>
                    <p className="text-[9px] font-mono text-muted-foreground/40">Events</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                    <p className="text-lg font-bold text-success">{snap.threadCount}</p>
                    <p className="text-[9px] font-mono text-muted-foreground/40">Threads</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                    <p className="text-lg font-bold text-amber-400">{snap.memoryTypes.length}</p>
                    <p className="text-[9px] font-mono text-muted-foreground/40">Memory Types</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[9px] text-muted-foreground/30">Coverage:</span>
                  <span className="text-[10px] text-foreground/50">{snap.coveragePeriod}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {snap.memoryTypes.map((mt) => (
                    <span key={mt} className={cn("rounded-full bg-white/[0.03] px-2 py-0.5 text-[8px] font-mono", memoryTypeColors[mt])}>{mt.replace(/-/g, " ")}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* GRAPH VISUALIZATION */}
      {/* ============================================================ */}
      {view === "graph" && (
        <div className="space-y-6">
          <div className="aegis-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground/80">Event Relationship Graph</p>
              <div className="flex gap-3 text-[9px]">
                {[
                  { color: "#3b82f6", label: "Decision" },
                  { color: "#ef4444", label: "Incident" },
                  { color: "#22c55e", label: "Milestone" },
                  { color: "#8b5cf6", label: "AI Action" },
                  { color: "#f97316", label: "Security" },
                  { color: "#06b6d4", label: "Other" },
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

          {/* Continuity threads summary */}
          <div className="aegis-card p-4">
            <p className="text-sm font-semibold text-foreground/80 mb-3">Active Continuity Threads</p>
            <div className="grid grid-cols-2 gap-2">
              {tl.getActiveThreads().map((thread) => (
                <div key={thread.id} className="rounded-lg border border-border/5 bg-white/[0.01] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {threadStatusIcon(thread.status)}
                    <p className="text-xs font-medium text-foreground/70">{thread.title}</p>
                  </div>
                  <p className="text-[9px] text-muted-foreground/30">{thread.eventIds.length} events &bull; {thread.owner}</p>
                  <span className={cn("text-[8px] font-mono px-1.5 py-0.5 rounded",
                    thread.priority === "critical" ? "bg-destructive/10 text-destructive" : "bg-amber-400/10 text-amber-400"
                  )}>{thread.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
