"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, FileText, Clock, FolderKanban, Search,
  Share2, Users, Calendar, Brain, Activity, Settings, Shield,
  ChevronLeft, ChevronRight, MessageSquare, Landmark, Plug,
  Bell, Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        "fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/vault" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric">
              <Landmark className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground">AegisVault</span>
              <span className="block text-[10px] text-muted-foreground">IronReserve Holdings</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-electric">
            <Landmark className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/vault" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-electric/10 text-electric-glow"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-border p-2">
        {!collapsed && (
          <Link
            href="/vault"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-electric text-[10px] font-bold text-white">
              3
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
