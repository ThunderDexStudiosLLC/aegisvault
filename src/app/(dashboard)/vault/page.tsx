"use client";

import { useState } from "react";
import {
  FileText, Clock, FolderKanban, Users, Brain, Activity,
  Shield, TrendingUp, AlertTriangle, Lightbulb, ArrowRight,
  Calendar, Star, Zap,
} from "lucide-react";
import Link from "next/link";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  projects, memories, decisions, activityLogs,
  notifications, aiSummaries, meetings, relationships,
} from "@/data/demo";

const stats = [
  { label: "Vault Documents", value: "47", icon: FileText, trend: "+8 this week", color: "text-electric" },
  { label: "Active Projects", value: "6", icon: FolderKanban, trend: "2 critical", color: "text-warning" },
  { label: "Memory Entries", value: "128", icon: Clock, trend: "+12 this week", color: "text-electric-glow" },
  { label: "Relationships", value: "24", icon: Users, trend: "3 need follow-up", color: "text-success" },
];

export default function VaultDashboard() {
  const [activeTab, setActiveTab] = useState<"briefing" | "activity" | "alerts">("briefing");
  const executiveBriefing = aiSummaries.find((s) => s.type === "executive");
  const criticalDecisions = decisions.filter((d) => d.impact === "critical" || d.impact === "high");
  const activeProjects = projects.filter((p) => p.status === "active");
  const recentMemories = memories.slice(0, 5);
  const unreadNotifications = notifications.filter((n) => !n.read);
  const upcomingMeetings = meetings.slice(0, 3);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vault Dashboard</h1>
          <p className="text-sm text-muted-foreground">Operational intelligence overview &mdash; IronReserve Holdings</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-electric-dim/30 bg-electric/5 px-4 py-2">
          <Shield className="h-4 w-4 text-electric" />
          <span className="text-xs font-medium text-electric-glow">Classification: CONFIDENTIAL</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <Icon className={cn("h-5 w-5", stat.color)} />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.trend}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="col-span-2 space-y-6">
          {/* AI Briefing / Activity / Alerts Tabs */}
          <div className="glass rounded-xl">
            <div className="flex border-b border-border">
              {[
                { key: "briefing" as const, label: "AI Briefing", icon: Brain },
                { key: "activity" as const, label: "Recent Activity", icon: Activity },
                { key: "alerts" as const, label: "Alerts", icon: AlertTriangle },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors",
                    activeTab === tab.key
                      ? "border-electric text-electric-glow"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.key === "alerts" && unreadNotifications.length > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-electric text-[10px] text-white">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === "briefing" && executiveBriefing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{executiveBriefing.title}</h3>
                    <span className="rounded bg-electric/10 px-2 py-0.5 text-[10px] text-electric-glow">
                      {executiveBriefing.sourceCount} sources &bull; {Math.round(executiveBriefing.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap text-sm text-muted-foreground">
                    {executiveBriefing.content}
                  </div>
                  <Link href="/vault/summaries" className="inline-flex items-center gap-1 text-xs text-electric hover:text-electric-glow">
                    View all AI summaries <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-3">
                  {activityLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-secondary/50">
                      <Activity className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          <span className="text-electric-glow">{log.user}</span>{" "}
                          <span className="text-muted-foreground">{log.action}</span>{" "}
                          {log.entity}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(log.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                  <Link href="/activity" className="inline-flex items-center gap-1 text-xs text-electric hover:text-electric-glow">
                    View full activity log <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              {activeTab === "alerts" && (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "flex items-start gap-3 rounded-lg p-3",
                        !notif.read ? "bg-electric/5 border border-electric-dim/20" : "hover:bg-secondary/50"
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                        notif.type === "alert" ? "bg-destructive" :
                        notif.type === "warning" ? "bg-warning" :
                        notif.type === "success" ? "bg-success" : "bg-electric"
                      )} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.message}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">{formatRelativeTime(notif.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Projects */}
          <div className="glass rounded-xl p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Active Projects</h3>
              <Link href="/projects" className="text-xs text-electric hover:text-electric-glow">View all</Link>
            </div>
            <div className="space-y-3">
              {activeProjects.map((project) => (
                <Link key={project.id} href="/projects" className="block rounded-lg border border-border p-3 transition-colors hover:border-electric-dim/30 hover:bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4 text-electric" />
                      <span className="text-sm font-medium text-foreground">{project.name}</span>
                      {project.priority === "critical" && (
                        <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">CRITICAL</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className="h-1.5 rounded-full bg-electric transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
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
          <div className="glass rounded-xl p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Lightbulb className="h-4 w-4 text-warning" />
                Critical Decisions
              </h3>
              <Link href="/decisions" className="text-xs text-electric hover:text-electric-glow">View all</Link>
            </div>
            <div className="space-y-3">
              {criticalDecisions.slice(0, 4).map((dec) => (
                <div key={dec.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium text-foreground">{dec.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn(
                      "rounded px-1.5 py-0.5 text-[10px]",
                      dec.status === "implemented" ? "bg-success/10 text-success" :
                      dec.status === "approved" ? "bg-electric/10 text-electric-glow" :
                      "bg-warning/10 text-warning"
                    )}>
                      {dec.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{formatRelativeTime(dec.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="glass rounded-xl p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Calendar className="h-4 w-4 text-electric" />
                Meeting Intelligence
              </h3>
              <Link href="/meetings" className="text-xs text-electric hover:text-electric-glow">View all</Link>
            </div>
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium text-foreground">{meeting.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{meeting.attendees.length} attendees &bull; {meeting.duration}min</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{formatRelativeTime(meeting.date)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Memory Timeline Preview */}
          <div className="glass rounded-xl p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="h-4 w-4 text-electric-glow" />
                Memory Timeline
              </h3>
              <Link href="/timeline" className="text-xs text-electric hover:text-electric-glow">View all</Link>
            </div>
            <div className="space-y-3">
              {recentMemories.map((memory) => (
                <div key={memory.id} className="flex items-start gap-3">
                  <div className="mt-1 flex flex-col items-center">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      memory.importance === "critical" ? "bg-destructive" :
                      memory.importance === "high" ? "bg-warning" :
                      "bg-electric"
                    )} />
                    <div className="mt-1 h-8 w-px bg-border" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{memory.title}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{memory.type}</span>
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(memory.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relationship Alerts */}
          <div className="glass rounded-xl p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Star className="h-4 w-4 text-warning" />
                Key Relationships
              </h3>
              <Link href="/relationships" className="text-xs text-electric hover:text-electric-glow">View all</Link>
            </div>
            <div className="space-y-3">
              {relationships.filter((r) => r.strategicImportance === "critical").slice(0, 4).map((rel) => (
                <div key={rel.id} className="flex items-center gap-3 rounded-lg border border-border p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric/10 text-electric">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">{rel.name}</p>
                    <p className="text-[10px] text-muted-foreground">{rel.role} &bull; {rel.company}</p>
                  </div>
                  <Zap className="h-3 w-3 text-warning" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
