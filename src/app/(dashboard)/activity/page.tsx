"use client";

import { useState, useEffect } from "react";
import {
  Activity, FileText, FolderKanban, Calendar, Lightbulb,
  Users, Shield, Filter, Search,
} from "lucide-react";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import { activityLogs } from "@/data/demo";
import { useOrb } from "@/contexts/OrbContext";

const entityIcons: Record<string, React.ElementType> = {
  document: FileText,
  note: Shield,
  project: FolderKanban,
  meeting: Calendar,
  decision: Lightbulb,
  relationship: Users,
};

const actionColors: Record<string, string> = {
  created: "text-success",
  updated: "text-electric-glow",
  uploaded: "text-electric",
  decided: "text-warning",
  completed: "text-success",
  launched: "text-success",
  "met with": "text-info",
  connected: "text-info",
};

export default function ActivityPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { setState } = useOrb();

  useEffect(() => { setState("indexing"); const t = setTimeout(() => setState("idle"), 3000); return () => clearTimeout(t); }, [setState]);

  const filtered = activityLogs.filter((log) => {
    if (filterType !== "all" && log.entityType !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!log.entity.toLowerCase().includes(q) && !log.action.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, log) => {
    const dateKey = formatDate(log.timestamp);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(log);
    return acc;
  }, {});

  return (
    <div className="aegis-page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Activity Log</h1>
          <p className="text-sm text-muted-foreground/70">Complete audit trail of all vault activity</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border/30 bg-background/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-electric focus:outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-9 rounded-lg border border-border/30 bg-background/50 px-3 text-xs text-foreground"
        >
          <option value="all">All Types</option>
          <option value="document">Documents</option>
          <option value="note">Notes</option>
          <option value="project">Projects</option>
          <option value="meeting">Meetings</option>
          <option value="decision">Decisions</option>
          <option value="relationship">Relationships</option>
        </select>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

        {Object.entries(grouped).map(([dateKey, logs]) => (
          <div key={dateKey} className="mb-8">
            <div className="relative mb-4 flex items-center gap-3">
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
                <Activity className="h-5 w-5 text-electric" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{dateKey}</h3>
              <span className="text-xs text-muted-foreground">({logs.length} events)</span>
            </div>

            <div className="ml-16 space-y-3">
              {logs.map((log) => {
                const Icon = entityIcons[log.entityType] || Activity;
                return (
                  <div key={log.id} className="glass-interactive rounded-xl p-3 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-electric/10">
                        <Icon className="h-4 w-4 text-electric" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          <span className="text-electric-glow">{log.user}</span>{" "}
                          <span className={cn("font-medium", actionColors[log.action] || "text-foreground")}>{log.action}</span>{" "}
                          {log.entity}
                        </p>
                        {log.details && <p className="mt-1 text-xs text-muted-foreground">{log.details}</p>}
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span>{formatRelativeTime(log.timestamp)}</span>
                          <span className="rounded bg-white/[0.04] px-1.5 py-0.5 uppercase">{log.entityType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
