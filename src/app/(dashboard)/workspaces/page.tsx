"use client";

import { useState, useEffect, useRef } from "react";
import {
  Shield, Users, Bot, Lock, Eye, Activity, AlertTriangle,
  CheckCircle, Clock, Globe, Crown, Fingerprint, ShieldCheck,
  Server, Radar, Layers, Settings, Search, Zap, RefreshCw,
  Download, FileText, MessageSquare, ThumbsUp, ArrowRight,
  Cpu, LayoutGrid, ChevronDown, ChevronUp, Radio,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useOrb } from "@/contexts/OrbContext";
import { useFeedback } from "@/components/global/OperationalFeedback";
import type { WorkspaceType, WorkspaceSecurityState } from "@/types";

type ViewMode = "dashboard" | "roles" | "agents" | "collaboration" | "graph";

const viewTabs: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Workspaces", icon: LayoutGrid },
  { id: "roles", label: "Roles & Permissions", icon: Fingerprint },
  { id: "agents", label: "AI Agent Security", icon: Bot },
  { id: "collaboration", label: "Collaboration", icon: MessageSquare },
  { id: "graph", label: "Workspace Graph", icon: Globe },
];

const typeConfig: Record<WorkspaceType, { label: string; color: string; icon: React.ElementType }> = {
  personal: { label: "Personal", color: "text-electric", icon: Users },
  executive: { label: "Executive", color: "text-cyan-400", icon: Crown },
  team: { label: "Team", color: "text-emerald-400", icon: Users },
  department: { label: "Department", color: "text-amber-400", icon: Layers },
  enterprise: { label: "Enterprise", color: "text-purple-400", icon: Globe },
  infrastructure: { label: "Infrastructure", color: "text-orange-400", icon: Server },
  restricted: { label: "Restricted", color: "text-destructive", icon: Lock },
  "founder-private": { label: "Founder Private", color: "text-electric", icon: Crown },
};

const stateConfig: Record<WorkspaceSecurityState, { label: string; color: string; bg: string }> = {
  secure: { label: "Secure", color: "text-success", bg: "bg-success/10" },
  monitoring: { label: "Monitoring", color: "text-amber-400", bg: "bg-amber-400/10" },
  "elevated-risk": { label: "Elevated Risk", color: "text-destructive", bg: "bg-destructive/10" },
  lockdown: { label: "Lockdown", color: "text-destructive", bg: "bg-destructive/10" },
  "executive-mode": { label: "Executive Mode", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  "governance-review": { label: "Governance Review", color: "text-violet-400", bg: "bg-violet-400/10" },
};

export default function WorkspacesPage() {
  const [view, setView] = useState<ViewMode>("dashboard");
  const [expandedWs, setExpandedWs] = useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [expandedCollab, setExpandedCollab] = useState<string | null>(null);
  const { setState } = useOrb();
  const ws = useWorkspace();
  const { show } = useFeedback();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const runWsAction = (label: string) => {
    setState("processing");
    show("processing", `${label}...`, "Workspace operation in progress");
    setTimeout(() => { show("success", `${label} completed`, "Governance log updated"); setState("synchronization"); }, 2000);
  };

  useEffect(() => { setState("synchronization"); return () => setState("idle"); }, [setState]);

  /* Graph rendering */
  useEffect(() => {
    if (view !== "graph") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 860; const H = 520;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const nodes = ws.graphNodes;
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    let t = 0;
    let animId = 0;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      t += 0.02;

      // edges
      nodes.forEach((node) => {
        node.connections.forEach((cid) => {
          const target = nodeMap.get(cid);
          if (!target) return;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = "rgba(59,130,246,0.08)";
          ctx.lineWidth = 1;
          ctx.stroke();
          // pulse particle
          const progress = ((t * 0.5 + node.x * 0.01) % 1);
          const px = node.x + (target.x - node.x) * progress;
          const py = node.y + (target.y - node.y) * progress;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(96,165,250,0.3)";
          ctx.fill();
        });
      });

      // nodes
      nodes.forEach((node) => {
        const colors: Record<string, string> = {
          workspace: "59,130,246",
          member: "34,197,94",
          agent: "168,85,247",
          role: "245,158,11",
          integration: "6,182,212",
        };
        const c = colors[node.type] || "59,130,246";
        const statusAlpha = node.status === "restricted" ? 0.5 : node.status === "warning" ? 0.7 : 1;
        const r = node.type === "workspace" ? 20 : node.type === "agent" ? 14 : 12;

        // glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},${0.06 * statusAlpha})`;
        ctx.fill();

        // body
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},${0.15 * statusAlpha})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${c},${0.4 * statusAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // label
        ctx.font = "10px monospace";
        ctx.fillStyle = `rgba(226,232,240,${0.6 * statusAlpha})`;
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + r + 14);

        // type badge
        ctx.font = "8px monospace";
        ctx.fillStyle = `rgba(${c},${0.5 * statusAlpha})`;
        ctx.fillText(node.type.toUpperCase(), node.x, node.y + r + 24);
      });

      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [view, ws.graphNodes]);

  const pendingApprovals = ws.getPendingApprovals();
  const criticalEvents = ws.getCriticalAuditEvents();
  const nonCompliantAgents = ws.getNonCompliantAgents();
  const noMfaMembers = ws.getMembersWithoutMfa();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground/90 tracking-tight">Workspace Architecture</h1>
          <p className="text-sm text-muted-foreground/50 mt-1">Secure operational segmentation &middot; Enterprise governance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-electric/10 bg-electric/[0.04] px-3 py-1.5">
            <Shield className="h-3.5 w-3.5 text-electric/60" />
            <span className="text-xs text-electric/70 font-mono">{ws.stats.securityScore}%</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-success/10 bg-success/[0.04] px-3 py-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-success/60" />
            <span className="text-xs text-success/70 font-mono">{ws.stats.governanceCompliance}% Compliant</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white/[0.02] p-1 border border-border/10">
        {viewTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all",
                view === tab.id
                  ? "bg-electric/[0.08] text-electric-glow shadow-sm"
                  : "text-muted-foreground/50 hover:text-foreground/70 hover:bg-white/[0.02]"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* DASHBOARD VIEW */}
      {/* ============================================================ */}
      {view === "dashboard" && (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Workspaces", value: ws.stats.totalWorkspaces, icon: LayoutGrid, color: "text-electric" },
              { label: "Members", value: ws.stats.activeMembers, icon: Users, color: "text-emerald-400" },
              { label: "AI Agents", value: ws.stats.aiAgents, icon: Bot, color: "text-purple-400" },
              { label: "Pending Approvals", value: ws.stats.pendingApprovals, icon: Clock, color: "text-amber-400" },
              { label: "Audit Events Today", value: ws.stats.auditEventsToday, icon: Activity, color: "text-cyan-400" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="aegis-card p-4">
                  <div className="flex items-center justify-between">
                    <Icon className={cn("h-4 w-4", stat.color)} />
                    <span className={cn("text-xl font-bold", stat.color)}>{stat.value}</span>
                  </div>
                  <p className="mt-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="aegis-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mb-3">Quick Actions</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Create Workspace", icon: LayoutGrid },
                { label: "Lock Workspace", icon: Lock },
                { label: "Security Audit", icon: Shield },
                { label: "Review Permissions", icon: Eye },
                { label: "Generate Summary", icon: FileText },
                { label: "Invite User", icon: Users },
                { label: "Export Package", icon: Download },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.label} onClick={() => runWsAction(action.label)} className="flex items-center gap-1.5 rounded-lg border border-border/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-foreground/60 hover:bg-electric/[0.04] hover:text-electric hover:border-electric/15 transition-all">
                    <Icon className="h-3 w-3" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alerts */}
          {(criticalEvents.length > 0 || noMfaMembers.length > 0 || nonCompliantAgents.length > 0) && (
            <div className="aegis-card p-4 border-destructive/10">
              <p className="text-[10px] font-mono uppercase tracking-wider text-destructive/60 mb-3">Attention Required</p>
              <div className="space-y-2">
                {criticalEvents.map((evt) => (
                  <div key={evt.id} className="flex items-start gap-2 rounded-lg bg-destructive/[0.03] px-3 py-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-foreground/80">{evt.action}</p>
                      <p className="text-[9px] text-muted-foreground/30">{evt.actor} &bull; {formatRelativeTime(evt.timestamp)}</p>
                    </div>
                  </div>
                ))}
                {noMfaMembers.length > 0 && (
                  <div className="flex items-start gap-2 rounded-lg bg-warning/[0.03] px-3 py-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-foreground/80">{noMfaMembers.length} member(s) without MFA</p>
                      <p className="text-[9px] text-muted-foreground/30">{noMfaMembers.map((m) => m.name).join(", ")}</p>
                    </div>
                  </div>
                )}
                {nonCompliantAgents.length > 0 && (
                  <div className="flex items-start gap-2 rounded-lg bg-warning/[0.03] px-3 py-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-foreground/80">{nonCompliantAgents.length} AI agent(s) below governance compliance threshold</p>
                      <p className="text-[9px] text-muted-foreground/30">{nonCompliantAgents.map((a) => `${a.name} (${a.governanceCompliance}%)`).join(", ")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Workspace cards */}
          <div className="grid grid-cols-2 gap-3">
            {ws.workspaces.map((workspace) => {
              const tc = typeConfig[workspace.type];
              const sc = stateConfig[workspace.securityState];
              const TypeIcon = tc.icon;
              const expanded = expandedWs === workspace.id;
              const members = ws.getMembersByWorkspace(workspace.id);
              const agents = ws.getAiAgentsByWorkspace(workspace.id);
              const collabs = ws.getCollabByWorkspace(workspace.id);

              return (
                <div key={workspace.id} className="aegis-card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", `${tc.color}/10`.replace("text-", "bg-"))}>
                        <TypeIcon className={cn("h-4 w-4", tc.color)} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground/90">{workspace.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn("text-[9px] font-mono uppercase tracking-wider", tc.color)}>{tc.label}</span>
                          <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase", sc.color, sc.bg)}>{sc.label}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setExpandedWs(expanded ? null : workspace.id)} className="p-1 rounded hover:bg-white/[0.03] transition-colors">
                      {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-muted-foreground/40 line-clamp-2">{workspace.description}</p>

                  <div className="mt-3 grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <span className="text-sm font-bold text-foreground/70">{workspace.memberCount}</span>
                      <p className="text-[8px] text-muted-foreground/30 uppercase">Members</p>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-bold text-foreground/70">{workspace.aiAgentCount}</span>
                      <p className="text-[8px] text-muted-foreground/30 uppercase">AI Agents</p>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-bold text-foreground/70">{workspace.activeIntegrations}</span>
                      <p className="text-[8px] text-muted-foreground/30 uppercase">Integrations</p>
                    </div>
                    <div className="text-center">
                      <span className={cn("text-sm font-bold", workspace.securityScore >= 90 ? "text-success" : workspace.securityScore >= 80 ? "text-amber-400" : "text-destructive")}>{workspace.securityScore}%</span>
                      <p className="text-[8px] text-muted-foreground/30 uppercase">Security</p>
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-4 border-t border-border/10 pt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div><span className="text-muted-foreground/30">Encryption:</span> <span className="text-foreground/60 font-mono">{workspace.encryptionScope}</span></div>
                        <div><span className="text-muted-foreground/30">AI Access:</span> <span className={cn("font-mono", workspace.aiAccessLevel === "denied" ? "text-destructive" : workspace.aiAccessLevel === "restricted" ? "text-amber-400" : "text-foreground/60")}>{workspace.aiAccessLevel}</span></div>
                        <div><span className="text-muted-foreground/30">Owner:</span> <span className="text-foreground/60">{workspace.owner}</span></div>
                        <div><span className="text-muted-foreground/30">Last Accessed:</span> <span className="text-foreground/60">{formatRelativeTime(workspace.lastAccessedAt)}</span></div>
                        <div><span className="text-muted-foreground/30">Recovery Policy:</span> <span className="text-foreground/60 font-mono">{workspace.recoveryPolicy}</span></div>
                        <div><span className="text-muted-foreground/30">Governance:</span> <span className="text-foreground/60 font-mono">{workspace.governancePolicy}</span></div>
                      </div>
                      {members.length > 0 && (
                        <div>
                          <p className="text-[9px] font-mono uppercase text-muted-foreground/25 mb-1">Members</p>
                          <div className="flex flex-wrap gap-1">
                            {members.map((m) => (
                              <span key={m.id} className="rounded-full bg-white/[0.03] px-2 py-0.5 text-[9px] text-foreground/50">{m.name}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {agents.length > 0 && (
                        <div>
                          <p className="text-[9px] font-mono uppercase text-muted-foreground/25 mb-1">AI Agents</p>
                          <div className="flex flex-wrap gap-1">
                            {agents.map((a) => (
                              <span key={a.id} className={cn("rounded-full px-2 py-0.5 text-[9px]", a.status === "active" ? "bg-purple-400/10 text-purple-400" : a.status === "restricted" ? "bg-destructive/10 text-destructive" : "bg-amber-400/10 text-amber-400")}>{a.name}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {workspace.tags.length > 0 && (
                        <div className="flex gap-1">
                          {workspace.tags.map((tag) => (
                            <span key={tag} className="rounded-md bg-electric/[0.04] px-1.5 py-0.5 text-[8px] font-mono text-electric/50">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Audit Timeline */}
          <div className="aegis-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mb-3">Recent Audit Events</p>
            <div className="space-y-2">
              {ws.auditEvents.slice(0, 8).map((evt) => (
                <div key={evt.id} className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-white/[0.01] transition-colors">
                  <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg mt-0.5",
                    evt.severity === "critical" ? "bg-destructive/10" : evt.severity === "warning" ? "bg-warning/10" : "bg-electric/[0.06]"
                  )}>
                    {evt.actorType === "ai-agent" ? <Bot className={cn("h-3 w-3", evt.severity === "critical" ? "text-destructive" : evt.severity === "warning" ? "text-warning" : "text-electric/60")} /> :
                     evt.actorType === "system" ? <Settings className={cn("h-3 w-3", evt.severity === "critical" ? "text-destructive" : evt.severity === "warning" ? "text-warning" : "text-electric/60")} /> :
                     <Users className={cn("h-3 w-3", evt.severity === "critical" ? "text-destructive" : evt.severity === "warning" ? "text-warning" : "text-electric/60")} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground/70 truncate">{evt.action}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] text-muted-foreground/30">{evt.actor}</span>
                      <span className="text-[9px] text-muted-foreground/20">&bull;</span>
                      <span className="text-[9px] text-muted-foreground/30">{formatRelativeTime(evt.timestamp)}</span>
                    </div>
                  </div>
                  <span className={cn("text-[8px] font-mono uppercase px-1.5 py-0.5 rounded",
                    evt.severity === "critical" ? "bg-destructive/10 text-destructive" : evt.severity === "warning" ? "bg-warning/10 text-warning" : "bg-electric/[0.06] text-electric/50"
                  )}>{evt.severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ROLES & PERMISSIONS VIEW */}
      {/* ============================================================ */}
      {view === "roles" && (
        <div className="space-y-6">
          <div className="aegis-card p-4">
            <h2 className="text-sm font-semibold text-foreground/80 mb-4">Enterprise RBAC — Role Definitions</h2>
            <div className="space-y-3">
              {ws.roleDefinitions.map((rd) => (
                <div key={rd.role} className="rounded-xl border border-border/10 bg-white/[0.01] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", `${rd.color}/10`.replace("text-", "bg-"))}>
                        <Fingerprint className={cn("h-4 w-4", rd.color)} />
                      </div>
                      <div>
                        <h3 className={cn("text-sm font-semibold", rd.color)}>{rd.label}</h3>
                        <p className="text-[10px] text-muted-foreground/40">{rd.description}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground/25 uppercase">{ws.getMembersByRole(rd.role).length} assigned</span>
                  </div>

                  <div className="mt-3 grid grid-cols-6 gap-1">
                    {Object.entries(rd.permissions).map(([resource, level]) => (
                      <div key={resource} className="text-center rounded-lg bg-white/[0.02] px-2 py-1.5">
                        <p className="text-[8px] font-mono uppercase text-muted-foreground/25">{resource}</p>
                        <p className={cn("text-[10px] font-mono mt-0.5",
                          level === "full" ? "text-success" : level === "none" ? "text-destructive/40" : level === "read" ? "text-electric/50" : "text-amber-400/60"
                        )}>{level}</p>
                      </div>
                    ))}
                  </div>

                  {ws.getMembersByRole(rd.role).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {ws.getMembersByRole(rd.role).map((m) => (
                        <span key={m.id} className="rounded-full bg-white/[0.03] px-2 py-0.5 text-[9px] text-foreground/50">
                          {m.name}
                          {!m.mfaEnabled && <span className="ml-1 text-destructive/60">(no MFA)</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="aegis-card p-4">
            <h2 className="text-sm font-semibold text-foreground/80 mb-4">Member Permissions Detail</h2>
            <div className="space-y-2">
              {ws.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 rounded-lg border border-border/5 bg-white/[0.01] px-4 py-3">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold",
                    member.status === "active" ? "bg-electric/10 text-electric" : "bg-muted/30 text-muted-foreground/40"
                  )}>{member.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground/80">{member.name}</p>
                    <p className="text-[9px] text-muted-foreground/30">{member.email}</p>
                  </div>
                  <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded",
                    member.role === "founder" ? "bg-electric/10 text-electric" : member.role === "security-officer" ? "bg-destructive/10 text-destructive" : "bg-white/[0.03] text-foreground/50"
                  )}>{member.role}</span>
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded",
                    member.accessLevel === "full" ? "bg-success/10 text-success" : member.accessLevel === "restricted" ? "bg-destructive/10 text-destructive" : "bg-amber-400/10 text-amber-400"
                  )}>{member.accessLevel}</span>
                  <div className="flex items-center gap-1">
                    {member.mfaEnabled ? <Shield className="h-3 w-3 text-success/60" /> : <AlertTriangle className="h-3 w-3 text-destructive/60" />}
                  </div>
                  <span className={cn("h-2 w-2 rounded-full", member.status === "active" ? "bg-success" : member.status === "inactive" ? "bg-muted-foreground/30" : "bg-destructive")} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* AI AGENT SECURITY VIEW */}
      {/* ============================================================ */}
      {view === "agents" && (
        <div className="space-y-6">
          {/* Agent Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Active Agents", value: ws.getActiveAiAgents().length, total: ws.agents.length, color: "text-purple-400" },
              { label: "Restricted", value: ws.getRestrictedAgents().length, total: ws.agents.length, color: "text-destructive" },
              { label: "Non-Compliant", value: ws.getNonCompliantAgents().length, total: ws.agents.length, color: "text-amber-400" },
              { label: "Avg Compliance", value: `${Math.round(ws.agents.reduce((s, a) => s + a.governanceCompliance, 0) / ws.agents.length)}%`, total: null, color: "text-success" },
            ].map((stat) => (
              <div key={stat.label} className="aegis-card p-4">
                <p className={cn("text-lg font-bold", stat.color)}>{stat.value}{stat.total !== null && <span className="text-muted-foreground/30 text-sm">/{stat.total}</span>}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Agent Cards */}
          <div className="space-y-3">
            {ws.agents.map((agent) => {
              const expanded = expandedAgent === agent.id;
              const workspace = ws.getWorkspaceById(agent.workspaceId);
              return (
                <div key={agent.id} className={cn("aegis-card p-4", agent.status === "restricted" && "border-destructive/10")}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl",
                        agent.status === "active" ? "bg-purple-400/10" : agent.status === "restricted" ? "bg-destructive/10" : "bg-amber-400/10"
                      )}>
                        <Bot className={cn("h-5 w-5",
                          agent.status === "active" ? "text-purple-400" : agent.status === "restricted" ? "text-destructive" : "text-amber-400"
                        )} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground/90">{agent.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-mono uppercase text-purple-400/60">{agent.type}</span>
                          <span className="text-[9px] text-muted-foreground/20">&bull;</span>
                          <span className="text-[9px] text-muted-foreground/40">{workspace?.name || agent.workspaceId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded",
                        agent.status === "active" ? "bg-success/10 text-success" : agent.status === "restricted" ? "bg-destructive/10 text-destructive" : "bg-amber-400/10 text-amber-400"
                      )}>{agent.status}</span>
                      <button onClick={() => setExpandedAgent(expanded ? null : agent.id)} className="p-1 rounded hover:bg-white/[0.03]">
                        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-5 gap-2">
                    <div className="text-center rounded-lg bg-white/[0.02] py-1.5">
                      <span className="text-sm font-bold text-foreground/70">{agent.totalActions.toLocaleString()}</span>
                      <p className="text-[8px] text-muted-foreground/30">Actions</p>
                    </div>
                    <div className="text-center rounded-lg bg-white/[0.02] py-1.5">
                      <span className="text-sm font-bold text-foreground/70">{agent.totalMemoryAccess.toLocaleString()}</span>
                      <p className="text-[8px] text-muted-foreground/30">Memory</p>
                    </div>
                    <div className="text-center rounded-lg bg-white/[0.02] py-1.5">
                      <span className={cn("text-sm font-bold", agent.totalEscalations > 5 ? "text-amber-400" : "text-foreground/70")}>{agent.totalEscalations}</span>
                      <p className="text-[8px] text-muted-foreground/30">Escalations</p>
                    </div>
                    <div className="text-center rounded-lg bg-white/[0.02] py-1.5">
                      <span className={cn("text-sm font-bold", agent.governanceCompliance >= 95 ? "text-success" : agent.governanceCompliance >= 90 ? "text-amber-400" : "text-destructive")}>{agent.governanceCompliance}%</span>
                      <p className="text-[8px] text-muted-foreground/30">Compliance</p>
                    </div>
                    <div className="text-center rounded-lg bg-white/[0.02] py-1.5">
                      <span className="text-sm font-bold text-foreground/70">{agent.auditLogCount.toLocaleString()}</span>
                      <p className="text-[8px] text-muted-foreground/30">Audit Logs</p>
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-4 border-t border-border/10 pt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-3 text-[10px]">
                        <div><span className="text-muted-foreground/30">Identity Scope:</span> <span className="text-foreground/60 font-mono">{agent.identityScope}</span></div>
                        <div><span className="text-muted-foreground/30">Memory Restriction:</span> <span className={cn("font-mono", agent.memoryRestriction === "denied" ? "text-destructive" : agent.memoryRestriction === "summary-only" ? "text-amber-400" : "text-foreground/60")}>{agent.memoryRestriction}</span></div>
                      </div>
                      <div className="text-[10px]">
                        <span className="text-muted-foreground/30">Permission Boundary:</span>
                        <p className="text-foreground/50 mt-0.5">{agent.permissionBoundary}</p>
                      </div>
                      <div className="text-[10px]">
                        <span className="text-muted-foreground/30">Last Action:</span>
                        <p className="text-foreground/50 mt-0.5">{agent.lastAction} &bull; <span className="text-muted-foreground/30">{formatRelativeTime(agent.lastActionAt)}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI Audit Events */}
          <div className="aegis-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mb-3">AI Agent Audit Trail</p>
            <div className="space-y-2">
              {ws.getAiAuditEvents().map((evt) => (
                <div key={evt.id} className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-white/[0.01]">
                  <Bot className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", evt.severity === "critical" ? "text-destructive" : evt.severity === "warning" ? "text-warning" : "text-purple-400/60")} />
                  <div className="flex-1">
                    <p className="text-xs text-foreground/70">{evt.action}</p>
                    <p className="text-[9px] text-muted-foreground/30">{evt.actor} &bull; {formatRelativeTime(evt.timestamp)}</p>
                  </div>
                  <span className={cn("text-[8px] font-mono uppercase px-1.5 py-0.5 rounded",
                    evt.severity === "critical" ? "bg-destructive/10 text-destructive" : evt.severity === "warning" ? "bg-warning/10 text-warning" : "bg-electric/[0.06] text-electric/50"
                  )}>{evt.severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* COLLABORATION VIEW */}
      {/* ============================================================ */}
      {view === "collaboration" && (
        <div className="space-y-6">
          {/* Collab Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Active Items", value: ws.getActiveCollaborations().length, color: "text-electric" },
              { label: "Pending Approvals", value: pendingApprovals.length, color: "text-amber-400" },
              { label: "Encrypted Notes", value: ws.getEncryptedNotes().length, color: "text-success" },
              { label: "Total Items", value: ws.collaborations.length, color: "text-foreground/70" },
            ].map((stat) => (
              <div key={stat.label} className="aegis-card p-4">
                <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Collaboration Items */}
          <div className="space-y-3">
            {ws.collaborations.map((collab) => {
              const expanded = expandedCollab === collab.id;
              const workspace = ws.getWorkspaceById(collab.workspaceId);
              const typeIcons: Record<string, React.ElementType> = {
                "encrypted-note": Lock, "shared-entry": FileText, discussion: MessageSquare,
                comment: MessageSquare, approval: ThumbsUp, handoff: ArrowRight, acknowledgement: CheckCircle,
              };
              const TypeIcon = typeIcons[collab.type] || FileText;
              const statusColors: Record<string, string> = {
                active: "bg-success/10 text-success", pending: "bg-amber-400/10 text-amber-400",
                approved: "bg-electric/10 text-electric", completed: "bg-muted/20 text-muted-foreground/50",
                rejected: "bg-destructive/10 text-destructive",
              };
              const priorityColors: Record<string, string> = {
                low: "text-muted-foreground/30", medium: "text-foreground/50", high: "text-amber-400", critical: "text-destructive",
              };

              return (
                <div key={collab.id} className={cn("aegis-card p-4", collab.priority === "critical" && "border-destructive/10")}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", collab.encrypted ? "bg-success/10" : "bg-electric/[0.06]")}>
                        <TypeIcon className={cn("h-4 w-4", collab.encrypted ? "text-success" : "text-electric/60")} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground/90">{collab.title}</h3>
                          {collab.encrypted && <Lock className="h-3 w-3 text-success/60" />}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-mono uppercase text-muted-foreground/30">{collab.type.replace("-", " ")}</span>
                          <span className="text-[9px] text-muted-foreground/20">&bull;</span>
                          <span className="text-[9px] text-muted-foreground/30">{workspace?.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[9px] font-mono uppercase", priorityColors[collab.priority])}>{collab.priority}</span>
                      <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded", statusColors[collab.status])}>{collab.status}</span>
                      <button onClick={() => setExpandedCollab(expanded ? null : collab.id)} className="p-1 rounded hover:bg-white/[0.03]">
                        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-3 border-t border-border/10 pt-3 space-y-2">
                      <p className="text-[11px] text-foreground/50">{collab.content}</p>
                      <div className="flex items-center gap-2 text-[9px] text-muted-foreground/30">
                        <span>By {collab.author}</span>
                        <span>&bull;</span>
                        <span>Updated {formatRelativeTime(collab.updatedAt)}</span>
                      </div>
                      {collab.participants.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] text-muted-foreground/25">Participants:</span>
                          {collab.participants.map((p) => (
                            <span key={p} className="rounded-full bg-white/[0.03] px-2 py-0.5 text-[9px] text-foreground/50">{p}</span>
                          ))}
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
      {/* GRAPH VIEW */}
      {/* ============================================================ */}
      {view === "graph" && (
        <div className="space-y-4">
          <div className="aegis-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground/80">Workspace Relationship Map</h2>
              <div className="flex items-center gap-3">
                {[
                  { label: "Workspace", color: "bg-electric/60" },
                  { label: "Member", color: "bg-success/60" },
                  { label: "AI Agent", color: "bg-purple-400/60" },
                ].map((legend) => (
                  <div key={legend.label} className="flex items-center gap-1">
                    <div className={cn("h-2 w-2 rounded-full", legend.color)} />
                    <span className="text-[9px] text-muted-foreground/30">{legend.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <canvas ref={canvasRef} className="w-full rounded-xl bg-black/20 border border-border/5" />
          </div>

          {/* Organizational Hierarchy */}
          <div className="aegis-card p-4">
            <h2 className="text-sm font-semibold text-foreground/80 mb-3">Access Hierarchy</h2>
            <div className="space-y-2">
              {ws.workspaces
                .sort((a, b) => b.securityScore - a.securityScore)
                .map((workspace) => {
                  const tc = typeConfig[workspace.type];
                  const sc = stateConfig[workspace.securityState];
                  return (
                    <div key={workspace.id} className="flex items-center gap-3 rounded-lg border border-border/5 bg-white/[0.01] px-4 py-2.5">
                      <div className="w-1 h-8 rounded-full" style={{ background: `linear-gradient(180deg, ${workspace.securityScore >= 90 ? "rgba(34,197,94,0.6)" : workspace.securityScore >= 80 ? "rgba(245,158,11,0.6)" : "rgba(239,68,68,0.6)"}, transparent)` }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground/80">{workspace.name}</span>
                          <span className={cn("text-[8px] font-mono uppercase px-1 py-0.5 rounded", sc.bg, sc.color)}>{sc.label}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground/30">{workspace.memberCount} members &bull; {workspace.aiAgentCount} agents &bull; {workspace.encryptionScope}</p>
                      </div>
                      <div className="text-right">
                        <span className={cn("text-sm font-bold", workspace.securityScore >= 90 ? "text-success" : workspace.securityScore >= 80 ? "text-amber-400" : "text-destructive")}>{workspace.securityScore}%</span>
                        <p className="text-[8px] text-muted-foreground/20">Security</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
