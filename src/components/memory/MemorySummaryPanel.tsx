"use client";

import { BookOpen, Clock, Brain, ChevronRight, Sparkles } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { MemorySummary } from "@/types";

const summaryTypeConfig: Record<MemorySummary["type"], { label: string; color: string }> = {
  "project-continuity": { label: "Project Continuity", color: "text-electric" },
  "relationship-narrative": { label: "Relationship Narrative", color: "text-success" },
  "decision-chain": { label: "Decision Chain", color: "text-warning" },
  "operational-recap": { label: "Operational Recap", color: "text-info" },
  "strategic-evolution": { label: "Strategic Evolution", color: "text-electric-glow" },
};

interface MemorySummaryPanelProps {
  summaries: MemorySummary[];
  onMemoryClick?: (memoryId: string) => void;
}

export function MemorySummaryPanel({ summaries, onMemoryClick }: MemorySummaryPanelProps) {
  return (
    <div className="space-y-4">
      {summaries.map((summary) => {
        const config = summaryTypeConfig[summary.type];
        return (
          <div key={summary.id} className="aegis-card rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]", config.color)}>
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground/90">{summary.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground/40">
                    <span className={cn("rounded bg-white/[0.04] px-1.5 py-0.5", config.color)}>{config.label}</span>
                    <Clock className="h-2.5 w-2.5" />
                    <span>{formatDate(summary.timeRange.start)} — {formatDate(summary.timeRange.end)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-electric/40" />
                <span className="text-[10px] font-mono text-electric/50">{Math.round(summary.confidence * 100)}% confidence</span>
              </div>
            </div>

            <div className="text-xs text-foreground/70 leading-relaxed whitespace-pre-wrap">{summary.content}</div>

            <div className="mt-3 pt-3 border-t border-border/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/30">
                <Brain className="h-3 w-3" />
                <span>Generated {formatDate(summary.generatedAt)} from {summary.memoryIds.length} memories</span>
              </div>
              {onMemoryClick && (
                <div className="flex gap-1">
                  {summary.memoryIds.slice(0, 3).map((id) => (
                    <button
                      key={id}
                      onClick={() => onMemoryClick(id)}
                      className="flex items-center gap-0.5 rounded bg-electric/[0.06] px-1.5 py-0.5 text-[9px] text-electric/50 hover:text-electric transition-colors"
                    >
                      {id} <ChevronRight className="h-2.5 w-2.5" />
                    </button>
                  ))}
                  {summary.memoryIds.length > 3 && (
                    <span className="text-[9px] text-muted-foreground/30">+{summary.memoryIds.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
