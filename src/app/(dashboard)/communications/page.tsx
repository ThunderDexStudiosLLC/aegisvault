"use client";

import { useState } from "react";
import {
  MessageSquare, Mail, Phone, Calendar, FileText, Users,
  Search, Filter,
} from "lucide-react";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import { relationships } from "@/data/demo";
import type { CommunicationEntry } from "@/types";

const typeIcons: Record<string, React.ElementType> = {
  email: Mail,
  call: Phone,
  meeting: Calendar,
  message: MessageSquare,
  document: FileText,
};

const typeColors: Record<string, string> = {
  email: "bg-electric/10 text-electric-glow",
  call: "bg-success/10 text-success",
  meeting: "bg-warning/10 text-warning",
  message: "bg-info/10 text-info",
  document: "bg-muted text-muted-foreground",
};

export default function CommunicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const allComms: (CommunicationEntry & { contact: string; company: string })[] = relationships.flatMap((rel) =>
    rel.communicationHistory.map((comm) => ({
      ...comm,
      contact: rel.name,
      company: rel.company,
    }))
  );

  allComms.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = allComms.filter((comm) => {
    if (filterType !== "all" && comm.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!comm.subject.toLowerCase().includes(q) && !comm.summary.toLowerCase().includes(q) && !comm.contact.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="aegis-page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Communication Archive</h1>
          <p className="text-sm text-muted-foreground/70">Searchable history of all communications across relationships</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search communications..."
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
          <option value="email">Email</option>
          <option value="call">Calls</option>
          <option value="meeting">Meetings</option>
          <option value="message">Messages</option>
          <option value="document">Documents</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((comm) => {
          const Icon = typeIcons[comm.type] || MessageSquare;
          return (
            <div key={comm.id} className="glass-interactive rounded-xl p-4 transition-all">
              <div className="flex items-start gap-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", typeColors[comm.type])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">{comm.subject}</h3>
                    <span className="text-[10px] text-muted-foreground">{formatRelativeTime(comm.date)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{comm.summary}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1 text-electric-glow">
                      <Users className="h-3 w-3" /> {comm.contact} ({comm.company})
                    </span>
                    <span className={cn("rounded px-1.5 py-0.5 uppercase", typeColors[comm.type])}>
                      {comm.type}
                    </span>
                    <span>{comm.participants.length} participants</span>
                    {comm.linkedProject && (
                      <span className="rounded bg-warning/10 px-1.5 py-0.5 text-warning">
                        #{comm.linkedProject}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border py-12">
            <MessageSquare className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground/70">No communications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
