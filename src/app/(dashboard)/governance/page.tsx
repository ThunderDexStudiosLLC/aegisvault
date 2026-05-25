"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck, Eye, Lock, Unlock, Archive, Trash2, Clock,
  AlertTriangle, Bot, Users, Activity, Sparkles, ChevronDown,
  ChevronUp, Shield, FileText, Globe, Key, RefreshCw,
  Ban, BookOpen, Layers, CheckCircle, XCircle,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useGovernance } from "@/contexts/GovernanceContext";
import { useOrb } from "@/contexts/OrbContext";
import type { MemoryClassification } from "@/types";

const classConfig: Record<MemoryClassification, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  public: { label: "Public", color: "text-success", bg: "bg-success/10", icon: Globe },
  internal: { label: "Internal", color: "text-electric", bg: "bg-electric/10", icon: BookOpen },
  confidential: { label: "Confidential", color: "text-purple-400", bg: "bg-purple-400/10", icon: Eye },
  restricted: { label: "Restricted", color: "text-warning", bg: "bg-warning/10", icon: Shield },
  "founder-only": { label: "Founder Only", color: "text-amber-400", bg: "bg-amber-400/10", icon: Lock },
  "legal-sensitive": { label: "Legal Sensitive", color: "text-destructive", bg: "bg-destructive/10", icon: FileText },
  "infrastructure-sensitive": { label: "Infra Sensitive", color: "text-cyan-400", bg: "bg-cyan-400/10", icon: Key },
};

const aiAccessLabels: Record<string, { label: string; color: string }> = {
  full: { label: "Full Access", color: "text-success" },
  "summary-only": { label: "Summary Only", color: "text-warning" },
  "metadata-only": { label: "Metadata Only", color: "text-electric" },
  denied: { label: "Denied", color: "text-destructive" },
};

const actionIcons: Record<string, React.ElementType> = {
  access: Eye, "ai-recall": Bot, "classification-change": Layers,
  redaction: Ban, lock: Lock, unlock: Unlock, archive: Archive,
  delete: Trash2, export: FileText, share: Users,
};

type ViewMode = "dashboard" | "permissions" | "timeline" | "retention" | "founder";

export default function GovernancePage() {
  const engine = useGovernance();
  const { setState } = useOrb();
  const [view, setView] = useState<ViewMode>("dashboard");
  const [expandedMemory, setExpandedMemory] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<MemoryClassification | "all">("all");

  const stats = useMemo(() => engine.getStats(), [engine]);
  const memories = useMemo(() => engine.getMemories(), [engine]);
  const rules = useMemo(() => engine.getAccessRules(), [engine]);
  const policies = useMemo(() => engine.getRetentionPolicies(), [engine]);
  const auditLog = useMemo(() => engine.getAuditLog(), [engine]);
  const zones = useMemo(() => engine.getZones(), [engine]);

  useEffect(() => {
    setState("indexing");
    const timer = setTimeout(() => setState("idle"), 3000);
    return () => clearTimeout(timer);
  }, [setState]);

  const filteredMemories = classFilter === "all" ? memories : memories.filter((m) => m.classification === classFilter);

  return (
    <div className="aegis-page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 ring-1 ring-violet-500/20">
            <ShieldCheck className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Memory Governance</h1>
            <p className="text-sm text-muted-foreground/60">Secure AI memory classification, compartmentalization, and access governance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="aegis-badge bg-violet-500/10 text-violet-400">
            <ShieldCheck className="h-3 w-3" />
            Compliance: {stats.complianceScore}%
          </div>
          <div className="aegis-badge bg-amber-500/10 text-amber-400">
            <Lock className="h-3 w-3" />
            {stats.lockedMemories} locked
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-7 gap-2">
        {(Object.entries(stats.classificationBreakdown) as [MemoryClassification, number][]).map(([cls, count]) => {
          const cfg = classConfig[cls];
          const Icon = cfg.icon;
          return (
            <button key={cls} onClick={() => { setView("dashboard"); setClassFilter(cls); }} className="aegis-card p-2.5 text-center hover:bg-white/[0.02] transition-colors">
              <Icon className={cn("h-3.5 w-3.5 mx-auto", cfg.color)} />
              <p className="mt-1 text-lg font-bold text-foreground">{count}</p>
              <p className="text-[8px] font-mono uppercase tracking-wider text-muted-foreground/40">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: "Total Memories", value: stats.totalMemories, icon: BookOpen, color: "text-electric" },
          { label: "Locked", value: stats.lockedMemories, icon: Lock, color: "text-amber-400" },
          { label: "AI Accesses", value: stats.aiAccessEvents, icon: Bot, color: "text-purple-400" },
          { label: "Human Accesses", value: stats.humanAccessEvents, icon: Users, color: "text-electric-glow" },
          { label: "Protection Zones", value: stats.founderZones, icon: Shield, color: "text-warning" },
          { label: "Retention Policies", value: stats.retentionPolicies, icon: Clock, color: "text-success" },
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
          { key: "dashboard" as ViewMode, label: "Governed Memories", icon: BookOpen },
          { key: "permissions" as ViewMode, label: "Access Rules", icon: ShieldCheck },
          { key: "timeline" as ViewMode, label: "Audit Timeline", icon: Activity },
          { key: "retention" as ViewMode, label: "Retention Policies", icon: Clock },
          { key: "founder" as ViewMode, label: "Founder Protection", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all",
                view === tab.key
                  ? "bg-violet-500/10 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.08)]"
                  : "text-muted-foreground/50 hover:text-foreground/70"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ============ GOVERNED MEMORIES (DASHBOARD) ============ */}
      {view === "dashboard" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground/90">Memory Classification & Sensitivity</h2>
              <p className="text-xs text-muted-foreground/40">All governed memories with classification, access tracking, and lock status</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-white/[0.02] p-0.5">
              <button onClick={() => setClassFilter("all")} className={cn("rounded px-2 py-1 text-[10px] transition-all", classFilter === "all" ? "bg-violet-500/10 text-violet-400" : "text-muted-foreground/40")}>All</button>
              {(Object.keys(classConfig) as MemoryClassification[]).map((cls) => (
                <button key={cls} onClick={() => setClassFilter(cls)} className={cn("rounded px-2 py-1 text-[10px] transition-all", classFilter === cls ? classConfig[cls].bg + " " + classConfig[cls].color : "text-muted-foreground/40")}>
                  {classConfig[cls].label}
                </button>
              ))}
            </div>
          </div>

          {filteredMemories.map((mem) => {
            const cfg = classConfig[mem.classification];
            const ClsIcon = cfg.icon;
            const isExpanded = expandedMemory === mem.id;
            return (
              <div key={mem.id} className={cn("aegis-card rounded-xl overflow-hidden", mem.locked && "ring-1 ring-amber-500/15")}>
                <button onClick={() => setExpandedMemory(isExpanded ? null : mem.id)} className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/[0.005] transition-colors">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/[0.06]", cfg.bg)}>
                    <ClsIcon className={cn("h-4 w-4", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground/90 truncate">{mem.title}</span>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px] shrink-0", cfg.bg, cfg.color)}>{cfg.label}</span>
                      {mem.locked && <Lock className="h-3 w-3 text-amber-400/50 shrink-0" />}
                      {mem.redacted && <Ban className="h-3 w-3 text-destructive/50 shrink-0" />}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground/50 truncate">{mem.summary}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-foreground/70">{mem.accessCount}</p>
                      <p className="text-[9px] text-muted-foreground/30">human</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-purple-400/70">{mem.aiAccessCount}</p>
                      <p className="text-[9px] text-muted-foreground/30">AI</p>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border/10 px-5 py-4 space-y-3 animate-fade-in">
                    <p className="text-xs text-foreground/70 leading-relaxed">{mem.summary}</p>
                    <div className="grid grid-cols-4 gap-3">
                      <div><p className="text-[10px] text-muted-foreground/40">Owner</p><p className="text-xs text-foreground/70">{mem.owner}</p></div>
                      <div><p className="text-[10px] text-muted-foreground/40">Zone</p><p className="text-xs text-foreground/70">{mem.zone}</p></div>
                      <div><p className="text-[10px] text-muted-foreground/40">Created</p><p className="text-xs text-foreground/70">{new Date(mem.createdAt).toLocaleDateString()}</p></div>
                      <div><p className="text-[10px] text-muted-foreground/40">Last Accessed</p><p className="text-xs text-foreground/70">{mem.lastAccessed ? formatRelativeTime(mem.lastAccessed) : "Never"}</p></div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {mem.tags.map((t) => <span key={t} className="rounded bg-white/[0.03] px-2 py-0.5 text-[9px] text-muted-foreground/40">{t}</span>)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ============ ACCESS RULES (PERMISSIONS CENTER) ============ */}
      {view === "permissions" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Memory Permissions Center</h2>
            <p className="text-xs text-muted-foreground/40">Access rules, AI role restrictions, contextual access conditions, and recall limitations</p>
          </div>

          {rules.map((rule) => {
            const cfg = classConfig[rule.classification];
            const ClsIcon = cfg.icon;
            const aiCfg = aiAccessLabels[rule.aiAccess];
            return (
              <div key={rule.id} className="aegis-card rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/[0.06]", cfg.bg)}>
                    <ClsIcon className={cn("h-5 w-5", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground/90">{rule.name}</h3>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]", cfg.bg, cfg.color)}>{cfg.label}</span>
                      {rule.active ? <CheckCircle className="h-3 w-3 text-success/50" /> : <XCircle className="h-3 w-3 text-destructive/50" />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground/50">{rule.description}</p>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {/* Allowed Roles */}
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-1.5">Allowed Roles</p>
                        <div className="flex flex-wrap gap-1">
                          {rule.allowedRoles.map((r) => (
                            <span key={r} className="rounded bg-white/[0.03] px-2 py-0.5 text-[9px] text-foreground/50">{r}</span>
                          ))}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground/40">AI Access</span>
                          <span className={cn("text-[10px] font-semibold", aiCfg.color)}>{aiCfg.label}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground/40">MFA Required</span>
                          <span className={cn("text-[10px]", rule.requiresMfa ? "text-success" : "text-muted-foreground/30")}>{rule.requiresMfa ? "Yes" : "No"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground/40">Audit Required</span>
                          <span className={cn("text-[10px]", rule.auditRequired ? "text-success" : "text-muted-foreground/30")}>{rule.auditRequired ? "Yes" : "No"}</span>
                        </div>
                        {rule.recallLimit && (
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground/40">Recall Limit</span>
                            <span className="text-[10px] text-warning">{rule.recallLimit}/day</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {rule.contextualConditions && (
                      <div className="mt-3 rounded-lg bg-white/[0.02] border border-border/10 px-3 py-2">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-1">Contextual Condition</p>
                        <p className="text-xs text-foreground/60">{rule.contextualConditions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============ AUDIT TIMELINE ============ */}
      {view === "timeline" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Memory Audit Timeline</h2>
            <p className="text-xs text-muted-foreground/40">Complete audit trail of memory access, AI recalls, classification changes, and governance actions</p>
          </div>

          <div className="space-y-2">
            {auditLog.map((entry) => {
              const cfg = classConfig[entry.classification];
              const ActionIcon = actionIcons[entry.action] || Activity;
              const isAi = entry.performedByType === "ai-agent";
              const isSystem = entry.performedByType === "system";
              return (
                <div key={entry.id} className="aegis-card rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      isAi ? "bg-purple-400/10" : isSystem ? "bg-cyan-400/10" : "bg-electric/10"
                    )}>
                      <ActionIcon className={cn("h-4 w-4", isAi ? "text-purple-400" : isSystem ? "text-cyan-400" : "text-electric")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground/90">{entry.performedBy}</span>
                        <span className={cn("rounded px-1.5 py-0.5 text-[9px]",
                          isAi ? "bg-purple-400/10 text-purple-400" : isSystem ? "bg-cyan-400/10 text-cyan-400" : "bg-electric/10 text-electric"
                        )}>{entry.action.replace(/-/g, " ")}</span>
                        <span className={cn("rounded px-1.5 py-0.5 text-[9px]", cfg.bg, cfg.color)}>{cfg.label}</span>
                        {!entry.approved && <AlertTriangle className="h-3 w-3 text-destructive/50" />}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground/50">
                        <span className="text-foreground/60">{entry.memoryTitle}</span> &mdash; {entry.details}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-[9px] text-muted-foreground/30">
                        {entry.ipAddress && <span className="font-mono">{entry.ipAddress}</span>}
                        <span>{formatRelativeTime(entry.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ RETENTION POLICIES ============ */}
      {view === "retention" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Retention Policies</h2>
            <p className="text-xs text-muted-foreground/40">Automatic expiration, archival rules, deletion schedules, legal hold, and operational continuity retention</p>
          </div>

          {policies.map((policy) => {
            const cfg = classConfig[policy.classification];
            const ClsIcon = cfg.icon;
            return (
              <div key={policy.id} className={cn("aegis-card rounded-xl p-5", policy.legalHold && "ring-1 ring-destructive/15")}>
                <div className="flex items-start gap-4">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/[0.06]", cfg.bg)}>
                    <ClsIcon className={cn("h-5 w-5", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground/90">{policy.name}</h3>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]", cfg.bg, cfg.color)}>{cfg.label}</span>
                      {policy.legalHold && <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[9px] text-destructive">Legal Hold</span>}
                      {policy.continuityExempt && <span className="rounded bg-success/10 px-1.5 py-0.5 text-[9px] text-success">Continuity Exempt</span>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground/50">{policy.description}</p>

                    <div className="mt-3 grid grid-cols-5 gap-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground/40">Retention</p>
                        <p className="text-xs text-foreground/70">{policy.retentionDays ? `${policy.retentionDays} days` : "Indefinite"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/40">Auto Archive</p>
                        <p className={cn("text-xs", policy.autoArchive ? "text-success" : "text-muted-foreground/30")}>{policy.autoArchive ? `After ${policy.archiveAfterDays}d` : "No"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/40">Auto Delete</p>
                        <p className={cn("text-xs", policy.autoDelete ? "text-warning" : "text-muted-foreground/30")}>{policy.autoDelete ? `After ${policy.deleteAfterDays}d` : "No"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/40">Legal Hold</p>
                        <p className={cn("text-xs", policy.legalHold ? "text-destructive" : "text-muted-foreground/30")}>{policy.legalHold ? "Active" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/40">Status</p>
                        <p className={cn("text-xs", policy.active ? "text-success" : "text-muted-foreground/30")}>{policy.active ? "Active" : "Inactive"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============ FOUNDER PROTECTION ============ */}
      {view === "founder" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Founder Protection Layer</h2>
            <p className="text-xs text-muted-foreground/40">Private memory zones, restricted operational areas, executive compartmentalization, and emergency lock controls</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Lock Sensitive Workspace", icon: Lock, color: "text-amber-400", desc: "Immediately lock all founder-only and restricted memory zones" },
              { label: "Audit AI Memory Access", icon: Bot, color: "text-purple-400", desc: "Generate comprehensive AI memory access audit report" },
              { label: "Generate Governance Report", icon: Sparkles, color: "text-violet-400", desc: "Create compliance and governance summary report" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.label} className="aegis-card rounded-xl p-4 text-left hover:bg-white/[0.02] transition-colors group">
                  <Icon className={cn("h-5 w-5 mb-2", action.color)} />
                  <p className="text-sm font-semibold text-foreground/90 group-hover:text-foreground">{action.label}</p>
                  <p className="text-[10px] text-muted-foreground/40">{action.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Protection Zones */}
          {zones.map((zone) => {
            const cfg = classConfig[zone.classification];
            const ClsIcon = cfg.icon;
            const aiCfg = aiAccessLabels[zone.aiAccessPolicy];
            return (
              <div key={zone.id} className={cn("aegis-card rounded-xl p-5", zone.locked && "ring-1 ring-amber-500/15")}>
                <div className="flex items-start gap-4">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/[0.06]", cfg.bg)}>
                    <ClsIcon className={cn("h-5 w-5", cfg.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground/90">{zone.name}</h3>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]", cfg.bg, cfg.color)}>{cfg.label}</span>
                      {zone.locked ? (
                        <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-[9px] text-amber-400 flex items-center gap-0.5"><Lock className="h-2.5 w-2.5" /> Locked</span>
                      ) : (
                        <span className="rounded bg-success/10 px-1.5 py-0.5 text-[9px] text-success flex items-center gap-0.5"><Unlock className="h-2.5 w-2.5" /> Unlocked</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground/50">{zone.description}</p>

                    <div className="mt-3 grid grid-cols-4 gap-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground/40">Memories</p>
                        <p className="text-xs text-foreground/70">{zone.memoryCount}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/40">AI Access</p>
                        <p className={cn("text-xs font-semibold", aiCfg.color)}>{aiCfg.label}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/40">Accessible By</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {zone.accessibleBy.map((p) => <span key={p} className="text-[9px] text-foreground/50">{p.split(" ")[0]}</span>)}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/40">Emergency Unlock</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {zone.emergencyUnlockContacts.length > 0 ? zone.emergencyUnlockContacts.map((c) => <span key={c} className="text-[9px] text-warning/50">{c.split(" ")[0]}</span>) : <span className="text-[9px] text-muted-foreground/30">None</span>}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-[9px] text-muted-foreground/30">
                      <span>Created: {new Date(zone.createdAt).toLocaleDateString()}</span>
                      <span>Modified: {formatRelativeTime(zone.lastModified)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
