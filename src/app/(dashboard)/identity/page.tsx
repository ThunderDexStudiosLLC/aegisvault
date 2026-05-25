"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Shield, Users, Key, Activity, AlertTriangle, CheckCircle,
  Clock, Lock, Unlock, Fingerprint, Monitor, Smartphone,
  Tablet, Server, Bot, Eye, RefreshCw, Zap, Globe,
  ShieldCheck, ShieldAlert, UserCheck, UserX, KeyRound,
  FileKey, HardDrive, Sparkles, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useIdentity } from "@/contexts/IdentityContext";
import { useOrb } from "@/contexts/OrbContext";
import type {
  IdentityProfile, AccessRole, StoredCredential, AccessEvent,
  EmergencyContact, CredentialType,
} from "@/types";

const deviceIcons: Record<string, React.ElementType> = {
  desktop: Monitor, mobile: Smartphone, tablet: Tablet, server: Server, "ai-agent": Bot,
};

const credentialIcons: Record<CredentialType, React.ElementType> = {
  password: Lock, "api-key": Key, "oauth-token": KeyRound, certificate: FileKey,
  "ssh-key": HardDrive, "recovery-code": ShieldCheck, "infra-secret": Shield,
};

const severityConfig: Record<string, { color: string; bg: string }> = {
  info: { color: "text-electric", bg: "bg-electric/10" },
  warning: { color: "text-warning", bg: "bg-warning/10" },
  critical: { color: "text-destructive", bg: "bg-destructive/10" },
};

const strengthConfig: Record<string, { color: string; width: string }> = {
  weak: { color: "bg-destructive", width: "25%" },
  fair: { color: "bg-warning", width: "50%" },
  strong: { color: "bg-electric", width: "75%" },
  excellent: { color: "bg-success", width: "100%" },
};

type ViewMode = "dashboard" | "roles" | "credentials" | "monitoring" | "emergency";

export default function IdentityPage() {
  const engine = useIdentity();
  const { setState } = useOrb();
  const [view, setView] = useState<ViewMode>("dashboard");
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [credFilter, setCredFilter] = useState<CredentialType | "all">("all");

  const stats = useMemo(() => engine.getStats(), [engine]);
  const profiles = useMemo(() => engine.getProfiles(), [engine]);
  const roles = useMemo(() => engine.getRoles(), [engine]);
  const credentials = useMemo(() => engine.getCredentials(), [engine]);
  const events = useMemo(() => engine.getEvents(), [engine]);
  const contacts = useMemo(() => engine.getEmergencyContacts(), [engine]);
  const posture = useMemo(() => engine.getSecurityPosture(), [engine]);
  const rotationDue = useMemo(() => engine.getRotationDueCredentials(), [engine]);
  const unresolvedEvents = useMemo(() => engine.getUnresolvedEvents(), [engine]);

  useEffect(() => {
    setState("synchronization");
    const timer = setTimeout(() => setState("idle"), 3000);
    return () => clearTimeout(timer);
  }, [setState]);

  const filteredCreds = credFilter === "all" ? credentials : credentials.filter((c) => c.type === credFilter);

  return (
    <div className="aegis-page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/20">
            <Fingerprint className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Identity & Access</h1>
            <p className="text-sm text-muted-foreground/60">Secure identity orchestration, credential governance, and access infrastructure</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unresolvedEvents.length > 0 && (
            <div className="aegis-badge bg-destructive/10 text-destructive">
              <AlertTriangle className="h-3 w-3" />
              {unresolvedEvents.length} unresolved
            </div>
          )}
          {rotationDue.length > 0 && (
            <div className="aegis-badge bg-warning/10 text-warning">
              <RefreshCw className="h-3 w-3" />
              {rotationDue.length} rotation due
            </div>
          )}
          <div className="aegis-badge aegis-badge-electric">
            <Shield className="h-3 w-3" />
            Score: {posture.overallScore}/100
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: "Identities", value: stats.totalIdentities, sub: `${stats.activeIdentities} active`, icon: Users, color: "text-electric" },
          { label: "Active Sessions", value: stats.activeSessions, icon: Activity, color: "text-success" },
          { label: "MFA Enabled", value: `${stats.mfaEnabled}/${stats.totalIdentities}`, icon: ShieldCheck, color: "text-emerald-400" },
          { label: "Credentials", value: stats.totalCredentials, sub: `${stats.rotationsDue} rotate`, icon: Key, color: "text-amber-400" },
          { label: "Trusted Devices", value: stats.totalDevices, icon: Monitor, color: "text-electric-glow" },
          { label: "Security Score", value: `${posture.overallScore}%`, icon: Shield, color: posture.overallScore >= 80 ? "text-success" : "text-warning" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="aegis-card p-3 text-center">
              <Icon className={cn("h-4 w-4 mx-auto", stat.color)} />
              <p className="mt-1 text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/40">{stat.label}</p>
              {stat.sub && <p className="text-[9px] text-muted-foreground/30">{stat.sub}</p>}
            </div>
          );
        })}
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-white/[0.02] p-1">
        {[
          { key: "dashboard" as ViewMode, label: "Identity Dashboard", icon: Users },
          { key: "roles" as ViewMode, label: "Roles & Permissions", icon: ShieldCheck },
          { key: "credentials" as ViewMode, label: "Credential Vault", icon: Key, count: rotationDue.length },
          { key: "monitoring" as ViewMode, label: "Access Monitoring", icon: Eye, count: unresolvedEvents.length },
          { key: "emergency" as ViewMode, label: "Emergency Continuity", icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all",
                view === tab.key
                  ? "bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.08)]"
                  : "text-muted-foreground/50 hover:text-foreground/70"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-warning/20 px-1 text-[9px] font-bold text-warning">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============ IDENTITY DASHBOARD ============ */}
      {view === "dashboard" && (
        <div className="space-y-6">
          {/* Security Posture */}
          <div className="aegis-card rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/90 mb-4">
              <Shield className="h-4 w-4 text-emerald-400/70" />
              Security Posture
            </h3>
            <div className="grid grid-cols-5 gap-4 mb-4">
              {[
                { label: "MFA Adoption", value: posture.mfaAdoption, color: posture.mfaAdoption >= 80 ? "bg-success" : "bg-warning" },
                { label: "Credential Health", value: posture.credentialHealth, color: "bg-success" },
                { label: "Device Trust", value: posture.deviceTrust, color: "bg-success" },
                { label: "Access Hygiene", value: posture.accessHygiene, color: posture.accessHygiene >= 80 ? "bg-success" : "bg-warning" },
                { label: "Anomaly Rate", value: Math.round((1 - posture.anomalyRate) * 100), color: "bg-success" },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground/50">{metric.label}</span>
                    <span className="text-[10px] font-mono text-foreground/70">{metric.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.04]">
                    <div className={cn("h-1.5 rounded-full transition-all", metric.color)} style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {posture.recommendations.length > 0 && (
              <div className="border-t border-border/10 pt-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Recommendations</p>
                <div className="space-y-1.5">
                  {posture.recommendations.slice(0, 4).map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Sparkles className="h-3 w-3 mt-0.5 shrink-0 text-warning/40" />
                      <span className="text-[11px] text-foreground/60">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Identity Profiles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/90">Active Identities</h3>
            {profiles.map((profile) => {
              const isExpanded = expandedProfile === profile.id;
              const DeviceIcon = deviceIcons[profile.trustedDevices[0]?.type || "desktop"] || Monitor;
              return (
                <div key={profile.id} className="aegis-card rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedProfile(isExpanded ? null : profile.id)}
                    className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/[0.005] transition-colors"
                  >
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1",
                      profile.status === "active" ? "bg-emerald-500/10 ring-emerald-500/20" :
                      profile.status === "pending" ? "bg-warning/10 ring-warning/20" :
                      "bg-white/[0.04] ring-white/[0.06]"
                    )}>
                      {profile.department === "AI Systems" ? <Bot className="h-5 w-5 text-emerald-400" /> : <Users className="h-5 w-5 text-emerald-400/70" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground/90">{profile.displayName}</span>
                        <span className={cn("rounded px-1.5 py-0.5 text-[9px]",
                          profile.status === "active" ? "bg-success/10 text-success" :
                          profile.status === "pending" ? "bg-warning/10 text-warning" :
                          "bg-white/[0.04] text-muted-foreground"
                        )}>{profile.status}</span>
                        {profile.mfaEnabled && <ShieldCheck className="h-3 w-3 text-emerald-400/50" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground/50">{profile.role} &bull; {profile.department} &bull; {profile.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-mono text-foreground/70">{profile.securityScore}%</p>
                        <p className="text-[9px] text-muted-foreground/30">security</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-foreground/70">{profile.trustedDevices.length}</p>
                        <p className="text-[9px] text-muted-foreground/30">devices</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-foreground/70">{profile.activeSessions.filter((s) => s.status === "active").length}</p>
                        <p className="text-[9px] text-muted-foreground/30">sessions</p>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border/10 px-5 py-4 space-y-4 animate-fade-in">
                      {/* Permissions */}
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Permissions</p>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.permissions.map((perm) => (
                            <span key={perm} className="rounded bg-white/[0.03] px-2 py-0.5 text-[9px] font-mono text-foreground/50">{perm}</span>
                          ))}
                        </div>
                      </div>

                      {/* Trusted Devices */}
                      {profile.trustedDevices.length > 0 && (
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Trusted Devices</p>
                          <div className="space-y-1.5">
                            {profile.trustedDevices.map((device) => {
                              const DIcon = deviceIcons[device.type] || Monitor;
                              return (
                                <div key={device.id} className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-3 py-2">
                                  <DIcon className="h-3.5 w-3.5 text-emerald-400/50 shrink-0" />
                                  <span className="text-xs text-foreground/70 flex-1">{device.name}</span>
                                  <span className="text-[9px] text-muted-foreground/30">{device.os}</span>
                                  {device.location && <span className="text-[9px] text-muted-foreground/30">{device.location}</span>}
                                  <span className="text-[9px] text-muted-foreground/30">{formatRelativeTime(device.lastActive)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* MFA */}
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground/30">
                        <span>MFA: {profile.mfaEnabled ? profile.mfaMethods.join(", ") : "Disabled"}</span>
                        <span>Workspaces: {profile.workspaceIds.length}</span>
                        <span>Last login: {formatRelativeTime(profile.lastLogin)}</span>
                        <span>Created: {new Date(profile.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ ROLES & PERMISSIONS ============ */}
      {view === "roles" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Role & Permission Center</h2>
            <p className="text-xs text-muted-foreground/40">Custom roles, permission assignment, AI agent scopes, and department-level access policies</p>
          </div>

          {roles.map((role) => {
            const isExpanded = expandedRole === role.id;
            const members = profiles.filter((p) => {
              if (role.name === "Founder") return p.role === "Founder & CEO";
              if (role.name === "Executive") return p.department === "Executive" || p.role === "CTO";
              if (role.name === "Security Admin") return p.department === "Security";
              if (role.name === "Engineer") return p.department === "Engineering";
              if (role.name === "Operations") return p.department === "Operations";
              if (role.name === "AI Agent") return p.department === "AI Systems";
              return false;
            });

            return (
              <div key={role.id} className="aegis-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                  className="flex w-full items-center gap-4 p-5 text-left hover:bg-white/[0.005] transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/[0.06]" style={{ backgroundColor: role.color + "15" }}>
                    <ShieldCheck className="h-5 w-5" style={{ color: role.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground/90">{role.name}</h3>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]",
                        role.level === "system" ? "bg-destructive/10 text-destructive" :
                        role.level === "organization" ? "bg-purple-500/10 text-purple-400" :
                        role.level === "ai-agent" ? "bg-success/10 text-success" :
                        "bg-electric/10 text-electric"
                      )}>{role.level}</span>
                      {role.isSystem && <span className="text-[9px] text-muted-foreground/30 bg-white/[0.03] rounded px-1.5 py-0.5">system</span>}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground/50">{role.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-foreground/70">{members.length}</p>
                      <p className="text-[9px] text-muted-foreground/30">members</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-foreground/70">{role.permissions.length}</p>
                      <p className="text-[9px] text-muted-foreground/30">perms</p>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/30" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/30" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border/10 px-5 py-4 space-y-4 animate-fade-in">
                    {/* Permissions table */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Permissions</p>
                      <div className="rounded-lg border border-border/10 overflow-hidden">
                        <div className="grid grid-cols-4 gap-px bg-border/10 text-[9px] font-mono uppercase tracking-wider text-muted-foreground/40">
                          <div className="bg-[#030509] px-3 py-2">Resource</div>
                          <div className="bg-[#030509] px-3 py-2">Actions</div>
                          <div className="bg-[#030509] px-3 py-2">Scope</div>
                          <div className="bg-[#030509] px-3 py-2">Conditions</div>
                        </div>
                        {role.permissions.map((perm) => (
                          <div key={perm.id} className="grid grid-cols-4 gap-px bg-border/5">
                            <div className="bg-[#030509] px-3 py-2 text-xs text-foreground/70">{perm.resource}</div>
                            <div className="bg-[#030509] px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {perm.actions.map((a) => (
                                  <span key={a} className={cn("rounded px-1 py-0.5 text-[9px]",
                                    a === "admin" ? "bg-destructive/10 text-destructive" :
                                    a === "delete" ? "bg-warning/10 text-warning" :
                                    a === "write" ? "bg-electric/10 text-electric" :
                                    a === "execute" ? "bg-success/10 text-success" :
                                    "bg-white/[0.04] text-muted-foreground"
                                  )}>{a}</span>
                                ))}
                              </div>
                            </div>
                            <div className="bg-[#030509] px-3 py-2 text-[10px] text-foreground/50">{perm.scope}</div>
                            <div className="bg-[#030509] px-3 py-2 text-[10px] text-muted-foreground/30">{perm.conditions || "—"}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Members */}
                    {members.length > 0 && (
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Members</p>
                        <div className="flex flex-wrap gap-2">
                          {members.map((m) => (
                            <div key={m.id} className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-1.5">
                              {m.department === "AI Systems" ? <Bot className="h-3 w-3 text-emerald-400/50" /> : <UserCheck className="h-3 w-3 text-emerald-400/50" />}
                              <span className="text-[10px] text-foreground/70">{m.displayName}</span>
                              <span className={cn("text-[9px]", m.status === "active" ? "text-success/50" : "text-warning/50")}>{m.status}</span>
                            </div>
                          ))}
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

      {/* ============ CREDENTIAL VAULT ============ */}
      {view === "credentials" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground/90">Credential Vault</h2>
              <p className="text-xs text-muted-foreground/40">Encrypted credential storage with rotation tracking and usage monitoring</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-white/[0.02] p-0.5">
              {(["all", "api-key", "password", "oauth-token", "certificate", "ssh-key", "recovery-code", "infra-secret"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setCredFilter(type)}
                  className={cn("rounded px-2.5 py-1 text-[10px] transition-all",
                    credFilter === type ? "bg-emerald-500/10 text-emerald-400" : "text-muted-foreground/40 hover:text-foreground/60"
                  )}
                >
                  {type === "all" ? "All" : type.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredCreds.map((cred) => {
              const CredIcon = credentialIcons[cred.type] || Key;
              const strength = cred.strength ? strengthConfig[cred.strength] : null;
              const isExpired = cred.expiresAt && new Date(cred.expiresAt) < new Date();
              const isRotationDue = cred.rotationDue && new Date(cred.rotationDue) < new Date();

              return (
                <div key={cred.id} className="aegis-card rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]">
                      <CredIcon className="h-4 w-4 text-emerald-400/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground/90">{cred.name}</span>
                        <span className="rounded bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-muted-foreground/40">{cred.type.replace(/-/g, " ")}</span>
                        {cred.encrypted && <Lock className="h-3 w-3 text-success/40" />}
                        {isRotationDue && <span className="rounded bg-warning/10 px-1.5 py-0.5 text-[9px] text-warning">rotation due</span>}
                        {isExpired && <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[9px] text-destructive">expired</span>}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground/40">
                        <span>{cred.service}</span>
                        {cred.username && <span className="font-mono">{cred.username}</span>}
                        <span>{cred.usageCount} uses</span>
                        {cred.lastUsed && <span>Last: {formatRelativeTime(cred.lastUsed)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {strength && (
                        <div className="w-16">
                          <div className="h-1 rounded-full bg-white/[0.04]">
                            <div className={cn("h-1 rounded-full", strength.color)} style={{ width: strength.width }} />
                          </div>
                          <p className="mt-0.5 text-[8px] text-center text-muted-foreground/30">{cred.strength}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {cred.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded bg-white/[0.03] px-1.5 py-0.5 text-[8px] text-muted-foreground/30">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ ACCESS MONITORING ============ */}
      {view === "monitoring" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Access Monitoring</h2>
            <p className="text-xs text-muted-foreground/40">Authentication events, anomaly detection, permission changes, and geographic awareness</p>
          </div>

          {/* Unresolved first */}
          {unresolvedEvents.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-destructive/50">Unresolved Events</p>
              {unresolvedEvents.map((event) => renderEvent(event))}
            </div>
          )}

          {/* All events */}
          <div className="space-y-2">
            {unresolvedEvents.length > 0 && <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 mt-4">All Events</p>}
            {events.filter((e) => e.resolved).map((event) => renderEvent(event))}
          </div>
        </div>
      )}

      {/* ============ EMERGENCY CONTINUITY ============ */}
      {view === "emergency" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Emergency Continuity Layer</h2>
            <p className="text-xs text-muted-foreground/40">Recovery contacts, delegated access, founder continuity protection, and organizational recovery workflows</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Lock All Sessions", icon: Lock, color: "text-destructive", desc: "Immediately terminate all active sessions" },
              { label: "Rotate All Keys", icon: RefreshCw, color: "text-warning", desc: "Begin emergency key rotation for all credentials" },
              { label: "Generate Security Report", icon: Sparkles, color: "text-electric", desc: "Create comprehensive security audit summary" },
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

          {/* Emergency Contacts */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/90">Recovery & Continuity Contacts</h3>
            {contacts.map((contact) => {
              const roleColors: Record<string, string> = {
                "delegated-admin": "text-electric bg-electric/10",
                "operational-backup": "text-warning bg-warning/10",
                "legal-custodian": "text-purple-400 bg-purple-400/10",
                "recovery-contact": "text-emerald-400 bg-emerald-400/10",
              };
              const accessColors: Record<string, string> = {
                full: "text-destructive",
                limited: "text-warning",
                "read-only": "text-electric",
                "emergency-only": "text-muted-foreground",
              };

              return (
                <div key={contact.id} className="aegis-card rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/15">
                      <UserCheck className="h-5 w-5 text-emerald-400/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground/90">{contact.name}</span>
                        <span className={cn("rounded px-1.5 py-0.5 text-[9px]", roleColors[contact.role])}>
                          {contact.role.replace(/-/g, " ")}
                        </span>
                        {contact.verified ? (
                          <span className="text-[9px] text-success/50 flex items-center gap-0.5"><CheckCircle className="h-2.5 w-2.5" /> verified</span>
                        ) : (
                          <span className="text-[9px] text-warning/50 flex items-center gap-0.5"><AlertTriangle className="h-2.5 w-2.5" /> unverified</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground/50">{contact.email}{contact.phone ? ` • ${contact.phone}` : ""}</p>

                      <div className="mt-3 rounded-lg bg-white/[0.02] border border-border/10 px-3 py-2">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-1">Activation Condition</p>
                        <p className="text-xs text-foreground/60">{contact.activationCondition}</p>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[9px] text-muted-foreground/30">
                        <span className={accessColors[contact.accessLevel]}>Access: {contact.accessLevel}</span>
                        <span>Added: {new Date(contact.addedAt).toLocaleDateString()}</span>
                        {contact.lastVerified && <span>Verified: {formatRelativeTime(contact.lastVerified)}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Founder Continuity */}
          <div className="aegis-card rounded-xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground/90 mb-3">
              <ShieldAlert className="h-4 w-4 text-emerald-400/70" />
              Founder Continuity Protection
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white/[0.02] border border-border/10 p-4">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Succession Plan</p>
                <p className="text-xs text-foreground/60">If founder is unavailable for 72+ hours, Alex Rivera (CTO) receives limited delegated admin access. Sarah Chen (Security Lead) can audit and monitor but not modify.</p>
                <p className="mt-2 text-[9px] text-success/50 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Contacts verified and active</p>
              </div>
              <div className="rounded-lg bg-white/[0.02] border border-border/10 p-4">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Recovery Credentials</p>
                <p className="text-xs text-foreground/60">AWS root recovery code, database master password, and TLS certificates stored in encrypted vault. Only accessible by Founder role or verified emergency contacts.</p>
                <p className="mt-2 text-[9px] text-electric/50 flex items-center gap-1"><Lock className="h-3 w-3" /> AES-256 encrypted at rest</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderEvent(event: AccessEvent) {
  const config = severityConfig[event.severity];
  const typeIcons: Record<string, React.ElementType> = {
    login: Unlock, logout: Lock, "failed-login": UserX, "permission-change": ShieldCheck,
    "credential-access": Key, "mfa-challenge": Fingerprint, "session-created": Activity,
    anomaly: AlertTriangle, "key-rotation": RefreshCw,
  };
  const EventIcon = typeIcons[event.type] || Activity;

  return (
    <div key={event.id} className={cn("aegis-card rounded-xl p-4", !event.resolved && "ring-1 ring-destructive/20")}>
      <div className="flex items-start gap-3">
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.bg)}>
          <EventIcon className={cn("h-4 w-4", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground/90">{event.identityName}</span>
            <span className={cn("rounded px-1.5 py-0.5 text-[9px]", config.bg, config.color)}>{event.type.replace(/-/g, " ")}</span>
            {!event.resolved && <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[9px] text-destructive">unresolved</span>}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground/50">{event.description}</p>
          <div className="mt-1 flex items-center gap-3 text-[9px] text-muted-foreground/30">
            <span className="font-mono">{event.ipAddress}</span>
            {event.location && <span className="flex items-center gap-0.5"><Globe className="h-2.5 w-2.5" />{event.location}</span>}
            {event.deviceInfo && <span>{event.deviceInfo}</span>}
            <span>{formatRelativeTime(event.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
