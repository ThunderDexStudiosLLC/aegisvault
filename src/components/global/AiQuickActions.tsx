"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot, X, Search, Brain, Shield, Zap, Crown, Globe,
  Cpu, RefreshCw, Users, ArrowRight, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrb } from "@/contexts/OrbContext";

const quickActions = [
  { id: "recall", label: "Memory Recall", description: "Search memories by topic, person, or project", icon: Cpu, color: "text-electric", orbState: "searching" as const },
  { id: "briefing", label: "Executive Briefing", description: "Generate AI summary of current priorities", icon: Crown, color: "text-cyan-400", orbState: "executive-briefing" as const },
  { id: "ecosystem", label: "Ecosystem Status", description: "AI health check across all products", icon: Globe, color: "text-emerald-400", orbState: "high-orchestration" as const },
  { id: "security", label: "Security Scan", description: "Run comprehensive security posture check", icon: Shield, color: "text-destructive", orbState: "alert" as const },
  { id: "relationships", label: "Relationship Intel", description: "Surface relationship insights and alerts", icon: Users, color: "text-purple-400", orbState: "research" as const },
  { id: "summary", label: "Generate Summary", description: "AI-powered operational summary", icon: Brain, color: "text-violet-400", orbState: "generating-summaries" as const },
];

const suggestedPrompts = [
  "What decisions were made about AegisPay last week?",
  "Show unresolved infrastructure issues",
  "Find all notes related to Microsoft partnership",
  "What is the current security posture?",
  "Show me paused projects needing attention",
  "Summarize this week's operational activity",
];

export function AiQuickActions({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { setState } = useOrb();

  const handleAction = (orbState: typeof quickActions[number]["orbState"], path: string) => {
    setState(orbState);
    router.push(path);
    onClose();
  };

  const handlePrompt = (prompt: string) => {
    setState("searching");
    router.push(`/search?q=${encodeURIComponent(prompt)}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" onClick={onClose}>
      <div className="absolute inset-0" />
      <div
        className="absolute right-6 top-14 w-[400px] rounded-2xl border border-border/20 bg-[#080c14]/95 shadow-2xl shadow-electric/5 backdrop-blur-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400/60" />
            <span className="text-sm font-semibold text-foreground/90">AI Actions</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/[0.03] transition-colors">
            <X className="h-3.5 w-3.5 text-muted-foreground/40" />
          </button>
        </div>

        {/* AI Query */}
        <div className="px-4 py-3 border-b border-border/10">
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2">
            <Bot className="h-4 w-4 text-electric/40" />
            <input
              type="text"
              placeholder="Ask AegisOSAI anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && query.trim()) handlePrompt(query); }}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/30 outline-none"
            />
            {query.trim() && (
              <button onClick={() => handlePrompt(query)} className="p-1 rounded hover:bg-electric/10 transition-colors">
                <ArrowRight className="h-3.5 w-3.5 text-electric" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="p-3">
          <p className="px-1 pb-2 text-[9px] font-mono uppercase tracking-wider text-muted-foreground/30">Quick Actions</p>
          <div className="grid grid-cols-2 gap-1.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const paths: Record<string, string> = {
                recall: "/memory", briefing: "/founder", ecosystem: "/ecosystem",
                security: "/security", relationships: "/relationships", summary: "/vault/summaries",
              };
              return (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.orbState, paths[action.id])}
                  className="flex items-center gap-2.5 rounded-xl p-2.5 text-left hover:bg-white/[0.03] transition-all"
                >
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", `${action.color}/10`.replace("text-", "bg-"))}>
                    <Icon className={cn("h-4 w-4", action.color)} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-foreground/80">{action.label}</span>
                    <p className="text-[9px] text-muted-foreground/30 truncate">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="border-t border-border/10 p-3">
          <p className="px-1 pb-2 text-[9px] font-mono uppercase tracking-wider text-muted-foreground/30">Suggested</p>
          <div className="space-y-0.5">
            {suggestedPrompts.slice(0, 4).map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePrompt(prompt)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <Search className="h-3 w-3 text-muted-foreground/20 shrink-0" />
                <span className="text-[11px] text-foreground/50 truncate">{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
