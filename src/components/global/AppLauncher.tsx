"use client";

import {
  X, Shield, Globe, Cpu, Bot, CreditCard, Phone,
  Landmark, Box, Code, Layers, LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ecosystemApps = [
  { id: "aegisvault", name: "AegisVault", description: "Intelligence Vault", icon: Shield, color: "text-electric", bg: "bg-electric/10", status: "active" as const },
  { id: "aegisosai", name: "AegisOS AI", description: "AI Orchestration", icon: Bot, color: "text-purple-400", bg: "bg-purple-400/10", status: "development" as const },
  { id: "aegiscore", name: "Aegis Core", description: "Core Platform", icon: Layers, color: "text-cyan-400", bg: "bg-cyan-400/10", status: "planned" as const },
  { id: "forgeops", name: "ForgeOps AI", description: "DevOps Intelligence", icon: Cpu, color: "text-emerald-400", bg: "bg-emerald-400/10", status: "active" as const },
  { id: "signaldesk", name: "SignalDesk", description: "Communications Hub", icon: Phone, color: "text-blue-400", bg: "bg-blue-400/10", status: "development" as const },
  { id: "callaxis", name: "CallAxisAI", description: "Call Intelligence", icon: Phone, color: "text-amber-400", bg: "bg-amber-400/10", status: "active" as const },
  { id: "aegispay", name: "AegisPay", description: "Payment Platform", icon: CreditCard, color: "text-success", bg: "bg-success/10", status: "planned" as const },
  { id: "civicops", name: "CivicOps AI", description: "Civic Technology", icon: Landmark, color: "text-indigo-400", bg: "bg-indigo-400/10", status: "development" as const },
  { id: "civicfrontier", name: "Civic Frontier", description: "Civic Platform", icon: Globe, color: "text-teal-400", bg: "bg-teal-400/10", status: "planned" as const },
  { id: "assetfoundry", name: "Asset Foundry", description: "Asset Generation", icon: Box, color: "text-orange-400", bg: "bg-orange-400/10", status: "planned" as const },
  { id: "thundercode", name: "ThunderCode", description: "AI Code Engine", icon: Code, color: "text-violet-400", bg: "bg-violet-400/10", status: "development" as const },
];

const statusColors = {
  active: "bg-success/50",
  development: "bg-warning/50",
  planned: "bg-muted-foreground/20",
};

const workspaces = [
  { id: "ws-1", name: "IronReserve Holdings", role: "Founder", active: true },
  { id: "ws-2", name: "KahmannAI Labs", role: "Owner", active: false },
  { id: "ws-3", name: "ThunderDex Studios", role: "Admin", active: false },
];

export function AppLauncher({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" onClick={onClose}>
      <div className="absolute inset-0" />
      <div
        className="absolute right-6 top-14 w-[440px] rounded-2xl border border-border/20 bg-[#080c14]/95 shadow-2xl shadow-electric/5 backdrop-blur-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-electric/60" />
            <span className="text-sm font-semibold text-foreground/90">Aegis Ecosystem</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/[0.03] transition-colors">
            <X className="h-3.5 w-3.5 text-muted-foreground/40" />
          </button>
        </div>

        {/* Apps Grid */}
        <div className="p-3">
          <p className="px-1 pb-2 text-[9px] font-mono uppercase tracking-wider text-muted-foreground/30">Products</p>
          <div className="grid grid-cols-3 gap-1.5">
            {ecosystemApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all hover:bg-white/[0.03]",
                    app.id === "aegisvault" && "bg-electric/[0.04] ring-1 ring-electric/10"
                  )}
                >
                  <div className="relative">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", app.bg)}>
                      <Icon className={cn("h-5 w-5", app.color)} />
                    </div>
                    <div className={cn("absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-[#080c14]", statusColors[app.status])} />
                  </div>
                  <span className="text-[10px] font-medium text-foreground/70 text-center leading-tight">{app.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className="border-t border-border/10 p-3">
          <p className="px-1 pb-2 text-[9px] font-mono uppercase tracking-wider text-muted-foreground/30">Workspaces</p>
          <div className="space-y-1">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                  ws.active ? "bg-electric/[0.04] text-foreground" : "text-foreground/50 hover:bg-white/[0.02]"
                )}
              >
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold", ws.active ? "bg-electric/10 text-electric" : "bg-white/[0.03] text-muted-foreground/40")}>
                  {ws.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <span className="text-xs">{ws.name}</span>
                  <p className="text-[9px] text-muted-foreground/30">{ws.role}</p>
                </div>
                {ws.active && <div className="h-1.5 w-1.5 rounded-full bg-success" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
