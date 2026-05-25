"use client";

import { useState } from "react";
import { Search, Bell, User, Shield, Radio } from "lucide-react";
import { useRouter } from "next/navigation";
import { currentUser } from "@/data/demo";
import { useOrb } from "@/contexts/OrbContext";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { setState } = useOrb();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setState("searching");
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setTimeout(() => setState("idle"), 3000);
    }
  };

  return (
    <header className="aegis-header sticky top-0 z-30 flex h-14 items-center justify-between px-6 relative">
      <form onSubmit={handleSearch} className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Search vault... (natural language supported)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="aegis-input h-9 w-full rounded-lg pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50"
        />
      </form>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 rounded-md border border-electric/10 bg-electric/[0.04] px-3 py-1.5">
          <Radio className="h-3 w-3 text-electric/70" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-electric/60">Live</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-md border border-success/10 bg-success/[0.04] px-3 py-1.5">
          <Shield className="h-3 w-3 text-success/70" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-success/60">Secured</span>
        </div>

        <button className="relative rounded-lg p-2 text-muted-foreground/60 hover:bg-white/[0.03] hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-electric shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
        </button>

        <div className="h-6 w-px bg-border/50" />

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
  );
}
