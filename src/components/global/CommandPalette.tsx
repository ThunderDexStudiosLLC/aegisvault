"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, FileText, Shield, Cpu, Globe, Crown, Fingerprint,
  ShieldCheck, Server, Radar, Clock, FolderKanban, Share2,
  Users, Calendar, Brain, Activity, Settings, Plug,
  MessageSquare, Lightbulb, Zap, Bot, Lock, RefreshCw,
  Clipboard, Download, Eye, Radio, Command, ArrowRight, Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrb } from "@/contexts/OrbContext";

interface CommandItem {
  id: string;
  label: string;
  category: "navigation" | "action" | "ai" | "workflow";
  icon: React.ElementType;
  description?: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setState } = useOrb();

  const nav = useCallback((path: string) => { router.push(path); setOpen(false); }, [router]);

  const commands: CommandItem[] = [
    // Navigation
    { id: "nav-vault", label: "Vault Dashboard", category: "navigation", icon: Shield, action: () => nav("/vault") },
    { id: "nav-docs", label: "Documents", category: "navigation", icon: FileText, action: () => nav("/vault/documents") },
    { id: "nav-notes", label: "Secure Notes", category: "navigation", icon: Shield, action: () => nav("/notes") },
    { id: "nav-memory", label: "Memory Engine", category: "navigation", icon: Cpu, action: () => nav("/memory") },
    { id: "nav-eco", label: "Ecosystem Intel", category: "navigation", icon: Globe, action: () => nav("/ecosystem") },
    { id: "nav-founder", label: "Founder Command", category: "navigation", icon: Crown, action: () => nav("/founder") },
    { id: "nav-identity", label: "Identity & Access", category: "navigation", icon: Fingerprint, action: () => nav("/identity") },
    { id: "nav-gov", label: "Memory Governance", category: "navigation", icon: ShieldCheck, action: () => nav("/governance") },
    { id: "nav-cont", label: "Continuity & Recovery", category: "navigation", icon: Server, action: () => nav("/continuity") },
    { id: "nav-sec", label: "IronFrame Security", category: "navigation", icon: Radar, action: () => nav("/security") },
    { id: "nav-timeline", label: "Memory Timeline", category: "navigation", icon: Clock, action: () => nav("/timeline") },
    { id: "nav-projects", label: "Projects", category: "navigation", icon: FolderKanban, action: () => nav("/projects") },
    { id: "nav-search", label: "AI Search", category: "navigation", icon: Search, action: () => nav("/search") },
    { id: "nav-knowledge", label: "Knowledge Graph", category: "navigation", icon: Share2, action: () => nav("/knowledge") },
    { id: "nav-rel", label: "Relationships", category: "navigation", icon: Users, action: () => nav("/relationships") },
    { id: "nav-meetings", label: "Meetings", category: "navigation", icon: Calendar, action: () => nav("/meetings") },
    { id: "nav-summaries", label: "AI Summaries", category: "navigation", icon: Brain, action: () => nav("/vault/summaries") },
    { id: "nav-decisions", label: "Decisions", category: "navigation", icon: Lightbulb, action: () => nav("/decisions") },
    { id: "nav-comms", label: "Communications", category: "navigation", icon: MessageSquare, action: () => nav("/communications") },
    { id: "nav-activity", label: "Activity Log", category: "navigation", icon: Activity, action: () => nav("/activity") },
    { id: "nav-integrations", label: "Integrations", category: "navigation", icon: Plug, action: () => nav("/integrations") },
    { id: "nav-settings", label: "Settings", category: "navigation", icon: Settings, action: () => nav("/settings") },
    { id: "nav-workspaces", label: "Workspaces", category: "navigation", icon: Layers, action: () => nav("/workspaces") },
    { id: "nav-encryption", label: "Encryption & Trust", category: "navigation", icon: Lock, action: () => nav("/encryption") },
    // AI Actions
    { id: "ai-recall", label: "Quick Memory Recall", category: "ai", icon: Bot, description: "AI-powered contextual memory search", action: () => { setState("searching"); nav("/memory"); } },
    { id: "ai-summary", label: "Generate Executive Briefing", category: "ai", icon: Brain, description: "AI-generated operational summary", action: () => { setState("generating-summaries"); nav("/vault/summaries"); } },
    { id: "ai-search", label: "Natural Language Search", category: "ai", icon: Search, description: "Search vault with natural language", action: () => { setState("searching"); nav("/search"); } },
    { id: "ai-ecosystem", label: "Ecosystem Health Check", category: "ai", icon: Globe, description: "AI ecosystem status analysis", action: () => { setState("high-orchestration"); nav("/ecosystem"); } },
    // Quick Actions
    { id: "act-audit", label: "Run Security Audit", category: "action", icon: Clipboard, description: "Comprehensive security posture check", action: () => { setState("alert"); nav("/security"); } },
    { id: "act-lock", label: "Lock Critical Systems", category: "action", icon: Lock, description: "Emergency infrastructure lock", action: () => { setState("emergency-lockdown"); nav("/security"); } },
    { id: "act-rotate", label: "Rotate Credentials", category: "action", icon: RefreshCw, description: "Rotate expiring keys and tokens", action: () => nav("/identity") },
    { id: "act-review", label: "Review Access Risks", category: "action", icon: Eye, description: "Identity risk analysis", action: () => nav("/security") },
    { id: "act-export", label: "Export Recovery Package", category: "action", icon: Download, description: "Download continuity docs", action: () => nav("/continuity") },
    // Workflows
    { id: "wf-incident", label: "Launch Incident Response", category: "workflow", icon: Zap, description: "Start incident response workflow", action: () => { setState("alert"); nav("/continuity"); } },
    { id: "wf-briefing", label: "Prepare Founder Briefing", category: "workflow", icon: Crown, description: "Generate founder daily digest", action: () => { setState("executive-briefing"); nav("/founder"); } },
    { id: "wf-threat", label: "Threat Intelligence Review", category: "workflow", icon: Radio, description: "Review latest threat intelligence", action: () => nav("/security") },
  ];

  const filtered = query.trim()
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || (c.description && c.description.toLowerCase().includes(query.toLowerCase())))
    : commands;

  const grouped = {
    navigation: filtered.filter((c) => c.category === "navigation"),
    ai: filtered.filter((c) => c.category === "ai"),
    action: filtered.filter((c) => c.category === "action"),
    workflow: filtered.filter((c) => c.category === "workflow"),
  };

  const flatFiltered = [...grouped.ai, ...grouped.action, ...grouped.workflow, ...grouped.navigation];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && flatFiltered[selectedIndex]) { flatFiltered[selectedIndex].action(); }
  };

  if (!open) return null;

  const categoryLabels = { ai: "AI Actions", action: "Quick Actions", workflow: "Workflows", navigation: "Navigation" };
  let runningIdx = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-[640px] rounded-2xl border border-border/20 bg-[#080c14]/95 shadow-2xl shadow-electric/5 backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border/10 px-4 py-3">
          <Command className="h-4 w-4 text-electric/50" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands, navigate, launch workflows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
          />
          <kbd className="rounded border border-border/20 px-1.5 py-0.5 text-[9px] text-muted-foreground/40">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {flatFiltered.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground/40">No commands found</div>
          )}

          {(["ai", "action", "workflow", "navigation"] as const).map((cat) => {
            const items = grouped[cat];
            if (items.length === 0) return null;
            return (
              <div key={cat} className="mb-2">
                <p className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-muted-foreground/30">
                  {categoryLabels[cat]}
                </p>
                {items.map((item) => {
                  const Icon = item.icon;
                  const idx = runningIdx++;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                        idx === selectedIndex ? "bg-electric/[0.06] text-foreground" : "text-foreground/60 hover:bg-white/[0.02]"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-electric/50" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm">{item.label}</span>
                        {item.description && <p className="text-[10px] text-muted-foreground/30 truncate">{item.description}</p>}
                      </div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground/20" />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/10 px-4 py-2">
          <div className="flex items-center gap-3 text-[9px] text-muted-foreground/30">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground/30">
            <Zap className="h-3 w-3 text-electric/30" />
            <span>AegisVault Command</span>
          </div>
        </div>
      </div>
    </div>
  );
}
