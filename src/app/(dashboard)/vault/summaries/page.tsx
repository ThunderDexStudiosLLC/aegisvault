"use client";

import { Brain, RefreshCw, FileText, Clock, Users, Briefcase, BarChart3 } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { aiSummaries } from "@/data/demo";
import { useState, useEffect } from "react";
import { useOrb } from "@/contexts/OrbContext";

const typeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  executive: { icon: Briefcase, label: "Executive Briefing", color: "text-electric" },
  project: { icon: FileText, label: "Project Summary", color: "text-success" },
  relationship: { icon: Users, label: "Relationship Intel", color: "text-warning" },
  operational: { icon: BarChart3, label: "Operational Snapshot", color: "text-info" },
  timeline: { icon: Clock, label: "Timeline Summary", color: "text-electric-glow" },
  decision: { icon: Brain, label: "Decision Recap", color: "text-warning" },
};

export default function SummariesPage() {
  const [selectedId, setSelectedId] = useState(aiSummaries[0]?.id || "");
  const selected = aiSummaries.find((s) => s.id === selectedId);
  const { setState } = useOrb();

  useEffect(() => {
    setState("generating-summaries");
    const timer = setTimeout(() => setState("idle"), 3000);
    return () => clearTimeout(timer);
  }, [setState]);

  return (
    <div className="aegis-page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">AI Summaries</h1>
          <p className="text-sm text-muted-foreground/70">AI-generated intelligence briefings across all vault data</p>
        </div>
        <button className="flex items-center gap-2 aegis-btn-primary rounded-lg px-4 py-2 text-sm font-medium text-white">
          <RefreshCw className="h-4 w-4" />
          Generate New Summary
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          {aiSummaries.map((summary) => {
            const config = typeConfig[summary.type] || typeConfig.executive;
            const Icon = config.icon;
            return (
              <button
                key={summary.id}
                onClick={() => setSelectedId(summary.id)}
                className={cn(
                  "w-full rounded-xl p-4 text-left transition-all",
                  selectedId === summary.id ? "glass border-electric-dim/30" : "glass glass-hover"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4", config.color)} />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{config.label}</span>
                </div>
                <h3 className="mt-2 text-sm font-medium text-foreground">{summary.title}</h3>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{summary.sourceCount} sources</span>
                  <span>{Math.round(summary.confidence * 100)}% confidence</span>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{formatRelativeTime(summary.generatedAt)}</p>
              </button>
            );
          })}
        </div>

        <div className="col-span-2">
          {selected && (
            <div className="aegis-card rounded-xl p-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{selected.title}</h2>
                  <p className="text-xs text-muted-foreground">Generated {formatRelativeTime(selected.generatedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded bg-electric/10 px-2 py-1 text-[10px] text-electric-glow">
                    {selected.sourceCount} sources analyzed
                  </span>
                  <span className="rounded bg-success/10 px-2 py-1 text-[10px] text-success">
                    {Math.round(selected.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {selected.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
