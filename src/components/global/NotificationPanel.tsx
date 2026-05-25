"use client";

import { useState } from "react";
import {
  Bell, X, AlertTriangle, Shield, Bot, Activity,
  CheckCircle, Clock, Radio, Users, Zap,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: "security" | "ai" | "system" | "operational" | "identity";
  severity: "info" | "warning" | "critical";
  timestamp: string;
  read: boolean;
}

const notifications: NotificationItem[] = [
  { id: "n-1", title: "Critical: Supabase Auth CVE Detected", description: "CVE-2026-4821 affects your Supabase version. Immediate action required.", category: "security", severity: "critical", timestamp: "2026-05-25T04:00:00Z", read: false },
  { id: "n-2", title: "AI Agent: Restricted Recall Blocked", description: "AegisOSAI attempted founder-only memory access. Action denied.", category: "ai", severity: "warning", timestamp: "2026-05-24T16:00:00Z", read: false },
  { id: "n-3", title: "Credential Rotation Due", description: "OpenAI API key exceeds 30-day rotation policy. 47 days since last rotation.", category: "operational", severity: "warning", timestamp: "2026-05-24T10:00:00Z", read: false },
  { id: "n-4", title: "New Device Login: Sarah Chen", description: "Security Lead logged in from unregistered iPhone 16.", category: "identity", severity: "info", timestamp: "2026-05-24T09:30:00Z", read: true },
  { id: "n-5", title: "Datadog Alert Volume Spike", description: "ForgeOps monitoring generating 340% above normal alert volume.", category: "system", severity: "warning", timestamp: "2026-05-24T10:00:00Z", read: true },
  { id: "n-6", title: "Daily Digest Ready", description: "Your executive morning briefing is ready for review.", category: "operational", severity: "info", timestamp: "2026-05-25T05:00:00Z", read: false },
  { id: "n-7", title: "Credential Scan Blocked", description: "142 automated credential scanning attempts blocked from Amsterdam.", category: "security", severity: "critical", timestamp: "2026-05-25T01:00:00Z", read: false },
  { id: "n-8", title: "Ecosystem Health: 82%", description: "AegisPay and Asset Foundry below healthy thresholds.", category: "system", severity: "info", timestamp: "2026-05-25T04:30:00Z", read: true },
];

const categoryConfig = {
  security: { icon: Shield, color: "text-destructive" },
  ai: { icon: Bot, color: "text-purple-400" },
  system: { icon: Activity, color: "text-electric" },
  operational: { icon: Clock, color: "text-cyan-400" },
  identity: { icon: Users, color: "text-emerald-400" },
};

const sevConfig = {
  info: { color: "text-muted-foreground/50", bg: "" },
  warning: { color: "text-warning", bg: "bg-warning/[0.03]" },
  critical: { color: "text-destructive", bg: "bg-destructive/[0.03]" },
};

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" onClick={onClose}>
      <div className="absolute inset-0" />
      <div
        className="absolute right-6 top-14 w-[380px] max-h-[520px] rounded-2xl border border-border/20 bg-[#080c14]/95 shadow-2xl shadow-electric/5 backdrop-blur-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-electric/60" />
            <span className="text-sm font-semibold text-foreground/90">Notifications</span>
            {unread > 0 && <span className="rounded-full bg-electric/10 px-1.5 py-0.5 text-[9px] text-electric">{unread}</span>}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[10px] text-electric/50 hover:text-electric transition-colors">
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded hover:bg-white/[0.03] transition-colors">
              <X className="h-3.5 w-3.5 text-muted-foreground/40" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[440px]">
          {items.map((notif) => {
            const cat = categoryConfig[notif.category];
            const sev = sevConfig[notif.severity];
            const CatIcon = cat.icon;
            return (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 border-b border-border/5 transition-colors hover:bg-white/[0.01]",
                  !notif.read && "bg-electric/[0.02]",
                  sev.bg
                )}
              >
                <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5", `${cat.color}/10`.replace("text-", "bg-"))}>
                  <CatIcon className={cn("h-3.5 w-3.5", cat.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {!notif.read && <div className="h-1.5 w-1.5 rounded-full bg-electric shrink-0" />}
                    <span className={cn("text-xs font-semibold truncate", notif.read ? "text-foreground/60" : "text-foreground/90")}>{notif.title}</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/40 line-clamp-2">{notif.description}</p>
                  <p className="mt-1 text-[9px] text-muted-foreground/25">{formatRelativeTime(notif.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
