"use client";

import { useState } from "react";
import {
  Plug, Brain, Server, Hammer, Radio, Phone, Crown,
  Cloud, Cpu, ScanLine, Mic, Search, MessageSquare, Users,
  Box, Check, Clock, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { integrations } from "@/data/demo";

const iconMap: Record<string, React.ElementType> = {
  brain: Brain, server: Server, hammer: Hammer, radio: Radio,
  phone: Phone, crown: Crown, cloud: Cloud, cpu: Cpu,
  scan: ScanLine, mic: Mic, search: Search, box: Box,
  "message-square": MessageSquare, users: Users,
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  connected: { label: "Connected", color: "bg-success/10 text-success", icon: Check },
  available: { label: "Available", color: "bg-electric/10 text-electric-glow", icon: ArrowRight },
  "coming-soon": { label: "Coming Soon", color: "bg-muted text-muted-foreground", icon: Clock },
};

const categories = [
  { key: "all", label: "All" },
  { key: "ecosystem", label: "KahmannAI Ecosystem" },
  { key: "storage", label: "Storage" },
  { key: "ai", label: "AI & ML" },
  { key: "communication", label: "Communication" },
];

export default function IntegrationsPage() {
  const [filterCategory, setFilterCategory] = useState("all");

  const filtered = integrations.filter((i) => filterCategory === "all" || i.category === filterCategory);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground">Connect AegisVault with your ecosystem and third-party services</p>
        </div>
      </div>

      <div className="flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(cat.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-xs font-medium transition-colors",
              filterCategory === cat.key ? "bg-electric text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((integration) => {
          const Icon = iconMap[integration.icon] || Plug;
          const status = statusConfig[integration.status];
          const StatusIcon = status.icon;

          return (
            <div key={integration.id} className="glass glass-hover rounded-xl p-4 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-electric/10">
                  <Icon className="h-6 w-6 text-electric" />
                </div>
                <span className={cn("flex items-center gap-1 rounded px-2 py-0.5 text-[10px]", status.color)}>
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-semibold text-foreground">{integration.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{integration.description}</p>

              <div className="mt-4">
                {integration.status === "connected" && (
                  <button className="w-full rounded-lg border border-border py-2 text-xs text-muted-foreground hover:text-foreground">
                    Configure
                  </button>
                )}
                {integration.status === "available" && (
                  <button className="w-full rounded-lg bg-electric py-2 text-xs font-medium text-white hover:bg-electric-glow">
                    Connect
                  </button>
                )}
                {integration.status === "coming-soon" && (
                  <button disabled className="w-full rounded-lg border border-border py-2 text-xs text-muted-foreground opacity-50">
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
