"use client";

import { useState } from "react";
import { Lightbulb, User, Calendar, Tag, Filter, ArrowRight } from "lucide-react";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import { decisions } from "@/data/demo";

const impactColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  high: "bg-warning/10 text-warning",
  medium: "bg-electric/10 text-electric-glow",
  low: "bg-muted text-muted-foreground",
};

const statusColors: Record<string, string> = {
  proposed: "bg-info/10 text-info",
  approved: "bg-electric/10 text-electric-glow",
  implemented: "bg-success/10 text-success",
  reversed: "bg-destructive/10 text-destructive",
};

export default function DecisionsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterImpact, setFilterImpact] = useState<string>("all");

  const filtered = decisions.filter((d) => filterImpact === "all" || d.impact === filterImpact);
  const selected = decisions.find((d) => d.id === selectedId);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Decision Memory</h1>
          <p className="text-sm text-muted-foreground">Track and recall every strategic decision across the ecosystem</p>
        </div>
        <select
          value={filterImpact}
          onChange={(e) => setFilterImpact(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground"
        >
          <option value="all">All Impact</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {filtered.map((dec) => (
            <button
              key={dec.id}
              onClick={() => setSelectedId(dec.id)}
              className={cn(
                "w-full glass rounded-xl p-4 text-left transition-all hover:border-electric-dim/30",
                selectedId === dec.id && "border-electric-dim/30 ring-1 ring-electric/20"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-warning" />
                  <h3 className="text-sm font-semibold text-foreground">{dec.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded px-1.5 py-0.5 text-[10px] uppercase", statusColors[dec.status])}>{dec.status}</span>
                  <span className={cn("rounded px-1.5 py-0.5 text-[10px] uppercase", impactColors[dec.impact])}>{dec.impact}</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{dec.description}</p>
              <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {dec.madeBy}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(dec.date)}</span>
                <span>{dec.linkedProjects.length} linked projects</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {dec.tags.map((tag) => (
                  <span key={tag.id} className="rounded px-1.5 py-0.5 text-[9px]" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div>
          {selected ? (
            <div className="glass rounded-xl p-4 sticky top-24">
              <div className="border-b border-border pb-3">
                <h2 className="text-sm font-semibold text-foreground">{selected.title}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className={cn("rounded px-1.5 py-0.5 text-[10px] uppercase", statusColors[selected.status])}>{selected.status}</span>
                  <span className={cn("rounded px-1.5 py-0.5 text-[10px] uppercase", impactColors[selected.impact])}>{selected.impact} impact</span>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</p>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.description}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Rationale</p>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.rationale}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Made By</p>
                  <p className="mt-1 text-sm text-foreground">{selected.madeBy}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</p>
                  <p className="mt-1 text-sm text-foreground">{formatDate(selected.date)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Linked Projects</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selected.linkedProjects.map((proj) => (
                      <span key={proj} className="rounded bg-electric/10 px-2 py-0.5 text-[10px] text-electric-glow">{proj}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">People Involved</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selected.linkedPeople.map((person) => (
                      <span key={person} className="rounded bg-success/10 px-2 py-0.5 text-[10px] text-success">{person}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl p-6 text-center">
              <Lightbulb className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Select a decision to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
