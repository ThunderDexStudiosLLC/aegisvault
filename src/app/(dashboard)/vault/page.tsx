"use client";

import { useState, useEffect } from "react";
import {
  FileText, Clock, FolderKanban, Users, Brain, Activity,
  Shield, TrendingUp, AlertTriangle, Lightbulb, ArrowRight,
  Calendar, Star, Zap, Radio, Cpu, GitBranch, Sparkles, Crown,
  Fingerprint, Key, Lock, ShieldCheck, Bot, BookOpen,
  Server, CheckCircle, RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  projects, memories, decisions, activityLogs,
  notifications, aiSummaries, meetings, relationships,
} from "@/data/demo";
import { useOrb } from "@/contexts/OrbContext";
import { useMemory } from "@/contexts/MemoryContext";
import { useEcosystem } from "@/contexts/EcosystemContext";
import { useFounder } from "@/contexts/FounderContext";
import { useIdentity } from "@/contexts/IdentityContext";
import { useGovernance } from "@/contexts/GovernanceContext";
import { useContinuity } from "@/contexts/ContinuityContext";

const stats = [
  { label: "Vault Documents", value: "47", icon: FileText, trend: "+8 this week", color: "text-electric" },
  { label: "Active Projects", value: "6", icon: FolderKanban, trend: "2 critical", color: "text-warning" },
  { label: "Memory Entries", value: "128", icon: Clock, trend: "+12 this week", color: "text-electric-glow" },
  { label: "Relationships", value: "24", icon: Users, trend: "3 need follow-up", color: "text-success" },
];

export default function VaultDashboard() {
  const [activeTab, setActiveTab] = useState<"briefing" | "activity" | "alerts">("briefing");
  const { setState } = useOrb();
  const memoryEngine = useMemory();
  const ecosystem = useEcosystem();
  const founder = useFounder();
  const identity = useIdentity();
  const governance = useGovernance();
  const continuity = useContinuity();
  const memoryStats = memoryEngine.getStats();
  const ecoHealth = ecosystem.getEcosystemHealth();
  const ecoProducts = ecosystem.getAllProducts();
  const pinnedMemories = memoryEngine.getPinnedMemories().slice(0, 3);
  const executiveBriefing = aiSummaries.find((s) => s.type === "executive");
  const criticalDecisions = decisions.filter((d) => d.impact === "critical" || d.impact === "high");
  const activeProjects = projects.filter((p) => p.status === "active");
  const recentMemories = memories.slice(0, 5);
  const unreadNotifications = notifications.filter((n) => !n.read);
  const upcomingMeetings = meetings.slice(0, 3);

  useEffect(() => {
    setState("executive-briefing");
    const timer = setTimeout(() => setState("idle"), 4000);
    return () => clearTimeout(timer);
  }, [setState]);

  return (
    <div className="aegis-page-enter space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Vault Dashboard</h1>
          <p className="text-sm text-muted-foreground/70">Operational intelligence overview &mdash; IronReserve Holdings</p>
        </div>
        <div className="aegis-badge aegis-badge-electric">
          <Shield className="h-3 w-3" />
          Classification: CONFIDENTIAL
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="aegis-card p-4 holo-shimmer" style={{ animationDelay: `${i * 2}s` }}>
              <div className="flex items-center justify-between">
                <Icon className={cn("h-5 w-5", stat.color)} />
                <span className="text-[9px] font-mono uppercase tracking-[0.1em] text-muted-foreground/60">{stat.label}</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground/60">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="col-span-2 space-y-6">
          {/* AI Briefing / Activity / Alerts Tabs */}
          <div className="aegis-card">
            <div className="flex border-b border-border/50">
              {[
                { key: "briefing" as const, label: "AI Briefing", icon: Brain },
                { key: "activity" as const, label: "Recent Activity", icon: Activity },
                { key: "alerts" as const, label: "Alerts", icon: AlertTriangle },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-all duration-300",
                    activeTab === tab.key
                      ? "border-electric text-electric-glow"
                      : "border-transparent text-muted-foreground/60 hover:text-foreground/80"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.key === "alerts" && unreadNotifications.length > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-electric/80 text-[10px] text-white shadow-[0_0_6px_rgba(59,130,246,0.4)]">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === "briefing" && executiveBriefing && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{executiveBriefing.title}</h3>
                    <span className="aegis-badge aegis-badge-electric">
                      {executiveBriefing.sourceCount} sources &bull; {Math.round(executiveBriefing.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap text-sm text-muted-foreground/80">
                    {executiveBriefing.content}
                  </div>
                  <Link href="/vault/summaries" className="inline-flex items-center gap-1 text-xs text-electric/80 hover:text-electric-glow transition-colors">
                    View all AI summaries <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-2 animate-fade-in">
                  {activityLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-white/[0.02] transition-colors">
                      <Activity className="mt-0.5 h-4 w-4 shrink-0 text-electric/60" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground/90">
                          <span className="text-electric-glow/80">{log.user}</span>{" "}
                          <span className="text-muted-foreground/60">{log.action}</span>{" "}
                          {log.entity}
                        </p>
                        <p className="text-xs text-muted-foreground/40">{formatRelativeTime(log.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                  <Link href="/activity" className="inline-flex items-center gap-1 text-xs text-electric/80 hover:text-electric-glow transition-colors">
                    View full activity log <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              {activeTab === "alerts" && (
                <div className="space-y-2 animate-fade-in">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "flex items-start gap-3 rounded-lg p-3 transition-colors",
                        !notif.read ? "bg-electric/[0.03] border border-electric/10" : "hover:bg-white/[0.02]"
                      )}
                    >
                      <div className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        notif.type === "alert" ? "bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.4)]" :
                        notif.type === "warning" ? "bg-warning shadow-[0_0_6px_rgba(245,158,11,0.4)]" :
                        notif.type === "success" ? "bg-success shadow-[0_0_6px_rgba(34,197,94,0.4)]" :
                        "bg-electric shadow-[0_0_6px_rgba(59,130,246,0.4)]"
                      )} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground/90">{notif.title}</p>
                        <p className="text-xs text-muted-foreground/60">{notif.message}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground/40">{formatRelativeTime(notif.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Projects */}
          <div className="aegis-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Radio className="h-3.5 w-3.5 text-electric/60" />
                Active Projects
              </h3>
              <Link href="/projects" className="text-xs text-electric/60 hover:text-electric-glow transition-colors">View all</Link>
            </div>
            <div className="space-y-3">
              {activeProjects.map((project) => (
                <Link key={project.id} href="/projects" className="block rounded-lg border border-border/30 p-3 transition-all hover:border-electric/15 hover:bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4 text-electric/60" />
                      <span className="text-sm font-medium text-foreground/90">{project.name}</span>
                      {project.priority === "critical" && (
                        <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive shadow-[0_0_4px_rgba(239,68,68,0.2)]">CRITICAL</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground/50">{project.progress}%</span>
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-white/[0.03]">
                    <div
                      className="h-1 rounded-full bg-gradient-to-r from-electric/80 to-electric-glow/60 transition-all shadow-[0_0_6px_rgba(59,130,246,0.3)]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground/40">
                    <span>{project.noteCount} notes</span>
                    <span>{project.decisionCount} decisions</span>
                    <span>{project.team.length} members</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Critical Decisions */}
          <div className="aegis-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Lightbulb className="h-4 w-4 text-warning/80" />
                Critical Decisions
              </h3>
              <Link href="/decisions" className="text-xs text-electric/60 hover:text-electric-glow transition-colors">View all</Link>
            </div>
            <div className="space-y-3">
              {criticalDecisions.slice(0, 4).map((dec) => (
                <div key={dec.id} className="rounded-lg border border-border/20 p-3 hover:border-electric/10 transition-colors">
                  <p className="text-sm font-medium text-foreground/90">{dec.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn(
                      "rounded px-1.5 py-0.5 text-[10px]",
                      dec.status === "implemented" ? "bg-success/10 text-success/80" :
                      dec.status === "approved" ? "bg-electric/10 text-electric-glow/80" :
                      "bg-warning/10 text-warning/80"
                    )}>
                      {dec.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground/40">{formatRelativeTime(dec.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="aegis-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Calendar className="h-4 w-4 text-electric/70" />
                Meeting Intelligence
              </h3>
              <Link href="/meetings" className="text-xs text-electric/60 hover:text-electric-glow transition-colors">View all</Link>
            </div>
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="rounded-lg border border-border/20 p-3 hover:border-electric/10 transition-colors">
                  <p className="text-sm font-medium text-foreground/90">{meeting.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground/50">{meeting.attendees.length} attendees &bull; {meeting.duration}min</p>
                  <p className="mt-1 text-[10px] text-muted-foreground/40">{formatRelativeTime(meeting.date)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Memory Timeline Preview */}
          <div className="aegis-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="h-4 w-4 text-electric-glow/70" />
                Memory Timeline
              </h3>
              <Link href="/timeline" className="text-xs text-electric/60 hover:text-electric-glow transition-colors">View all</Link>
            </div>
            <div className="space-y-3">
              {recentMemories.map((memory) => (
                <div key={memory.id} className="flex items-start gap-3">
                  <div className="mt-1 flex flex-col items-center">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      memory.importance === "critical" ? "bg-destructive shadow-[0_0_4px_rgba(239,68,68,0.4)]" :
                      memory.importance === "high" ? "bg-warning shadow-[0_0_4px_rgba(245,158,11,0.4)]" :
                      "bg-electric shadow-[0_0_4px_rgba(59,130,246,0.3)]"
                    )} />
                    <div className="mt-1 h-8 w-px bg-border/30" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground/90">{memory.title}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-muted-foreground/50">{memory.type}</span>
                      <span className="text-[10px] text-muted-foreground/40">{formatRelativeTime(memory.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ecosystem Intelligence */}
          <div className="aegis-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <GitBranch className="h-4 w-4 text-electric/70" />
                Ecosystem Intel
              </h3>
              <Link href="/ecosystem" className="text-xs text-electric/60 hover:text-electric-glow transition-colors">Explore</Link>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                <p className="text-lg font-bold text-foreground">{ecoProducts.length}</p>
                <p className="text-[9px] font-mono text-muted-foreground/40">PRODUCTS</p>
              </div>
              <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                <p className="text-lg font-bold text-foreground">{ecoHealth.activeLinks}</p>
                <p className="text-[9px] font-mono text-muted-foreground/40">LINKS</p>
              </div>
              <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                <p className="text-lg font-bold text-success">{Math.round(ecoHealth.overall * 100)}%</p>
                <p className="text-[9px] font-mono text-muted-foreground/40">HEALTH</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {ecoProducts.slice(0, 5).map((product) => (
                <Link key={product.id} href="/ecosystem" className="flex items-center gap-2 rounded-lg p-2 hover:bg-white/[0.03] transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: product.color }} />
                  <span className="text-xs text-foreground/70 truncate flex-1">{product.shortName}</span>
                  <span className={cn("text-[9px]", product.status === "active" ? "text-success/50" : "text-muted-foreground/30")}>{product.status}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Founder Command */}
          <div className="aegis-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Crown className="h-4 w-4 text-amber-400/70" />
                Founder Command
              </h3>
              <Link href="/founder" className="text-xs text-amber-400/60 hover:text-amber-400 transition-colors">Open</Link>
            </div>
            {(() => {
              const fStats = founder.getFounderStats();
              const critical = founder.getCriticalItems();
              return (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className="text-lg font-bold text-warning">{fStats.unresolvedPriorities}</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">UNRESOLVED</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className="text-lg font-bold text-foreground">{fStats.activeResurfaces}</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">RESURFACES</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className="text-lg font-bold text-amber-400">{fStats.pendingDecisions}</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">PENDING</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {critical.resurfaces.slice(0, 3).map((r) => (
                      <Link key={r.id} href="/founder" className="flex items-center gap-2 rounded-lg p-2 hover:bg-white/[0.03] transition-colors">
                        <AlertTriangle className="h-3 w-3 text-warning/50 shrink-0" />
                        <span className="text-xs text-foreground/70 truncate flex-1">{r.title}</span>
                        <span className="text-[9px] text-muted-foreground/30">{r.daysSinceOriginal}d</span>
                      </Link>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Identity & Access */}
          <div className="aegis-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Fingerprint className="h-4 w-4 text-emerald-400/70" />
                Identity & Access
              </h3>
              <Link href="/identity" className="text-xs text-emerald-400/60 hover:text-emerald-400 transition-colors">Open</Link>
            </div>
            {(() => {
              const idStats = identity.getStats();
              const posture = identity.getSecurityPosture();
              return (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className="text-lg font-bold text-foreground">{idStats.activeIdentities}</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">IDENTITIES</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className="text-lg font-bold text-foreground">{idStats.totalCredentials}</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">CREDENTIALS</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className={cn("text-lg font-bold", posture.overallScore >= 80 ? "text-success" : "text-warning")}>{posture.overallScore}%</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">SECURITY</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {idStats.rotationsDue > 0 && (
                      <div className="flex items-center gap-2 rounded-lg p-2 bg-warning/[0.03]">
                        <Key className="h-3 w-3 text-warning/50 shrink-0" />
                        <span className="text-xs text-warning/70 flex-1">{idStats.rotationsDue} credential rotation{idStats.rotationsDue > 1 ? 's' : ''} due</span>
                      </div>
                    )}
                    {idStats.unresolvedEvents > 0 && (
                      <div className="flex items-center gap-2 rounded-lg p-2 bg-destructive/[0.03]">
                        <AlertTriangle className="h-3 w-3 text-destructive/50 shrink-0" />
                        <span className="text-xs text-destructive/70 flex-1">{idStats.unresolvedEvents} unresolved event{idStats.unresolvedEvents > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 rounded-lg p-2">
                      <Lock className="h-3 w-3 text-success/50 shrink-0" />
                      <span className="text-xs text-foreground/50 flex-1">{idStats.mfaEnabled}/{idStats.totalIdentities} MFA enabled</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Memory Engine Status */}
          <div className="aegis-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Cpu className="h-4 w-4 text-electric/70" />
                Memory Engine
              </h3>
              <Link href="/memory" className="text-xs text-electric/60 hover:text-electric-glow transition-colors">Open Engine</Link>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                <p className="text-lg font-bold text-foreground">{memoryStats.total}</p>
                <p className="text-[9px] font-mono text-muted-foreground/40">MEMORIES</p>
              </div>
              <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                <p className="text-lg font-bold text-foreground">{memoryStats.linkCount}</p>
                <p className="text-[9px] font-mono text-muted-foreground/40">LINKS</p>
              </div>
              <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                <p className="text-lg font-bold text-foreground">{memoryStats.clusterCount}</p>
                <p className="text-[9px] font-mono text-muted-foreground/40">CLUSTERS</p>
              </div>
            </div>
            <div className="space-y-2">
              {pinnedMemories.map((m) => (
                <Link key={m.id} href="/memory" className="flex items-center gap-2 rounded-lg p-2 hover:bg-white/[0.03] transition-colors">
                  <Sparkles className="h-3 w-3 text-warning/50 shrink-0" />
                  <span className="text-xs text-foreground/70 truncate flex-1">{m.title}</span>
                  <span className="text-[9px] font-mono text-electric/40">{Math.round(m.importance * 100)}%</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Memory Governance */}
          <div className="aegis-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-violet-400/70" />
                Memory Governance
              </h3>
              <Link href="/governance" className="text-xs text-violet-400/60 hover:text-violet-400 transition-colors">Open</Link>
            </div>
            {(() => {
              const gStats = governance.getStats();
              return (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className="text-lg font-bold text-foreground">{gStats.totalMemories}</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">GOVERNED</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className="text-lg font-bold text-amber-400">{gStats.lockedMemories}</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">LOCKED</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className={cn("text-lg font-bold", gStats.complianceScore >= 90 ? "text-success" : "text-warning")}>{gStats.complianceScore}%</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">COMPLIANCE</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 rounded-lg p-2">
                      <Bot className="h-3 w-3 text-purple-400/50 shrink-0" />
                      <span className="text-xs text-foreground/50 flex-1">{gStats.aiAccessEvents} AI memory accesses</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg p-2">
                      <BookOpen className="h-3 w-3 text-electric/50 shrink-0" />
                      <span className="text-xs text-foreground/50 flex-1">{gStats.founderZones} protection zones active</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Executive Continuity */}
          <div className="aegis-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Server className="h-4 w-4 text-orange-400/70" />
                Continuity
              </h3>
              <Link href="/continuity" className="text-xs text-orange-400/60 hover:text-orange-400 transition-colors">Open</Link>
            </div>
            {(() => {
              const cStats = continuity.getStats();
              return (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className="text-lg font-bold text-foreground">{cStats.totalAssets}</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">ASSETS</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className="text-lg font-bold text-success">{cStats.operationalAssets}</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">ONLINE</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.02] p-2 text-center">
                      <p className={cn("text-lg font-bold", cStats.overallReadiness >= 80 ? "text-success" : "text-warning")}>{cStats.overallReadiness}%</p>
                      <p className="text-[9px] font-mono text-muted-foreground/40">READY</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {cStats.activeIncidents > 0 && (
                      <div className="flex items-center gap-2 rounded-lg p-2 bg-destructive/[0.03]">
                        <AlertTriangle className="h-3 w-3 text-destructive/50 shrink-0" />
                        <span className="text-xs text-destructive/70 flex-1">{cStats.activeIncidents} active incident{cStats.activeIncidents > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {cStats.singlePointsOfFailure > 0 && (
                      <div className="flex items-center gap-2 rounded-lg p-2 bg-warning/[0.03]">
                        <AlertTriangle className="h-3 w-3 text-warning/50 shrink-0" />
                        <span className="text-xs text-warning/70 flex-1">{cStats.singlePointsOfFailure} single point{cStats.singlePointsOfFailure > 1 ? 's' : ''} of failure</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 rounded-lg p-2">
                      <RefreshCw className="h-3 w-3 text-cyan-400/50 shrink-0" />
                      <span className="text-xs text-foreground/50 flex-1">{cStats.testedProcedures}/{cStats.recoveryProcedures} procedures tested</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Relationship Alerts */}
          <div className="aegis-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Star className="h-4 w-4 text-warning/80" />
                Key Relationships
              </h3>
              <Link href="/relationships" className="text-xs text-electric/60 hover:text-electric-glow transition-colors">View all</Link>
            </div>
            <div className="space-y-3">
              {relationships.filter((r) => r.strategicImportance === "critical").slice(0, 4).map((rel) => (
                <div key={rel.id} className="flex items-center gap-3 rounded-lg border border-border/20 p-2 hover:border-electric/10 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric/[0.06] text-electric/70 ring-1 ring-electric/10">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground/90">{rel.name}</p>
                    <p className="text-[10px] text-muted-foreground/40">{rel.role} &bull; {rel.company}</p>
                  </div>
                  <Zap className="h-3 w-3 text-warning/60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
