"use client";

import { useState, useEffect } from "react";
import {
  Search, Bell, User, Shield, Radio, Command, Sparkles,
  LayoutGrid, Bot,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { currentUser } from "@/data/demo";
import { useOrb } from "@/contexts/OrbContext";
import { cn } from "@/lib/utils";
import { NotificationPanel } from "@/components/global/NotificationPanel";
import { AppLauncher } from "@/components/global/AppLauncher";
import { AiQuickActions } from "@/components/global/AiQuickActions";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [appLauncherOpen, setAppLauncherOpen] = useState(false);
  const [aiActionsOpen, setAiActionsOpen] = useState(false);
  const router = useRouter();
  const { setState, state, label } = useOrb();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setState("searching");
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  };

  const isActive = state !== "idle" && state !== "secure";

  return (
    <>
      <header className="aegis-header sticky top-0 z-30 flex h-14 items-center justify-between px-6 relative">
        {/* Search + Command Palette trigger */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="aegis-input h-9 w-full rounded-lg pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50"
            />
          </form>
          <button
            onClick={openCommandPalette}
            className="flex items-center gap-1.5 rounded-lg border border-border/15 bg-white/[0.02] px-2.5 py-1.5 text-muted-foreground/40 hover:text-foreground/60 hover:bg-white/[0.04] transition-all"
          >
            <Command className="h-3 w-3" />
            <span className="text-[10px]">⌘K</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Orb status indicator */}
          <div className={cn(
            "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 transition-all",
            isActive
              ? "border-electric/20 bg-electric/[0.06]"
              : "border-border/10 bg-white/[0.02]"
          )}>
            <div className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-electric animate-pulse" : "bg-success/50")} />
            <span className={cn("text-[9px] font-mono uppercase tracking-wider", isActive ? "text-electric/70" : "text-muted-foreground/40")}>
              {label}
            </span>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 rounded-md border border-electric/10 bg-electric/[0.04] px-2.5 py-1.5">
            <Radio className="h-3 w-3 text-electric/70" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-electric/60">Live</span>
          </div>

          {/* Security status */}
          <div className="flex items-center gap-1.5 rounded-md border border-success/10 bg-success/[0.04] px-2.5 py-1.5">
            <Shield className="h-3 w-3 text-success/70" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-success/60">Secured</span>
          </div>

          {/* AI Actions */}
          <button
            onClick={() => { setAiActionsOpen(true); setNotifOpen(false); setAppLauncherOpen(false); }}
            className={cn(
              "relative rounded-lg p-2 transition-colors",
              aiActionsOpen ? "bg-purple-400/10 text-purple-400" : "text-muted-foreground/60 hover:bg-white/[0.03] hover:text-foreground"
            )}
          >
            <Sparkles className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => { setNotifOpen(!notifOpen); setAppLauncherOpen(false); setAiActionsOpen(false); }}
            className={cn(
              "relative rounded-lg p-2 transition-colors",
              notifOpen ? "bg-electric/10 text-electric" : "text-muted-foreground/60 hover:bg-white/[0.03] hover:text-foreground"
            )}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-electric shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
          </button>

          {/* App Launcher */}
          <button
            onClick={() => { setAppLauncherOpen(!appLauncherOpen); setNotifOpen(false); setAiActionsOpen(false); }}
            className={cn(
              "relative rounded-lg p-2 transition-colors",
              appLauncherOpen ? "bg-electric/10 text-electric" : "text-muted-foreground/60 hover:bg-white/[0.03] hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

          <div className="h-6 w-px bg-border/50" />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground/90">{currentUser.name}</p>
              <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-electric-dim">{currentUser.role}</p>
            </div>
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-electric/10 text-electric ring-1 ring-electric/20">
              <User className="h-4 w-4" />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
            </div>
          </div>
        </div>
      </header>

      {/* Panels */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <AppLauncher open={appLauncherOpen} onClose={() => setAppLauncherOpen(false)} />
      <AiQuickActions open={aiActionsOpen} onClose={() => setAiActionsOpen(false)} />
    </>
  );
}
