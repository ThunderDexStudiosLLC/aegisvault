"use client";

import { useState, useEffect } from "react";
import {
  Shield, Lock, Key, Fingerprint, AlertTriangle, CheckCircle,
  Clock, Eye, Activity, RefreshCw, Monitor, Smartphone,
  Server, Bot, Zap, Radio, XCircle, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, Minus, ShieldAlert, ShieldOff,
  Cpu, Globe, Wifi, HardDrive, Ban,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useEncryption } from "@/contexts/EncryptionContext";
import { useOrb } from "@/contexts/OrbContext";
import { useFeedback } from "@/components/global/OperationalFeedback";

type ViewMode = "trust" | "keys" | "zero-trust" | "intelligence" | "lockdown" | "devices";

const viewTabs: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: "trust", label: "Trust Dashboard", icon: Shield },
  { id: "keys", label: "Key Management", icon: Key },
  { id: "zero-trust", label: "Zero-Trust", icon: Fingerprint },
  { id: "intelligence", label: "Security Intel", icon: Radio },
  { id: "lockdown", label: "Emergency", icon: ShieldAlert },
  { id: "devices", label: "Devices", icon: Monitor },
];

const keyTypeColors: Record<string, string> = {
  master: "text-electric", workspace: "text-cyan-400", field: "text-emerald-400",
  backup: "text-amber-400", session: "text-purple-400", "ai-memory": "text-violet-400",
  audit: "text-orange-400", recovery: "text-destructive",
};

const severityColors: Record<string, string> = {
  info: "bg-electric/[0.06] text-electric/50", warning: "bg-warning/10 text-warning",
  high: "bg-orange-400/10 text-orange-400", critical: "bg-destructive/10 text-destructive",
};

const statusColors: Record<string, string> = {
  detected: "text-amber-400", investigating: "text-orange-400",
  mitigated: "text-electric", resolved: "text-success", "false-positive": "text-muted-foreground/40",
};

export default function EncryptionPage() {
  const [view, setView] = useState<ViewMode>("trust");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [lockdownMode, setLockdownMode] = useState<"none" | "partial" | "full" | "emergency">("none");
  const enc = useEncryption();
  const { setState } = useOrb();
  const { show } = useFeedback();

  const runAction = (label: string) => {
    setState("processing");
    show("processing", `${label}...`, "Operation in progress");
    setTimeout(() => { show("success", `${label} completed`, "Audit log entry created"); setState("secure"); }, 2000);
  };

  useEffect(() => { setState("secure"); return () => setState("idle"); }, [setState]);

  const trendIcon = (trend: string) => {
    if (trend === "improving") return <TrendingUp className="h-3 w-3 text-success" />;
    if (trend === "declining") return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-muted-foreground/30" />;
  };

  const deviceIcon = (type: string) => {
    if (type === "mobile") return <Smartphone className="h-4 w-4" />;
    if (type === "server") return <Server className="h-4 w-4" />;
    if (type === "hardware-key") return <Key className="h-4 w-4" />;
    if (type === "tablet") return <Smartphone className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground/90 tracking-tight">Encryption & Trust Infrastructure</h1>
          <p className="text-sm text-muted-foreground/50 mt-1">Zero-trust architecture &middot; Enterprise-grade security</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-electric/10 bg-electric/[0.04] px-3 py-1.5">
            <Lock className="h-3.5 w-3.5 text-electric/60" />
            <span className="text-xs text-electric/70 font-mono">{enc.stats.encryptionCoverage}% Encrypted</span>
          </div>
          <div className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-1.5",
            enc.stats.overallTrustScore >= 85 ? "border-success/10 bg-success/[0.04]" : "border-warning/10 bg-warning/[0.04]"
          )}>
            <Shield className={cn("h-3.5 w-3.5", enc.stats.overallTrustScore >= 85 ? "text-success/60" : "text-warning/60")} />
            <span className={cn("text-xs font-mono", enc.stats.overallTrustScore >= 85 ? "text-success/70" : "text-warning/70")}>Trust: {enc.stats.overallTrustScore}%</span>
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
      {/* TRUST DASHBOARD */}
      {/* ============================================================ */}
      {view === "trust" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-6 gap-3">
            {[
              { label: "Keys", value: `${enc.stats.activeKeys}/${enc.stats.totalKeys}`, color: "text-electric", icon: Key },
              { label: "Devices", value: enc.stats.trustedDevices, color: "text-emerald-400", icon: Monitor },
              { label: "Sessions", value: enc.stats.activeSessions, color: "text-cyan-400", icon: Wifi },
              { label: "High Risk", value: enc.stats.highRiskSessions, color: "text-destructive", icon: AlertTriangle },
              { label: "Events (24h)", value: enc.stats.securityEvents24h, color: "text-amber-400", icon: Activity },
              { label: "Zero-Trust", value: `${enc.stats.zeroTrustCompliance}%`, color: "text-purple-400", icon: Fingerprint },
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

          {/* Trust Score Cards */}
          <div className="grid grid-cols-3 gap-3">
            {enc.trustScores.map((ts) => (
              <div key={ts.category} className="aegis-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground/80">{ts.category}</h3>
                  {trendIcon(ts.trend)}
                </div>

                {/* Score bar */}
                <div className="relative h-2 rounded-full bg-white/[0.03] mb-1">
                  <div className={cn("absolute left-0 top-0 h-full rounded-full transition-all",
                    ts.score >= 90 ? "bg-success" : ts.score >= 80 ? "bg-electric" : ts.score >= 70 ? "bg-amber-400" : "bg-destructive"
                  )} style={{ width: `${(ts.score / ts.maxScore) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground/30 mb-3">
                  <span>0</span>
                  <span className={cn("text-xs font-bold", ts.score >= 90 ? "text-success" : ts.score >= 80 ? "text-electric" : ts.score >= 70 ? "text-amber-400" : "text-destructive")}>{ts.score}/{ts.maxScore}</span>
                  <span>{ts.maxScore}</span>
                </div>

                {/* Factors */}
                <div className="space-y-1.5">
                  {ts.factors.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className={cn("mt-1 h-1.5 w-1.5 rounded-full shrink-0",
                        f.impact === "positive" ? "bg-success" : f.impact === "negative" ? "bg-destructive" : "bg-muted-foreground/20"
                      )} />
                      <p className="text-[10px] text-muted-foreground/50">{f.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="aegis-card p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mb-3">Security Actions</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Run Security Audit", icon: Shield },
                { label: "Rotate Keys", icon: RefreshCw },
                { label: "Review Sessions", icon: Eye },
                { label: "Scan Credentials", icon: Key },
                { label: "Lock Workspace", icon: Lock },
                { label: "Generate Trust Report", icon: Activity },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.label} onClick={() => runAction(action.label)} className="flex items-center gap-1.5 rounded-lg border border-border/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-foreground/60 hover:bg-electric/[0.04] hover:text-electric hover:border-electric/15 transition-all">
                    <Icon className="h-3 w-3" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* KEY MANAGEMENT */}
      {/* ============================================================ */}
      {view === "keys" && (
        <div className="space-y-6">
          {/* Key health summary */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Active Keys", value: enc.getActiveKeys().length, color: "text-success" },
              { label: "Rotation Due", value: enc.getKeysNeedingRotation().length, color: "text-amber-400" },
              { label: "HW Protected", value: enc.getHardwareProtectedKeys().length, color: "text-electric" },
              { label: "Key Health", value: `${enc.stats.keyHealthScore}%`, color: enc.stats.keyHealthScore >= 90 ? "text-success" : "text-amber-400" },
            ].map((stat) => (
              <div key={stat.label} className="aegis-card p-4">
                <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Key list */}
          <div className="space-y-2">
            {enc.keys.map((k) => {
              const expanded = expandedKey === k.id;
              const typeColor = keyTypeColors[k.type] || "text-electric";
              return (
                <div key={k.id} className={cn("aegis-card p-4", k.status === "revoked" && "opacity-60", k.status === "compromised" && "border-destructive/20")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl",
                        k.hardwareProtected ? "bg-electric/10" : "bg-white/[0.03]"
                      )}>
                        <Key className={cn("h-4 w-4", typeColor)} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground/90">{k.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn("text-[9px] font-mono uppercase", typeColor)}>{k.type}</span>
                          <span className="text-[9px] text-muted-foreground/20">&bull;</span>
                          <span className="text-[9px] text-muted-foreground/40 font-mono">{k.algorithm}</span>
                          <span className="text-[9px] text-muted-foreground/20">&bull;</span>
                          <span className="text-[9px] text-muted-foreground/40">{k.bitStrength}-bit</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {k.hardwareProtected && <HardDrive className="h-3 w-3 text-electric/40" />}
                      {k.exposureRisk !== "none" && <AlertTriangle className={cn("h-3 w-3", k.exposureRisk === "high" ? "text-destructive" : "text-amber-400")} />}
                      <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded",
                        k.status === "active" ? "bg-success/10 text-success" :
                        k.status === "rotating" ? "bg-electric/10 text-electric" :
                        k.status === "revoked" ? "bg-muted/20 text-muted-foreground/40" :
                        "bg-destructive/10 text-destructive"
                      )}>{k.status}</span>
                      <button onClick={() => setExpandedKey(expanded ? null : k.id)} className="p-1 rounded hover:bg-white/[0.03]">
                        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-3 border-t border-border/10 pt-3 grid grid-cols-2 gap-2 text-[10px]">
                      <div><span className="text-muted-foreground/30">Scope:</span> <span className="text-foreground/60">{k.scope}</span></div>
                      <div><span className="text-muted-foreground/30">Usage:</span> <span className="text-foreground/60 font-mono">{k.usageCount.toLocaleString()} operations</span></div>
                      <div><span className="text-muted-foreground/30">Created:</span> <span className="text-foreground/60">{formatRelativeTime(k.createdAt)}</span></div>
                      <div><span className="text-muted-foreground/30">Last Rotated:</span> <span className="text-foreground/60">{formatRelativeTime(k.lastRotatedAt)}</span></div>
                      <div><span className="text-muted-foreground/30">Expires:</span> <span className={cn("font-mono", k.rotationDueDays < 90 ? "text-amber-400" : "text-foreground/60")}>{formatRelativeTime(k.expiresAt)} ({k.rotationDueDays}d)</span></div>
                      <div><span className="text-muted-foreground/30">Exposure Risk:</span> <span className={cn("font-mono", k.exposureRisk === "none" ? "text-success" : k.exposureRisk === "low" ? "text-amber-400" : "text-destructive")}>{k.exposureRisk}</span></div>
                      {k.derivedFrom && <div><span className="text-muted-foreground/30">Derived From:</span> <span className="text-foreground/60 font-mono">{k.derivedFrom}</span></div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ZERO-TRUST */}
      {/* ============================================================ */}
      {view === "zero-trust" && (
        <div className="space-y-6">
          {/* Zero-Trust compliance */}
          <div className="aegis-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground/80">Zero-Trust Compliance</h2>
              <span className={cn("text-lg font-bold", enc.stats.zeroTrustCompliance >= 90 ? "text-success" : enc.stats.zeroTrustCompliance >= 80 ? "text-electric" : "text-amber-400")}>{enc.stats.zeroTrustCompliance}%</span>
            </div>
            <div className="relative h-3 rounded-full bg-white/[0.03] mb-4">
              <div className={cn("absolute left-0 top-0 h-full rounded-full transition-all",
                enc.stats.zeroTrustCompliance >= 90 ? "bg-success" : enc.stats.zeroTrustCompliance >= 80 ? "bg-electric" : "bg-amber-400"
              )} style={{ width: `${enc.stats.zeroTrustCompliance}%` }} />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Session Verification", value: `${enc.sessions.filter(s => s.continuousVerification).length}/${enc.sessions.length}`, ok: enc.sessions.filter(s => s.continuousVerification).length === enc.sessions.length },
                { label: "MFA Verified", value: `${enc.sessions.filter(s => s.mfaVerified).length}/${enc.sessions.length}`, ok: enc.sessions.filter(s => s.mfaVerified).length === enc.sessions.length },
                { label: "Device Trust", value: `${enc.getTrustedDevices().length}/${enc.devices.length}`, ok: enc.getBlockedDevices().length === 0 },
                { label: "Step-Up Auth", value: `${enc.sessions.filter(s => s.stepUpAuth).length}/${enc.sessions.length}`, ok: false },
              ].map((check) => (
                <div key={check.label} className="rounded-lg bg-white/[0.02] p-3 text-center">
                  <p className={cn("text-lg font-bold", check.ok ? "text-success" : "text-amber-400")}>{check.value}</p>
                  <p className="text-[9px] font-mono uppercase text-muted-foreground/40 mt-1">{check.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="aegis-card p-4">
            <h2 className="text-sm font-semibold text-foreground/80 mb-4">Active Sessions — Continuous Verification</h2>
            <div className="space-y-2">
              {enc.sessions.map((sess) => (
                <div key={sess.id} className={cn("flex items-center gap-3 rounded-lg border bg-white/[0.01] px-4 py-3",
                  sess.risk === "high" ? "border-destructive/15" : sess.risk === "medium" ? "border-amber-400/10" : "border-border/5"
                )}>
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold",
                    sess.risk === "high" ? "bg-destructive/10 text-destructive" :
                    sess.risk === "medium" ? "bg-amber-400/10 text-amber-400" :
                    "bg-success/10 text-success"
                  )}>{sess.userName.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground/80">{sess.userName}</p>
                    <p className="text-[9px] text-muted-foreground/30">{sess.deviceName} &bull; {sess.location} &bull; {sess.ipAddress}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {sess.mfaVerified ? <Shield className="h-3 w-3 text-success/60" /> : <AlertTriangle className="h-3 w-3 text-destructive/60" />}
                    {sess.continuousVerification ? <Eye className="h-3 w-3 text-success/60" /> : <XCircle className="h-3 w-3 text-destructive/60" />}
                    {sess.stepUpAuth ? <Fingerprint className="h-3 w-3 text-success/60" /> : <Minus className="h-3 w-3 text-muted-foreground/20" />}
                  </div>
                  <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded",
                    sess.risk === "high" ? "bg-destructive/10 text-destructive" :
                    sess.risk === "medium" ? "bg-amber-400/10 text-amber-400" :
                    "bg-success/10 text-success"
                  )}>{sess.risk}</span>
                  <span className="text-[9px] text-muted-foreground/30">{formatRelativeTime(sess.lastActivity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          {enc.getHighRiskSessions().length > 0 && (
            <div className="aegis-card p-4 border-destructive/10">
              <h2 className="text-sm font-semibold text-destructive/80 mb-3">Session Risk Factors</h2>
              <div className="space-y-2">
                {enc.getHighRiskSessions().map((sess) => (
                  <div key={sess.id} className="rounded-lg bg-destructive/[0.03] p-3">
                    <p className="text-xs font-medium text-foreground/80 mb-1">{sess.userName} — {sess.deviceName}</p>
                    <div className="flex flex-wrap gap-1">
                      {sess.riskFactors.map((factor, i) => (
                        <span key={i} className="rounded-full bg-destructive/10 px-2 py-0.5 text-[9px] text-destructive">{factor}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECURITY INTELLIGENCE */}
      {/* ============================================================ */}
      {view === "intelligence" && (
        <div className="space-y-6">
          {/* Intel stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Critical Events", value: enc.getCriticalEvents().length, color: "text-destructive" },
              { label: "Investigating", value: enc.getActiveInvestigations().length, color: "text-amber-400" },
              { label: "Mitigated", value: enc.securityEvents.filter(e => e.status === "mitigated").length, color: "text-electric" },
              { label: "Resolved", value: enc.securityEvents.filter(e => e.status === "resolved").length, color: "text-success" },
            ].map((stat) => (
              <div key={stat.label} className="aegis-card p-4">
                <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Event List */}
          <div className="space-y-2">
            {enc.securityEvents.map((evt) => {
              const expanded = expandedEvent === evt.id;
              return (
                <div key={evt.id} className={cn("aegis-card p-4", evt.severity === "critical" && "border-destructive/10")}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl shrink-0",
                        evt.severity === "critical" ? "bg-destructive/10" : evt.severity === "high" ? "bg-orange-400/10" : evt.severity === "warning" ? "bg-warning/10" : "bg-electric/[0.06]"
                      )}>
                        {evt.type === "suspicious-login" ? <AlertTriangle className={cn("h-4 w-4", evt.severity === "critical" ? "text-destructive" : "text-warning")} /> :
                         evt.type === "impossible-travel" ? <Globe className={cn("h-4 w-4", evt.severity === "high" ? "text-orange-400" : "text-warning")} /> :
                         evt.type === "credential-exposure" ? <Key className={cn("h-4 w-4", evt.severity === "high" ? "text-orange-400" : "text-warning")} /> :
                         evt.type === "ai-misuse" ? <Bot className="h-4 w-4 text-violet-400" /> :
                         evt.type === "brute-force" ? <Ban className={cn("h-4 w-4", evt.severity === "critical" ? "text-destructive" : "text-warning")} /> :
                         evt.type === "privilege-escalation" ? <Zap className="h-4 w-4 text-orange-400" /> :
                         <Activity className="h-4 w-4 text-electric/60" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground/90">{evt.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-mono uppercase text-muted-foreground/30">{evt.type.replace(/-/g, " ")}</span>
                          {evt.actor && <>
                            <span className="text-[9px] text-muted-foreground/20">&bull;</span>
                            <span className="text-[9px] text-muted-foreground/40">{evt.actor}</span>
                          </>}
                          <span className="text-[9px] text-muted-foreground/20">&bull;</span>
                          <span className="text-[9px] text-muted-foreground/30">{formatRelativeTime(evt.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[8px] font-mono uppercase px-1.5 py-0.5 rounded", severityColors[evt.severity])}>{evt.severity}</span>
                      <span className={cn("text-[9px] font-mono", statusColors[evt.status])}>{evt.status}</span>
                      {evt.automated && <Cpu className="h-3 w-3 text-muted-foreground/20" />}
                      <button onClick={() => setExpandedEvent(expanded ? null : evt.id)} className="p-1 rounded hover:bg-white/[0.03]">
                        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-3 border-t border-border/10 pt-3 space-y-2">
                      <p className="text-[11px] text-foreground/50">{evt.description}</p>
                      {evt.location && <p className="text-[10px] text-muted-foreground/30">Location: {evt.location}</p>}
                      {evt.relatedEntities.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] text-muted-foreground/25">Related:</span>
                          {evt.relatedEntities.map((e) => (
                            <span key={e} className="rounded-full bg-white/[0.03] px-2 py-0.5 text-[9px] text-foreground/50 font-mono">{e}</span>
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
      {/* EMERGENCY LOCKDOWN */}
      {/* ============================================================ */}
      {view === "lockdown" && (
        <div className="space-y-6">
          {/* Current Status */}
          <div className={cn("aegis-card p-6", lockdownMode !== "none" && "border-destructive/20")}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl",
                  lockdownMode === "none" ? "bg-success/10" : lockdownMode === "emergency" ? "bg-destructive/10" : "bg-amber-400/10"
                )}>
                  {lockdownMode === "none" ? <Shield className="h-6 w-6 text-success" /> : <ShieldOff className="h-6 w-6 text-destructive" />}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground/90">
                    {lockdownMode === "none" ? "Systems Operational" : lockdownMode === "emergency" ? "EMERGENCY LOCKDOWN" : `${lockdownMode.charAt(0).toUpperCase() + lockdownMode.slice(1)} Lockdown`}
                  </h2>
                  <p className="text-xs text-muted-foreground/40">
                    {lockdownMode === "none" ? "No active lockdown protocols" : "Lockdown protocols engaged"}
                  </p>
                </div>
              </div>
              <div className={cn("text-sm font-mono font-bold px-3 py-1.5 rounded-lg",
                lockdownMode === "none" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>{lockdownMode === "none" ? "ALL CLEAR" : lockdownMode.toUpperCase()}</div>
            </div>

            {lockdownMode !== "none" && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-lg bg-destructive/[0.04] p-3 text-center">
                  <p className="text-lg font-bold text-destructive">{lockdownMode === "emergency" ? 8 : lockdownMode === "full" ? 5 : 2}</p>
                  <p className="text-[9px] font-mono text-muted-foreground/40">Workspaces Locked</p>
                </div>
                <div className="rounded-lg bg-destructive/[0.04] p-3 text-center">
                  <p className="text-lg font-bold text-destructive">{lockdownMode === "emergency" ? enc.sessions.length : lockdownMode === "full" ? 3 : 1}</p>
                  <p className="text-[9px] font-mono text-muted-foreground/40">Sessions Revoked</p>
                </div>
                <div className="rounded-lg bg-destructive/[0.04] p-3 text-center">
                  <p className="text-lg font-bold text-destructive">{lockdownMode === "emergency" ? 7 : lockdownMode === "full" ? 5 : 0}</p>
                  <p className="text-[9px] font-mono text-muted-foreground/40">AI Agents Frozen</p>
                </div>
              </div>
            )}
          </div>

          {/* Lockdown Controls */}
          <div className="aegis-card p-4">
            <h2 className="text-sm font-semibold text-foreground/80 mb-4">Lockdown Controls</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { level: "partial" as const, label: "Partial Lockdown", desc: "Lock specific workspaces, revoke high-risk sessions, restrict external access", color: "amber-400", icon: ShieldAlert },
                { level: "full" as const, label: "Full Lockdown", desc: "Lock all non-essential workspaces, freeze non-critical AI agents, require step-up auth", color: "orange-400", icon: ShieldOff },
                { level: "emergency" as const, label: "Emergency Freeze", desc: "IMMEDIATE: Lock all workspaces, revoke all sessions, freeze all AI, invalidate external tokens", color: "destructive", icon: Ban },
                { level: "none" as const, label: "Restore Operations", desc: "Lift all lockdown protocols, restore normal access, reactivate AI agents", color: "success", icon: CheckCircle },
              ].map((ctrl) => {
                const Icon = ctrl.icon;
                const isActive = lockdownMode === ctrl.level;
                return (
                  <button key={ctrl.level} onClick={() => { setLockdownMode(ctrl.level); if (ctrl.level === "emergency") { setState("emergency-lockdown"); show("error", "EMERGENCY LOCKDOWN ENGAGED", "All access frozen — founder authorization required"); } else if (ctrl.level !== "none") { setState("alert"); show("warning", `${ctrl.label} activated`, "Lockdown protocols engaged"); } else { setState("secure"); show("success", "Lockdown disengaged", "Systems restored to operational status"); } }}
                    className={cn("flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                      isActive ? `border-${ctrl.color}/30 bg-${ctrl.color}/[0.04]` : "border-border/10 bg-white/[0.01] hover:bg-white/[0.02]"
                    )}>
                    <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", `text-${ctrl.color}`)} />
                    <div>
                      <p className={cn("text-sm font-semibold", isActive ? `text-${ctrl.color}` : "text-foreground/80")}>{ctrl.label}</p>
                      <p className="text-[10px] text-muted-foreground/40 mt-0.5">{ctrl.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emergency Procedures */}
          <div className="aegis-card p-4">
            <h2 className="text-sm font-semibold text-foreground/80 mb-3">Emergency Procedures</h2>
            <div className="space-y-2">
              {[
                { step: 1, action: "Credential Revocation", desc: "Invalidate all active API keys, OAuth tokens, and session cookies", auto: true },
                { step: 2, action: "Session Invalidation", desc: "Force logout all users, require re-authentication with step-up verification", auto: true },
                { step: 3, action: "AI Permission Freeze", desc: "Suspend all AI agent operations, deny memory access, halt autonomous workflows", auto: true },
                { step: 4, action: "Workspace Isolation", desc: "Encrypt workspace boundaries, disable cross-workspace access, lock shared vaults", auto: true },
                { step: 5, action: "Audit Preservation", desc: "Snapshot all audit logs, create immutable backup, enable forensic logging", auto: true },
                { step: 6, action: "Escalation Notification", desc: "Alert founder, security officer, and emergency contacts via secure channel", auto: false },
                { step: 7, action: "Recovery Preparation", desc: "Stage recovery keys, validate backup integrity, prepare restoration playbook", auto: false },
              ].map((proc) => (
                <div key={proc.step} className="flex items-center gap-3 rounded-lg border border-border/5 bg-white/[0.01] px-4 py-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-electric/10 text-electric text-[10px] font-bold">{proc.step}</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground/80">{proc.action}</p>
                    <p className="text-[9px] text-muted-foreground/30">{proc.desc}</p>
                  </div>
                  <span className={cn("text-[8px] font-mono uppercase px-1.5 py-0.5 rounded", proc.auto ? "bg-electric/[0.06] text-electric/50" : "bg-amber-400/10 text-amber-400")}>
                    {proc.auto ? "automated" : "manual"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DEVICES */}
      {/* ============================================================ */}
      {view === "devices" && (
        <div className="space-y-6">
          {/* Device stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Trusted", value: enc.getDevicesByTrust("trusted").length, color: "text-success" },
              { label: "Verified", value: enc.getDevicesByTrust("verified").length, color: "text-electric" },
              { label: "Blocked", value: enc.getBlockedDevices().length, color: "text-destructive" },
              { label: "HW Key Bound", value: enc.devices.filter(d => d.hardwareKeyBound).length, color: "text-purple-400" },
            ].map((stat) => (
              <div key={stat.label} className="aegis-card p-4">
                <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Device List */}
          <div className="space-y-2">
            {enc.devices.map((dev) => (
              <div key={dev.id} className={cn("aegis-card p-4", dev.trustLevel === "blocked" && "border-destructive/15 opacity-70")}>
                <div className="flex items-center gap-4">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl",
                    dev.trustLevel === "trusted" ? "bg-success/10" :
                    dev.trustLevel === "verified" ? "bg-electric/10" :
                    dev.trustLevel === "blocked" ? "bg-destructive/10" : "bg-amber-400/10"
                  )}>
                    <div className={cn(
                      dev.trustLevel === "trusted" ? "text-success" :
                      dev.trustLevel === "verified" ? "text-electric" :
                      dev.trustLevel === "blocked" ? "text-destructive" : "text-amber-400"
                    )}>{deviceIcon(dev.type)}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground/90">{dev.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] text-muted-foreground/40">{dev.owner}</span>
                      <span className="text-[9px] text-muted-foreground/20">&bull;</span>
                      <span className="text-[9px] text-muted-foreground/40">{dev.os}</span>
                      {dev.browser && <>
                        <span className="text-[9px] text-muted-foreground/20">&bull;</span>
                        <span className="text-[9px] text-muted-foreground/40">{dev.browser}</span>
                      </>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {dev.biometricCapable && <Fingerprint className="h-3 w-3 text-purple-400/50" />}
                    {dev.hardwareKeyBound && <Key className="h-3 w-3 text-electric/50" />}
                    <div className="text-right">
                      <span className={cn("text-sm font-bold", dev.trustScore >= 90 ? "text-success" : dev.trustScore >= 70 ? "text-electric" : dev.trustScore > 0 ? "text-amber-400" : "text-destructive")}>{dev.trustScore}%</span>
                      <p className="text-[8px] text-muted-foreground/20">Trust</p>
                    </div>
                    <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded",
                      dev.trustLevel === "trusted" ? "bg-success/10 text-success" :
                      dev.trustLevel === "verified" ? "bg-electric/10 text-electric" :
                      dev.trustLevel === "blocked" ? "bg-destructive/10 text-destructive" : "bg-amber-400/10 text-amber-400"
                    )}>{dev.trustLevel}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-[9px] text-muted-foreground/30">
                  <span>{dev.location}</span>
                  <span>{dev.ipAddress}</span>
                  <span>Last seen: {formatRelativeTime(dev.lastSeen)}</span>
                  <span>Since: {formatRelativeTime(dev.firstSeen)}</span>
                  <span className="font-mono">FP: {dev.fingerprint}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
