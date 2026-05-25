"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, FileText, Clock, FolderKanban, Search,
  Share2, Users, Calendar, Brain, Activity, Settings, Shield,
  ChevronLeft, ChevronRight, MessageSquare, Landmark, Plug,
  Bell, Lightbulb, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SuperintelligenceOrb } from "@/components/aegis/SuperintelligenceOrb";

const navItems = [
  { label: "Dashboard", href: "/vault", icon: LayoutDashboard },
  { label: "Documents", href: "/vault/documents", icon: FileText },
  { label: "Secure Notes", href: "/notes", icon: Shield },
  { label: "Memory Timeline", href: "/timeline", icon: Clock },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "AI Search", href: "/search", icon: Search },
  { label: "Knowledge Graph", href: "/knowledge", icon: Share2 },
  { label: "Relationships", href: "/relationships", icon: Users },
  { label: "Meetings", href: "/meetings", icon: Calendar },
  { label: "AI Summaries", href: "/vault/summaries", icon: Brain },
  { label: "Decisions", href: "/decisions", icon: Lightbulb },
  { label: "Communications", href: "/communications", icon: MessageSquare },
  { label: "Activity Log", href: "/activity", icon: Activity },
  { label: "Integrations", href: "/integrations", icon: Plug },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "aegis-sidebar fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo Area */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
        {!collapsed && (
          <Link href="/vault" className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-electric to-blue-700">
              <Landmark className="h-4 w-4 text-white" />
              <div className="absolute inset-0 rounded-lg bg-electric/20 blur-sm" />
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground tracking-wide">AegisVault</span>
              <span className="block text-[9px] font-mono uppercase tracking-[0.15em] text-electric-dim">IronReserve Holdings</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-electric to-blue-700">
            <Landmark className="h-4 w-4 text-white" />
            <div className="absolute inset-0 rounded-lg bg-electric/20 blur-sm" />
          </div>
        )}
      </div>

      {/* Orb Section */}
      {!collapsed && (
        <div className="flex flex-col items-center py-4 border-b border-border/30">
          <SuperintelligenceOrb size="md" />
          <div className="mt-6 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full aegis-status-online" />
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-success/70">System Active</span>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="flex justify-center py-3 border-b border-border/30">
          <SuperintelligenceOrb size="sm" />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/vault" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "aegis-nav-item flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                  isActive
                    ? "aegis-nav-active text-electric-glow"
                    : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive && "drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border/30 p-2">
        {!collapsed && (
          <Link
            href="/vault"
            className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.03] hover:text-foreground transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-electric/80 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(59,130,246,0.4)]">
              3
            </span>
          </Link>
        )}
        {!collapsed && (
          <div className="mx-3 mb-2 flex items-center gap-2 rounded-md bg-electric/5 px-2 py-1.5">
            <Zap className="h-3 w-3 text-electric/60" />
            <span className="text-[9px] font-mono text-electric-dim">v2.1 &middot; ENCRYPTED</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.03] hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
