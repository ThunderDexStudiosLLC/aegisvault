"use client";

import { useState } from "react";
import { Search, Bell, User, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { currentUser } from "@/data/demo";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
      <form onSubmit={handleSearch} className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search vault... (natural language supported)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
        />
      </form>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-lg border border-electric-dim/30 bg-electric/5 px-3 py-1.5">
          <Shield className="h-3.5 w-3.5 text-electric" />
          <span className="text-xs font-medium text-electric-glow">Vault Secured</span>
        </div>

        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-electric" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{currentUser.role}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric/20 text-electric">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
