"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Crown, Sun, AlertTriangle, Clock, ArrowRight, ChevronDown,
  ChevronUp, Lightbulb, Users, GitBranch, Activity, Brain,
  CheckCircle, Eye, EyeOff, RotateCcw, Sparkles, Shield,
  Calendar, Target, Bookmark, TrendingUp, FileText, Zap,
  Globe, Cpu, CreditCard, Phone, Building2, Map, Palette, Code, Hammer,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useFounder } from "@/contexts/FounderContext";
import { useOrb } from "@/contexts/OrbContext";
import type {
  FounderDigest, StrategicResurface, ContinuityReminder,
  FounderDecisionLog, ExecutiveContinuitySummary, FounderSurfaceType,
} from "@/types";

const productIcons: Record<string, React.ElementType> = {
  "ep-aegisvault": Shield, "ep-aegisosai": Cpu, "ep-forgeops": Hammer,
  "ep-aegispay": CreditCard, "ep-callaxis": Phone, "ep-civicops": Building2,
  "ep-civicfrontier": Map, "ep-assetfoundry": Palette, "ep-thundercode": Code,
};

const surfaceTypeConfig: Record<FounderSurfaceType, { label: string; color: string; icon: React.ElementType }> = {
  "unresolved-priority": { label: "Unresolved Priority", color: "text-warning", icon: AlertTriangle },
  "forgotten-discussion": { label: "Forgotten Discussion", color: "text-electric", icon: Brain },
  "linked-opportunity": { label: "Linked Opportunity", color: "text-success", icon: TrendingUp },
  "paused-project": { label: "Paused Project", color: "text-purple-400", icon: Clock },
  "incomplete-workflow": { label: "Incomplete Workflow", color: "text-orange-400", icon: Activity },
  "stale-relationship": { label: "Stale Relationship", color: "text-destructive", icon: Users },
  "strategic-continuity": { label: "Strategic Continuity", color: "text-cyan-400", icon: Target },
};

const importanceColor: Record<string, string> = {
  critical: "text-destructive bg-destructive/10",
  high: "text-warning bg-warning/10",
  medium: "text-electric bg-electric/10",
  low: "text-muted-foreground bg-white/[0.04]",
};

type ViewMode = "digest" | "resurface" | "reminders" | "decisions" | "continuity";

export default function FounderCommandPage() {
  const engine = useFounder();
  const { setState } = useOrb();
  const [view, setView] = useState<ViewMode>("digest");
  const [expandedDigestSections, setExpandedDigestSections] = useState<Record<string, boolean>>({});
  const [expandedResurface, setExpandedResurface] = useState<string | null>(null);
  const [expandedDecision, setExpandedDecision] = useState<string | null>(null);

  const todayDigest = useMemo(() => engine.getTodayDigest(), [engine]);
  const resurfaces = useMemo(() => engine.getActiveResurfaces(), [engine]);
  const reminders = useMemo(() => engine.getActiveReminders(), [engine]);
  const decisions = useMemo(() => engine.getDecisionLogs(), [engine]);
  const pendingDecisions = useMemo(() => engine.getPendingDecisions(), [engine]);
  const summaries = useMemo(() => engine.getContinuitySummaries(), [engine]);
  const stats = useMemo(() => engine.getFounderStats(), [engine]);

  useEffect(() => {
    setState("executive-briefing");
    const timer = setTimeout(() => setState("idle"), 4000);
    return () => clearTimeout(timer);
  }, [setState]);

  const toggleDigestSection = (id: string) => {
    setExpandedDigestSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="aegis-page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-500/20">
            <Crown className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Founder Command</h1>
            <p className="text-sm text-muted-foreground/60">Executive intelligence archive &mdash; proactive memory, continuity, and strategic resurfacing</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {stats.unresolvedPriorities > 0 && (
            <div className="aegis-badge bg-warning/10 text-warning">
              <AlertTriangle className="h-3 w-3" />
              {stats.unresolvedPriorities} unresolved
            </div>
          )}
          {stats.pendingDecisions > 0 && (
            <div className="aegis-badge bg-electric/10 text-electric">
              <Lightbulb className="h-3 w-3" />
              {stats.pendingDecisions} pending review
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Active Resurfaces", value: stats.activeResurfaces, icon: Brain, color: "text-electric" },
          { label: "Continuity Reminders", value: stats.activeReminders, icon: Clock, color: "text-warning" },
          { label: "Pending Decisions", value: stats.pendingDecisions, icon: Lightbulb, color: "text-amber-400" },
          { label: "Total Decisions", value: stats.totalDecisions, icon: CheckCircle, color: "text-success" },
          { label: "Unresolved", value: stats.unresolvedPriorities, icon: AlertTriangle, color: "text-destructive" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="aegis-card p-3 text-center">
              <Icon className={cn("h-4 w-4 mx-auto", stat.color)} />
              <p className="mt-1 text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/40">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-white/[0.02] p-1">
        {[
          { key: "digest" as ViewMode, label: "Daily Digest", icon: Sun },
          { key: "resurface" as ViewMode, label: "Strategic Resurface", icon: Brain, count: stats.activeResurfaces },
          { key: "reminders" as ViewMode, label: "Continuity", icon: Clock, count: stats.activeReminders },
          { key: "decisions" as ViewMode, label: "Decision Log", icon: Lightbulb, count: stats.pendingDecisions },
          { key: "continuity" as ViewMode, label: "Executive Summary", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all",
                view === tab.key
                  ? "bg-amber-500/10 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.08)]"
                  : "text-muted-foreground/50 hover:text-foreground/70"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500/20 px-1 text-[9px] font-bold text-amber-400">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* DAILY DIGEST VIEW */}
      {view === "digest" && todayDigest && (
        <div className="space-y-6">
          {/* Greeting */}
          <div className="aegis-card rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 ring-1 ring-amber-500/15">
                <Sun className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground/90">{todayDigest.greeting}</h2>
                <p className="mt-2 text-sm text-muted-foreground/60 leading-relaxed">{todayDigest.prioritySummary}</p>
                <div className="mt-4 flex items-center gap-4 text-[10px] text-muted-foreground/40">
                  <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-warning/50" /> {todayDigest.unresolvedCount} unresolved</span>
                  <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-electric/50" /> {todayDigest.newMemories} new memories</span>
                  <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-purple-400/50" /> {todayDigest.ecosystemAlerts} ecosystem alerts</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground/30" /> Generated {formatRelativeTime(todayDigest.generatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Digest Sections */}
          {todayDigest.sections.map((section) => {
            const isExpanded = expandedDigestSections[section.id] !== false;
            const sectionIcons: Record<string, React.ElementType> = {
              priorities: AlertTriangle, decisions: Lightbulb, relationships: Users,
              ecosystem: GitBranch, continuity: RotateCcw,
            };
            const SectionIcon = sectionIcons[section.type] || Activity;
            const sectionColors: Record<string, string> = {
              priorities: "text-warning", decisions: "text-amber-400", relationships: "text-electric",
              ecosystem: "text-purple-400", continuity: "text-cyan-400",
            };

            return (
              <div key={section.id} className="aegis-card rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleDigestSection(section.id)}
                  className="flex w-full items-center justify-between px-5 py-4 hover:bg-white/[0.01] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <SectionIcon className={cn("h-4 w-4", sectionColors[section.type])} />
                    <h3 className="text-sm font-semibold text-foreground/90">{section.title}</h3>
                    <span className="text-[9px] rounded bg-white/[0.04] px-1.5 py-0.5 text-muted-foreground/40">{section.items.length}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-border/10 px-5 py-3 space-y-2 animate-fade-in">
                    {section.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 rounded-lg p-3 hover:bg-white/[0.015] transition-colors">
                        <div className={cn("mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[9px] font-mono", importanceColor[item.importance])}>
                          {item.importance}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground/80 leading-relaxed">{item.content}</p>
                          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                            {item.relatedProductIds?.map((pid) => {
                              const PIcon = productIcons[pid] || Globe;
                              return <PIcon key={pid} className="h-3 w-3 text-muted-foreground/30" />;
                            })}
                            {item.timestamp && (
                              <span className="text-[9px] text-muted-foreground/30">{formatRelativeTime(item.timestamp)}</span>
                            )}
                            {item.actionRequired && (
                              <span className="text-[9px] text-warning/50 flex items-center gap-0.5"><Zap className="h-2.5 w-2.5" /> Action required</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* STRATEGIC RESURFACE VIEW */}
      {view === "resurface" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Strategic Memory Resurfacing</h2>
            <p className="text-xs text-muted-foreground/40">Proactively surfaced memories — unresolved priorities, forgotten discussions, linked opportunities</p>
          </div>

          {resurfaces.length === 0 ? (
            <div className="aegis-card rounded-xl p-8 text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-success/40" />
              <p className="mt-3 text-sm text-muted-foreground/60">All caught up. No strategic memories need resurfacing right now.</p>
            </div>
          ) : (
            resurfaces.map((resurface) => {
              const config = surfaceTypeConfig[resurface.type];
              const TypeIcon = config.icon;
              const isExpanded = expandedResurface === resurface.id;

              return (
                <div key={resurface.id} className="aegis-card rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]", config.color)}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground/90">{resurface.title}</h3>
                          <span className={cn("rounded px-1.5 py-0.5 text-[9px]", importanceColor[resurface.urgency])}>{resurface.urgency}</span>
                          <span className={cn("rounded px-1.5 py-0.5 text-[9px] bg-white/[0.03]", config.color)}>{config.label}</span>
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground/60 leading-relaxed">{resurface.reason}</p>
                        <div className="mt-2 flex items-center gap-3 text-[9px] text-muted-foreground/30">
                          <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {resurface.daysSinceOriginal} days ago</span>
                          <span>Originally: {formatRelativeTime(resurface.originalDate)}</span>
                          {resurface.relatedProductIds.map((pid) => {
                            const PIcon = productIcons[pid] || Globe;
                            return <PIcon key={pid} className="h-3 w-3 text-muted-foreground/30" />;
                          })}
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedResurface(isExpanded ? null : resurface.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/[0.04] transition-colors"
                      >
                        {isExpanded ? <EyeOff className="h-3.5 w-3.5 text-muted-foreground/40" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground/40" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border/10 animate-fade-in">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Full Context</p>
                        <p className="text-xs text-foreground/70 leading-relaxed">{resurface.context}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* CONTINUITY REMINDERS VIEW */}
      {view === "reminders" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Operational Continuity Reminders</h2>
            <p className="text-xs text-muted-foreground/40">Items requiring attention to maintain operational continuity and strategic momentum</p>
          </div>

          {reminders.length === 0 ? (
            <div className="aegis-card rounded-xl p-8 text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-success/40" />
              <p className="mt-3 text-sm text-muted-foreground/60">All continuity items resolved.</p>
            </div>
          ) : (
            reminders.map((reminder) => {
              const categoryIcons: Record<string, React.ElementType> = {
                project: Bookmark, relationship: Users, decision: Lightbulb,
                workflow: Activity, strategic: Target,
              };
              const CatIcon = categoryIcons[reminder.category] || Clock;

              return (
                <div key={reminder.id} className="aegis-card rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]">
                      <CatIcon className="h-4 w-4 text-amber-400/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground/90">{reminder.title}</h3>
                        <span className={cn("rounded px-1.5 py-0.5 text-[9px]", importanceColor[reminder.priority])}>{reminder.priority}</span>
                        <span className="rounded px-1.5 py-0.5 text-[9px] bg-white/[0.03] text-muted-foreground/40">{reminder.category}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground/60 leading-relaxed">{reminder.description}</p>

                      {/* Suggested Action */}
                      <div className="mt-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10 px-3 py-2">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400/50 mb-1">Suggested Action</p>
                        <p className="text-xs text-foreground/70">{reminder.suggestedAction}</p>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[9px] text-muted-foreground/30">
                        <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {reminder.daysSinceActivity} days since activity</span>
                        <span>Last: {formatRelativeTime(reminder.lastActivityDate)}</span>
                        {reminder.linkedProductIds.map((pid) => {
                          const PIcon = productIcons[pid] || Globe;
                          return <PIcon key={pid} className="h-3 w-3 text-muted-foreground/30" />;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* DECISION LOG VIEW */}
      {view === "decisions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground/90">Founder Decision Log</h2>
              <p className="text-xs text-muted-foreground/40">Complete record of strategic decisions, rationale, context, and outcomes</p>
            </div>
            {pendingDecisions.length > 0 && (
              <div className="aegis-badge bg-amber-500/10 text-amber-400">
                <Lightbulb className="h-3 w-3" />
                {pendingDecisions.length} pending review
              </div>
            )}
          </div>

          {/* Pending decisions first */}
          {pendingDecisions.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-warning/50">Pending Review</p>
              {pendingDecisions.map((dec) => renderDecisionCard(dec, expandedDecision, setExpandedDecision))}
            </div>
          )}

          {/* All decisions */}
          <div className="space-y-2">
            {pendingDecisions.length > 0 && (
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mt-4">All Decisions</p>
            )}
            {decisions.filter((d) => d.status !== "pending-review").map((dec) => renderDecisionCard(dec, expandedDecision, setExpandedDecision))}
          </div>
        </div>
      )}

      {/* EXECUTIVE CONTINUITY SUMMARY VIEW */}
      {view === "continuity" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Executive Continuity Summaries</h2>
            <p className="text-xs text-muted-foreground/40">AI-generated strategic continuity narratives with decision tracking and ecosystem context</p>
          </div>

          {summaries.map((summary) => (
            <div key={summary.id} className="aegis-card rounded-xl p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground/90">{summary.title}</h3>
                  <p className="text-[10px] text-muted-foreground/40 mt-1">
                    {new Date(summary.timeRange.start).toLocaleDateString()} — {new Date(summary.timeRange.end).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-electric/40" />
                  <span className="text-[9px] font-mono text-electric/50">{Math.round(summary.confidence * 100)}% confidence</span>
                </div>
              </div>

              {/* Narrative */}
              <div>
                <p className="text-xs text-foreground/70 leading-relaxed whitespace-pre-wrap">{summary.narrative}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Key Decisions */}
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-success/50 mb-2">Key Decisions</p>
                  <div className="space-y-1.5">
                    {summary.keyDecisions.map((d, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 text-success/40" />
                        <span className="text-[11px] text-foreground/60">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unresolved */}
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-warning/50 mb-2">Unresolved</p>
                  <div className="space-y-1.5">
                    {summary.unresolvedItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0 text-warning/40" />
                        <span className="text-[11px] text-foreground/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategic Shifts */}
                {summary.strategicShifts.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-electric/50 mb-2">Strategic Shifts</p>
                    <div className="space-y-1.5">
                      {summary.strategicShifts.map((shift, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <TrendingUp className="h-3 w-3 mt-0.5 shrink-0 text-electric/40" />
                          <span className="text-[11px] text-foreground/60">{shift}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relationship Changes */}
                {summary.relationshipChanges.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-purple-400/50 mb-2">Relationship Changes</p>
                    <div className="space-y-1.5">
                      {summary.relationshipChanges.map((change, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Users className="h-3 w-3 mt-0.5 shrink-0 text-purple-400/40" />
                          <span className="text-[11px] text-foreground/60">{change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Ecosystem Updates */}
              {summary.ecosystemUpdates.length > 0 && (
                <div className="pt-3 border-t border-border/10">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/50 mb-2">Ecosystem Updates</p>
                  <div className="flex flex-wrap gap-2">
                    {summary.ecosystemUpdates.map((update, i) => (
                      <span key={i} className="rounded-lg bg-white/[0.02] px-2.5 py-1 text-[10px] text-foreground/50">{update}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function renderDecisionCard(
  dec: FounderDecisionLog,
  expandedId: string | null,
  setExpanded: (id: string | null) => void,
) {
  const isExpanded = expandedId === dec.id;
  const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "text-success bg-success/10" },
    "pending-review": { label: "Pending Review", color: "text-warning bg-warning/10" },
    superseded: { label: "Superseded", color: "text-muted-foreground bg-white/[0.04]" },
    reversed: { label: "Reversed", color: "text-destructive bg-destructive/10" },
  };
  const status = statusConfig[dec.status] || statusConfig.active;

  return (
    <div key={dec.id} className="aegis-card rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(isExpanded ? null : dec.id)}
        className="flex w-full items-start gap-3 p-5 text-left hover:bg-white/[0.005] transition-colors"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/[0.06] ring-1 ring-amber-500/10">
          <Lightbulb className="h-4 w-4 text-amber-400/70" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground/90">{dec.title}</h3>
            <span className={cn("rounded px-1.5 py-0.5 text-[9px]", status.color)}>{status.label}</span>
            <span className={cn("rounded px-1.5 py-0.5 text-[9px]", importanceColor[dec.impact])}>{dec.impact}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground/50">{dec.decision}</p>
          <div className="mt-1.5 flex items-center gap-2 text-[9px] text-muted-foreground/30">
            <span>{formatRelativeTime(dec.madeAt)}</span>
            <span>&bull;</span>
            <span>{dec.linkedPeople.join(", ")}</span>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30 mt-1" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30 mt-1" />}
      </button>

      {isExpanded && (
        <div className="border-t border-border/10 px-5 py-4 space-y-4 animate-fade-in">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-1">Rationale</p>
            <p className="text-xs text-foreground/70 leading-relaxed">{dec.rationale}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-1">Context</p>
            <p className="text-xs text-foreground/70 leading-relaxed">{dec.context}</p>
          </div>
          {dec.outcome && (
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-success/50 mb-1">Outcome</p>
              <p className="text-xs text-foreground/70 leading-relaxed">{dec.outcome}</p>
            </div>
          )}
          {dec.reviewDate && (
            <div className="flex items-center gap-1.5 text-[9px] text-warning/50">
              <Calendar className="h-3 w-3" />
              Review scheduled: {new Date(dec.reviewDate).toLocaleDateString()}
            </div>
          )}
          <div className="flex items-center gap-2">
            {dec.linkedProductIds.map((pid) => {
              const PIcon = productIcons[pid] || Globe;
              return <PIcon key={pid} className="h-3 w-3 text-muted-foreground/30" />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
