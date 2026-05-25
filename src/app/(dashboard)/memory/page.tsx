"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Brain, Search, Clock, Star, Archive, Filter, ChevronDown,
  Layers, Network, BookOpen, Zap, Activity, Shield, Radio,
  ArrowRight, Pin, Eye, Hash, Users, FolderKanban, FileText,
  MessageSquare, Briefcase, Cog, Target, GitBranch, Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn, formatRelativeTime, formatDate } from "@/lib/utils";
import { useMemory } from "@/contexts/MemoryContext";
import { useOrb } from "@/contexts/OrbContext";
import { MemoryGraph } from "@/components/memory/MemoryGraph";
import { MemorySummaryPanel } from "@/components/memory/MemorySummaryPanel";
import type { MemoryNode, MemoryType, MemorySearchResult, MemoryCluster } from "@/types";

const typeConfig: Record<MemoryType, { icon: React.ElementType; label: string; color: string }> = {
  "founder-memory": { icon: Star, label: "Founder Memory", color: "text-warning" },
  "project-memory": { icon: FolderKanban, label: "Project Memory", color: "text-electric" },
  "workflow-memory": { icon: Cog, label: "Workflow", color: "text-info" },
  "meeting-summary": { icon: MessageSquare, label: "Meeting", color: "text-success" },
  "communication": { icon: MessageSquare, label: "Communication", color: "text-electric-glow" },
  "document": { icon: FileText, label: "Document", color: "text-muted-foreground" },
  "sop": { icon: Shield, label: "SOP", color: "text-destructive" },
  "operational-log": { icon: Activity, label: "Ops Log", color: "text-warning" },
  "strategic-note": { icon: Target, label: "Strategic", color: "text-electric" },
  "relationship-intelligence": { icon: Users, label: "Relationship", color: "text-success" },
};

type ViewMode = "explorer" | "clusters" | "timeline" | "graph" | "summaries" | "recall";

export default function MemoryPage() {
  const engine = useMemory();
  const { setState } = useOrb();
  const [view, setView] = useState<ViewMode>("explorer");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MemorySearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterType, setFilterType] = useState<MemoryType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pinned" | "active" | "archived">("all");
  const [selectedMemory, setSelectedMemory] = useState<MemoryNode | null>(null);
  const [recallQuery, setRecallQuery] = useState("");
  const [recallResult, setRecallResult] = useState<{ memories: MemorySearchResult[]; summary: string; relatedClusters: MemoryCluster[] } | null>(null);
  const [timelineProject, setTimelineProject] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const stats = useMemo(() => engine.getStats(), [engine]);
  const clusters = useMemo(() => engine.getAllClusters(), [engine]);
  const pinnedMemories = useMemo(() => engine.getPinnedMemories(), [engine]);
  const graphNodes = useMemo(() => engine.getMemoryGraph(), [engine]);
  const summaries = useMemo(() => engine.getSummaries(), [engine]);

  useEffect(() => {
    setState("linking-memory");
    const timer = setTimeout(() => setState("idle"), 3000);
    return () => clearTimeout(timer);
  }, [setState]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setState("searching");
    setHasSearched(true);
    const results = engine.search(searchQuery);
    setSearchResults(results);
    setTimeout(() => setState("idle"), 2000);
  };

  const handleRecall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recallQuery.trim()) return;
    setState("searching");
    const result = engine.quickRecall(recallQuery);
    setRecallResult(result);
    setTimeout(() => setState("idle"), 2000);
  };

  const filteredMemories = useMemo(() => {
    let memories = engine.getAllMemories();
    if (filterType !== "all") memories = memories.filter((m) => m.type === filterType);
    if (filterStatus !== "all") memories = memories.filter((m) => m.status === filterStatus);
    return memories.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [engine, filterType, filterStatus]);

  const timelineMemories = useMemo(() => {
    return engine.getTimeline(timelineProject ? { project: timelineProject } : undefined);
  }, [engine, timelineProject]);

  const allProjects = useMemo(() => {
    const projects = new Set<string>();
    engine.getAllMemories().forEach((m) => m.linkedProjects.forEach((p) => projects.add(p)));
    return Array.from(projects).sort();
  }, [engine]);

  const renderMemoryCard = (memory: MemoryNode, showContext = false) => {
    const config = typeConfig[memory.type];
    const Icon = config.icon;
    const linked = engine.getLinkedMemories(memory.id);

    return (
      <div
        key={memory.id}
        className={cn(
          "aegis-card rounded-xl p-4 cursor-pointer transition-all",
          selectedMemory?.id === memory.id && "ring-1 ring-electric/30"
        )}
        onClick={() => setSelectedMemory(selectedMemory?.id === memory.id ? null : memory)}
      >
        <div className="flex items-start gap-3">
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]", config.color)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground/90 truncate">{memory.title}</h3>
              {memory.status === "pinned" && <Pin className="h-3 w-3 text-warning/60 shrink-0" />}
            </div>
            <p className="mt-1 text-xs text-muted-foreground/50 line-clamp-2">{memory.summary}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={cn("rounded px-1.5 py-0.5 text-[10px] bg-white/[0.04]", config.color)}>{config.label}</span>
              <span className="text-[10px] text-muted-foreground/40">{formatRelativeTime(memory.updatedAt)}</span>
              <span className="text-[10px] text-muted-foreground/30">&bull; {memory.accessCount} views</span>
              {linked.length > 0 && (
                <span className="text-[10px] text-electric/40 flex items-center gap-0.5">
                  <GitBranch className="h-2.5 w-2.5" /> {linked.length} linked
                </span>
              )}
            </div>
            {memory.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {memory.tags.slice(0, 4).map((tag) => (
                  <span key={tag.id} className="rounded px-1.5 py-0.5 text-[9px]" style={{ backgroundColor: tag.color + "15", color: tag.color }}>
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={cn("h-1 w-3 rounded-full", i < Math.round(memory.importance * 5) ? "bg-electric/60" : "bg-white/[0.04]")} />
              ))}
            </div>
            <span className="text-[9px] text-muted-foreground/30 font-mono">{Math.round(memory.importance * 100)}%</span>
          </div>
        </div>

        {selectedMemory?.id === memory.id && (
          <div className="mt-4 pt-4 border-t border-border/20 space-y-3 animate-fade-in">
            <p className="text-xs text-foreground/70 leading-relaxed whitespace-pre-wrap">{memory.content}</p>

            {memory.linkedPeople.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-muted-foreground/40" />
                <div className="flex flex-wrap gap-1">
                  {memory.linkedPeople.map((p) => (
                    <span key={p} className="rounded bg-success/10 px-1.5 py-0.5 text-[10px] text-success/70">{p}</span>
                  ))}
                </div>
              </div>
            )}
            {memory.linkedProjects.length > 0 && (
              <div className="flex items-center gap-2">
                <FolderKanban className="h-3 w-3 text-muted-foreground/40" />
                <div className="flex flex-wrap gap-1">
                  {memory.linkedProjects.map((p) => (
                    <span key={p} className="rounded bg-electric/10 px-1.5 py-0.5 text-[10px] text-electric/70">{p}</span>
                  ))}
                </div>
              </div>
            )}

            {linked.length > 0 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Linked Memories</p>
                <div className="space-y-1.5">
                  {linked.map(({ memory: m, link }) => (
                    <button
                      key={m.id}
                      onClick={(e) => { e.stopPropagation(); setSelectedMemory(m); }}
                      className="flex w-full items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2 text-left hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-electric/40" />
                      <span className="text-xs text-foreground/70 truncate flex-1">{m.title}</span>
                      <span className="text-[9px] text-electric/40 shrink-0">{link.relationship}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {memory.contextualAnchors.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {memory.contextualAnchors.map((a, i) => (
                  <span key={i} className="rounded border border-electric/10 bg-electric/[0.03] px-1.5 py-0.5 text-[9px] text-electric/50">
                    {a.type}: {a.value} ({Math.round(a.strength * 100)}%)
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-[10px] text-muted-foreground/30">
              <span>Created: {formatDate(memory.createdAt)}</span>
              <span>Updated: {formatDate(memory.updatedAt)}</span>
              <span>Source: {memory.source || "unknown"}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="aegis-page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Persistent Memory Engine</h1>
          <p className="text-sm text-muted-foreground/60">Contextual intelligence, continuity, and recall across the entire vault</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="aegis-badge aegis-badge-electric">
            <Brain className="h-3 w-3" />
            {stats.total} Memories &bull; {stats.linkCount} Links &bull; {stats.clusterCount} Clusters
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: "Total Memories", value: stats.total, icon: Brain, color: "text-electric" },
          { label: "Pinned", value: stats.pinned, icon: Pin, color: "text-warning" },
          { label: "People", value: stats.uniquePeople, icon: Users, color: "text-success" },
          { label: "Projects", value: stats.uniqueProjects, icon: FolderKanban, color: "text-electric-glow" },
          { label: "Links", value: stats.linkCount, icon: GitBranch, color: "text-info" },
          { label: "Summaries", value: stats.summaryCount, icon: BookOpen, color: "text-warning" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="aegis-card p-3 text-center">
              <Icon className={cn("h-4 w-4 mx-auto", stat.color)} />
              <p className="mt-1 text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/40">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-white/[0.02] p-1">
        {[
          { key: "explorer" as ViewMode, label: "Explorer", icon: Brain },
          { key: "clusters" as ViewMode, label: "Clusters", icon: Layers },
          { key: "timeline" as ViewMode, label: "Timeline", icon: Clock },
          { key: "graph" as ViewMode, label: "Graph", icon: Network },
          { key: "summaries" as ViewMode, label: "Summaries", icon: BookOpen },
          { key: "recall" as ViewMode, label: "Quick Recall", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all",
                view === tab.key
                  ? "bg-electric/10 text-electric-glow shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                  : "text-muted-foreground/50 hover:text-foreground/70"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Explorer View */}
      {view === "explorer" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <div className="aegis-card rounded-xl p-1">
                <div className="flex items-center gap-3 rounded-lg bg-background/50 px-4">
                  <Search className="h-4 w-4 text-electric/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Semantic search across all memories..."
                    className="h-10 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                  />
                  <button type="submit" className="aegis-btn-primary rounded-md px-3 py-1.5 text-xs text-white">
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground transition-colors">
                <Filter className="h-3 w-3" />
                Filters
                <ChevronDown className={cn("h-3 w-3 transition-transform", showFilters && "rotate-180")} />
              </button>
              {filterType !== "all" && (
                <span className="rounded bg-electric/10 px-2 py-0.5 text-[10px] text-electric/70">
                  {typeConfig[filterType]?.label}
                  <button onClick={() => setFilterType("all")} className="ml-1 text-electric/40 hover:text-electric">&times;</button>
                </span>
              )}
              {filterStatus !== "all" && (
                <span className="rounded bg-warning/10 px-2 py-0.5 text-[10px] text-warning/70">
                  {filterStatus}
                  <button onClick={() => setFilterStatus("all")} className="ml-1 text-warning/40 hover:text-warning">&times;</button>
                </span>
              )}
            </div>

            {showFilters && (
              <div className="aegis-card p-3 rounded-lg animate-fade-in">
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Type</p>
                    <div className="flex flex-wrap gap-1">
                      <button onClick={() => setFilterType("all")} className={cn("rounded px-2 py-1 text-[10px] transition-colors", filterType === "all" ? "bg-electric/20 text-electric" : "bg-white/[0.03] text-muted-foreground/50")}>All</button>
                      {(Object.entries(typeConfig) as [MemoryType, typeof typeConfig[MemoryType]][]).map(([key, val]) => (
                        <button key={key} onClick={() => setFilterType(key)} className={cn("rounded px-2 py-1 text-[10px] transition-colors", filterType === key ? "bg-electric/20 text-electric" : "bg-white/[0.03] text-muted-foreground/50")}>
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Status</p>
                    <div className="flex gap-1">
                      {["all", "pinned", "active", "archived"].map((s) => (
                        <button key={s} onClick={() => setFilterStatus(s as typeof filterStatus)} className={cn("rounded px-2 py-1 text-[10px] transition-colors capitalize", filterStatus === s ? "bg-electric/20 text-electric" : "bg-white/[0.03] text-muted-foreground/50")}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results or Memory List */}
            {hasSearched && searchResults.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground/50">
                  Found <span className="text-foreground font-semibold">{searchResults.length}</span> memories for &ldquo;{searchQuery}&rdquo;
                </p>
                {searchResults.map((result) => (
                  <div key={result.memory.id}>
                    {renderMemoryCard(result.memory)}
                    <div className="ml-12 mt-1 flex items-center gap-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-electric/10 to-transparent" />
                      <span className="text-[9px] font-mono text-electric/40">{Math.round(result.relevance)}% relevance</span>
                      {result.matchedTerms.length > 0 && (
                        <span className="text-[9px] text-muted-foreground/30">matched: {result.matchedTerms.join(", ")}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="aegis-card rounded-xl p-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground/20 mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground/40">No memories found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMemories.map((memory) => renderMemoryCard(memory))}
              </div>
            )}
          </div>

          {/* Right Panel — Pinned & Stats */}
          <div className="space-y-6">
            <div className="aegis-card p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Pin className="h-3.5 w-3.5 text-warning/60" />
                Pinned Memories
              </h3>
              <div className="space-y-2">
                {pinnedMemories.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMemory(m); setView("explorer"); }}
                    className="flex w-full items-start gap-2 rounded-lg p-2 text-left hover:bg-white/[0.03] transition-colors"
                  >
                    <Star className="h-3 w-3 mt-0.5 text-warning/50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground/80 truncate">{m.title}</p>
                      <p className="text-[10px] text-muted-foreground/40">{typeConfig[m.type].label} &bull; {formatRelativeTime(m.updatedAt)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="aegis-card p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Activity className="h-3.5 w-3.5 text-electric/60" />
                Most Accessed
              </h3>
              <div className="space-y-2">
                {engine.getMostAccessed(5).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMemory(m); setView("explorer"); }}
                    className="flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-white/[0.03] transition-colors"
                  >
                    <Eye className="h-3 w-3 text-electric/40 shrink-0" />
                    <span className="text-xs text-foreground/70 truncate flex-1">{m.title}</span>
                    <span className="text-[9px] font-mono text-muted-foreground/30">{m.accessCount}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="aegis-card p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Hash className="h-3.5 w-3.5 text-info/60" />
                Memory Types
              </h3>
              <div className="space-y-1.5">
                {Object.entries(stats.typeDistribution).sort(([,a], [,b]) => b - a).map(([type, count]) => {
                  const config = typeConfig[type as MemoryType];
                  if (!config) return null;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className={cn("text-xs", config.color)}>{config.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-white/[0.04]">
                          <div className="h-1.5 rounded-full bg-electric/40" style={{ width: `${(count / stats.total) * 100}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground/30 w-4 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clusters View */}
      {view === "clusters" && (
        <div className="grid grid-cols-2 gap-4">
          {clusters.map(({ cluster, memories, recentActivity }) => (
            <div key={cluster.id} className="aegis-card p-5 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                    <Network className="h-4 w-4 text-electric/60" />
                    {cluster.label}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground/50">{cluster.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-electric/40">{Math.round(cluster.coherence * 100)}% coherence</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {cluster.centroidTags.map((tag) => (
                  <span key={tag} className="rounded bg-electric/[0.06] px-1.5 py-0.5 text-[10px] text-electric/60">{tag}</span>
                ))}
                <span className="text-[10px] text-muted-foreground/30">&bull; {memories.length} memories</span>
                <span className="text-[10px] text-muted-foreground/30">&bull; {formatRelativeTime(recentActivity)}</span>
              </div>

              <div className="space-y-1.5">
                {memories.slice(0, 4).map((m) => {
                  const config = typeConfig[m.type];
                  const Icon = config.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedMemory(m); setView("explorer"); }}
                      className="flex w-full items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2 text-left hover:bg-white/[0.04] transition-colors"
                    >
                      <Icon className={cn("h-3 w-3 shrink-0", config.color)} />
                      <span className="text-xs text-foreground/70 truncate flex-1">{m.title}</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground/20 shrink-0" />
                    </button>
                  );
                })}
                {memories.length > 4 && (
                  <p className="text-[10px] text-muted-foreground/30 pl-3">+{memories.length - 4} more</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline View */}
      {view === "timeline" && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40">Filter by project:</p>
            <select
              value={timelineProject}
              onChange={(e) => setTimelineProject(e.target.value)}
              className="aegis-input rounded-md px-2 py-1 text-xs text-foreground bg-transparent"
            >
              <option value="">All Projects</option>
              {allProjects.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-electric/20 via-electric/10 to-transparent" />

            {timelineMemories.map((memory, idx) => {
              const config = typeConfig[memory.type];
              const Icon = config.icon;
              const showDate = idx === 0 || formatDate(memory.createdAt) !== formatDate(timelineMemories[idx - 1].createdAt);

              return (
                <div key={memory.id}>
                  {showDate && (
                    <div className="relative mb-3 flex items-center gap-3 pl-1">
                      <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-electric/[0.08] ring-1 ring-electric/15">
                        <Clock className="h-4 w-4 text-electric/60" />
                      </div>
                      <span className="text-xs font-semibold text-foreground/70">{formatDate(memory.createdAt)}</span>
                    </div>
                  )}
                  <div className="ml-14 mb-3">
                    {renderMemoryCard(memory)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Graph View */}
      {view === "graph" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground/90">Memory Relationship Graph</h2>
              <p className="text-xs text-muted-foreground/40">Interactive visualization of memory connections, people, and projects</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/30">
              <span>{graphNodes.length} nodes</span>
              <span>&bull;</span>
              <span>Scroll to zoom, drag to pan, click nodes to explore</span>
            </div>
          </div>
          <MemoryGraph
            nodes={graphNodes}
            width={900}
            height={600}
            onNodeClick={(nodeId) => {
              const memory = engine.getMemoryById(nodeId);
              if (memory) {
                setSelectedMemory(memory);
                setView("explorer");
              }
            }}
          />
        </div>
      )}

      {/* Summaries View */}
      {view === "summaries" && (
        <div className="max-w-3xl space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">AI Memory Summaries</h2>
            <p className="text-xs text-muted-foreground/40">Contextual narratives generated from linked memories</p>
          </div>
          <MemorySummaryPanel
            summaries={summaries}
            onMemoryClick={(memoryId) => {
              const memory = engine.getMemoryById(memoryId);
              if (memory) {
                setSelectedMemory(memory);
                setView("explorer");
              }
            }}
          />
        </div>
      )}

      {/* Quick Recall View */}
      {view === "recall" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <Zap className="h-8 w-8 text-electric/60 mx-auto mb-2" />
            <h2 className="text-lg font-semibold text-foreground/90">Quick Recall</h2>
            <p className="text-xs text-muted-foreground/50">Ask anything — get instant context from your entire memory vault</p>
          </div>

          <form onSubmit={handleRecall}>
            <div className="aegis-card rounded-xl p-1">
              <div className="flex items-center gap-3 rounded-lg bg-background/50 px-4">
                <Sparkles className="h-5 w-5 text-electric/50" />
                <input
                  type="text"
                  value={recallQuery}
                  onChange={(e) => setRecallQuery(e.target.value)}
                  placeholder="What do you need to remember? e.g. 'what did we decide about the Microsoft partnership'"
                  className="h-12 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                />
                <button type="submit" className="aegis-btn-primary rounded-lg px-4 py-2 text-sm text-white flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Recall
                </button>
              </div>
            </div>
          </form>

          {!recallResult && (
            <div className="grid grid-cols-2 gap-3">
              {[
                "What decisions led to AegisVault?",
                "Show me everything about the Microsoft partnership",
                "What's our Series A strategy?",
                "Summarize our security architecture",
                "What are our operational processes?",
                "Who are our key relationships?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setRecallQuery(q); const result = engine.quickRecall(q); setRecallResult(result); }}
                  className="glass-interactive flex items-center gap-3 rounded-xl p-4 text-left"
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-electric/40" />
                  <span className="text-xs text-foreground/70">{q}</span>
                </button>
              ))}
            </div>
          )}

          {recallResult && (
            <div className="space-y-4 animate-fade-in">
              {/* AI Summary */}
              <div className="aegis-card p-4 rounded-xl border border-electric/10">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-electric/60" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-electric/50">Memory Recall</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{recallResult.summary}</p>
              </div>

              {recallResult.relatedClusters.length > 0 && (
                <div className="flex items-center gap-2">
                  <Network className="h-3 w-3 text-muted-foreground/40" />
                  <span className="text-[10px] text-muted-foreground/40">Related clusters:</span>
                  {recallResult.relatedClusters.map((c) => (
                    <span key={c.id} className="rounded bg-electric/[0.06] px-2 py-0.5 text-[10px] text-electric/60">{c.label}</span>
                  ))}
                </div>
              )}

              {/* Results */}
              <div className="space-y-3">
                {recallResult.memories.map((result) => (
                  <div key={result.memory.id}>
                    {renderMemoryCard(result.memory)}
                    <div className="ml-12 mt-1">
                      <span className="text-[9px] font-mono text-electric/40">{Math.round(result.relevance)}% match</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setRecallResult(null); setRecallQuery(""); }}
                className="text-xs text-electric/50 hover:text-electric transition-colors"
              >
                &larr; Ask something else
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
