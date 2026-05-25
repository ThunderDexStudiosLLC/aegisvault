"use client";

import { useState } from "react";
import {
  Users, Mail, Phone, Building, Star, MessageSquare,
  Calendar, Tag, ExternalLink, Search,
} from "lucide-react";
import { cn, formatRelativeTime, formatDate } from "@/lib/utils";
import { relationships } from "@/data/demo";
import type { Relationship } from "@/types";

const typeColors: Record<string, string> = {
  investor: "bg-warning/10 text-warning",
  partner: "bg-electric/10 text-electric-glow",
  vendor: "bg-muted text-muted-foreground",
  collaborator: "bg-success/10 text-success",
  advisor: "bg-info/10 text-info",
  client: "bg-destructive/10 text-destructive",
};

const importanceColors: Record<string, string> = {
  critical: "text-destructive",
  high: "text-warning",
  medium: "text-electric",
  low: "text-muted-foreground",
};

export default function RelationshipsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = relationships.filter((r) => {
    if (filterType !== "all" && r.type !== filterType) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.company.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selected = relationships.find((r) => r.id === selectedId);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relationship Intelligence</h1>
          <p className="text-sm text-muted-foreground">Track strategic relationships across the ecosystem</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-electric focus:outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground"
        >
          <option value="all">All Types</option>
          <option value="investor">Investors</option>
          <option value="partner">Partners</option>
          <option value="collaborator">Collaborators</option>
          <option value="advisor">Advisors</option>
          <option value="vendor">Vendors</option>
          <option value="client">Clients</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-3">
          {filtered.map((rel) => (
            <button
              key={rel.id}
              onClick={() => setSelectedId(rel.id)}
              className={cn(
                "w-full glass rounded-xl p-4 text-left transition-all hover:border-electric-dim/30",
                selectedId === rel.id && "border-electric-dim/30 ring-1 ring-electric/20"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-electric/10 text-electric font-bold">
                  {rel.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{rel.name}</h3>
                    <span className={cn("rounded px-1.5 py-0.5 text-[10px] uppercase", typeColors[rel.type])}>
                      {rel.type}
                    </span>
                    <Star className={cn("h-3.5 w-3.5", importanceColors[rel.strategicImportance])} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {rel.role} &bull; <span className="text-electric-glow">{rel.company}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>Last contact: {formatRelativeTime(rel.lastContact)}</span>
                    <span>{rel.linkedProjects.length} linked projects</span>
                    <span>{rel.communicationHistory.length} interactions</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {rel.tags.map((tag) => (
                      <span key={tag.id} className="rounded px-1.5 py-0.5 text-[9px]" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div>
          {selected ? (
            <div className="glass rounded-xl p-4 sticky top-24">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-electric/10 text-electric text-lg font-bold">
                  {selected.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{selected.name}</h2>
                  <p className="text-xs text-muted-foreground">{selected.role}</p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Building className="h-4 w-4 text-electric" />
                  {selected.company}
                </div>
                {selected.email && (
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Mail className="h-4 w-4 text-electric" />
                    {selected.email}
                  </div>
                )}

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Strategic Importance</p>
                  <div className="mt-1 flex items-center gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className={cn("h-4 w-4", i <= (selected.strategicImportance === "critical" ? 4 : selected.strategicImportance === "high" ? 3 : selected.strategicImportance === "medium" ? 2 : 1) ? "text-warning fill-warning" : "text-muted")}
                      />
                    ))}
                    <span className="text-xs capitalize text-muted-foreground">{selected.strategicImportance}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Notes</p>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.notes}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Linked Projects</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selected.linkedProjects.map((proj) => (
                      <span key={proj} className="rounded bg-electric/10 px-2 py-0.5 text-[10px] text-electric-glow">{proj}</span>
                    ))}
                  </div>
                </div>

                {selected.communicationHistory.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Communication History</p>
                    <div className="mt-2 space-y-2">
                      {selected.communicationHistory.map((comm) => (
                        <div key={comm.id} className="rounded-lg border border-border p-2">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] text-muted-foreground">{comm.type}</span>
                            <span className="text-[10px] text-muted-foreground">{formatDate(comm.date)}</span>
                          </div>
                          <p className="mt-1 text-xs font-medium text-foreground">{comm.subject}</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">{comm.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl p-6 text-center">
              <Users className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Select a relationship to view intelligence</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
