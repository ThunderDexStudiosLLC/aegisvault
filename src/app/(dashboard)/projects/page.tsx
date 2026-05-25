"use client";

import { useState } from "react";
import {
  FolderKanban, FileText, Lightbulb, Users, Clock, Tag,
  BarChart3, Filter, ArrowRight,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { projects } from "@/data/demo";
import type { Project } from "@/types";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  planning: "bg-electric/10 text-electric-glow",
  "on-hold": "bg-warning/10 text-warning",
  completed: "bg-muted text-muted-foreground",
  archived: "bg-muted text-muted-foreground",
};

const priorityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  high: "bg-warning/10 text-warning",
  medium: "bg-electric/10 text-electric-glow",
  low: "bg-muted text-muted-foreground",
};

export default function ProjectsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = projects.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    return true;
  });

  const selected = projects.find((p) => p.id === selectedId);

  return (
    <div className="aegis-page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Project Intelligence</h1>
          <p className="text-sm text-muted-foreground/70">{projects.length} projects tracked across the ecosystem</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 rounded-lg border border-border/30 bg-background/50 px-3 text-xs text-foreground"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="planning">Planning</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Project Cards */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {filtered.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedId(project.id)}
              className={cn(
                "glass rounded-xl p-4 text-left transition-all hover:border-electric-dim/30",
                selectedId === project.id && "border-electric-dim/30 ring-1 ring-electric/20"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-electric" />
                  <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                </div>
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] uppercase", statusColors[project.status])}>
                  {project.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{project.description}</p>

              <div className="mt-3 h-1.5 w-full rounded-full bg-secondary">
                <div className="h-1.5 rounded-full bg-electric transition-all" style={{ width: `${project.progress}%` }} />
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <span key={tag.id} className="rounded px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {project.noteCount} notes</span>
                <span className="flex items-center gap-1"><Lightbulb className="h-3 w-3" /> {project.decisionCount} decisions</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {project.team.length}</span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className={cn("rounded px-1 py-0.5 text-[9px] uppercase", priorityColors[project.priority])}>
                  {project.priority} priority
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Project Detail */}
        <div>
          {selected ? (
            <div className="aegis-card rounded-xl p-4 sticky top-24">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <FolderKanban className="h-5 w-5 text-electric" />
                <h2 className="text-lg font-semibold text-foreground">{selected.name}</h2>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</p>
                  <p className="mt-1 text-sm text-foreground">{selected.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                    <span className={cn("mt-1 inline-block rounded px-2 py-0.5 text-xs", statusColors[selected.status])}>
                      {selected.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Priority</p>
                    <span className={cn("mt-1 inline-block rounded px-2 py-0.5 text-xs", priorityColors[selected.priority])}>
                      {selected.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Started</p>
                  <p className="mt-1 text-sm text-foreground">{formatDate(selected.startDate)}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Progress</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-electric" style={{ width: `${selected.progress}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{selected.progress}% complete</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Team</p>
                  <div className="mt-2 space-y-2">
                    {selected.team.map((member) => (
                      <div key={member} className="flex items-center gap-2 rounded-lg border border-border/20 p-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-electric/10 text-electric text-[10px] font-bold">
                          {member.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="text-xs text-foreground">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Linked Products</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selected.linkedProducts.map((product) => (
                      <span key={product} className="rounded bg-electric/10 px-2 py-0.5 text-[10px] text-electric-glow">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tags</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selected.tags.map((tag) => (
                      <span key={tag.id} className="rounded px-2 py-0.5 text-[10px]" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/20 p-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">{selected.noteCount}</p>
                    <p className="text-[10px] text-muted-foreground">Notes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">{selected.decisionCount}</p>
                    <p className="text-[10px] text-muted-foreground">Decisions</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="aegis-card rounded-xl p-6 text-center">
              <FolderKanban className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground/70">Select a project to view intelligence</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
