"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, Brain, FileText, FolderKanban, Clock, Users,
  Calendar, Lightbulb, MessageSquare, Sparkles, ArrowRight, Tag,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useVaultStore } from "@/hooks/useVaultStore";
import type { SearchResult } from "@/types";

const typeIcons: Record<string, React.ElementType> = {
  document: FileText,
  note: FileText,
  project: FolderKanban,
  memory: Clock,
  meeting: Calendar,
  decision: Lightbulb,
  relationship: Users,
};

const typeLabels: Record<string, string> = {
  document: "Document",
  note: "Secure Note",
  project: "Project",
  memory: "Memory",
  meeting: "Meeting",
  decision: "Decision",
  relationship: "Relationship",
};

const suggestedQueries = [
  "show discussions about AegisPay",
  "what decisions were made about DistrictIQ",
  "find all notes related to Microsoft partnership",
  "show unresolved infrastructure issues",
  "who is involved with AegisOS",
  "what happened last week",
  "show all critical decisions",
  "find conversations about fundraising",
];

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="animate-fade-in space-y-6">
        <div><h1 className="text-2xl font-bold text-foreground">AI Search & Retrieval</h1></div>
        <div className="glass rounded-xl p-4 text-center text-muted-foreground">Loading search...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const { searchVault } = useVaultStore();

  const performSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    setTimeout(() => {
      const searchResults = searchVault(q);
      setResults(searchResults);
      setIsSearching(false);
    }, 600);
  }, [searchVault]);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const filteredResults = filterType === "all" ? results : results.filter((r) => r.type === filterType);
  const resultTypes = [...new Set(results.map((r) => r.type))];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Search & Retrieval</h1>
        <p className="text-sm text-muted-foreground">Natural language search across your entire vault</p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="glass rounded-xl p-1">
          <div className="flex items-center gap-3 rounded-lg bg-background px-4">
            <Brain className="h-5 w-5 text-electric" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything... e.g. 'show discussions about AegisPay' or 'what decisions were made about DistrictIQ'"
              className="h-12 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="flex items-center gap-2 rounded-lg bg-electric px-4 py-2 text-sm font-medium text-white hover:bg-electric-glow disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search Vault
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {!hasSearched && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Suggested Queries</p>
          <div className="grid grid-cols-2 gap-3">
            {suggestedQueries.map((sq) => (
              <button
                key={sq}
                onClick={() => {
                  setQuery(sq);
                  performSearch(sq);
                }}
                className="glass glass-hover flex items-center gap-3 rounded-xl p-4 text-left transition-all"
              >
                <Sparkles className="h-4 w-4 shrink-0 text-electric" />
                <span className="text-sm text-foreground">&ldquo;{sq}&rdquo;</span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {hasSearched && !isSearching && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found <span className="text-foreground font-semibold">{results.length}</span> results for &ldquo;{query}&rdquo;
            </p>
            {resultTypes.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={cn("rounded-lg px-3 py-1.5 text-xs transition-colors", filterType === "all" ? "bg-electric text-white" : "bg-secondary text-muted-foreground hover:text-foreground")}
                >
                  All ({results.length})
                </button>
                {resultTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={cn("rounded-lg px-3 py-1.5 text-xs transition-colors", filterType === type ? "bg-electric text-white" : "bg-secondary text-muted-foreground hover:text-foreground")}
                  >
                    {typeLabels[type]} ({results.filter((r) => r.type === type).length})
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            {filteredResults.map((result) => {
              const Icon = typeIcons[result.type] || FileText;
              return (
                <div key={result.id} className="glass glass-hover rounded-xl p-4 transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric/10">
                      <Icon className="h-5 w-5 text-electric" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-foreground">{result.title}</h3>
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {typeLabels[result.type]}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{result.snippet}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground">{formatRelativeTime(result.date)}</span>
                        <span className="text-[10px] text-electric">Relevance: {Math.min(100, result.relevance)}%</span>
                        {result.tags.length > 0 && (
                          <div className="flex gap-1">
                            {result.tags.map((tag) => (
                              <span key={tag.id} className="rounded px-1.5 py-0.5 text-[9px]" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredResults.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border py-12">
              <Search className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No results found for this query</p>
              <p className="mt-1 text-xs text-muted-foreground">Try different keywords or a broader search</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
