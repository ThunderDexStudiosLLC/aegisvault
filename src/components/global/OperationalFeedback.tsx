"use client";

import { useState, useCallback, createContext, useContext, type ReactNode } from "react";
import { CheckCircle, AlertTriangle, Shield, Zap, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedbackType = "success" | "warning" | "error" | "processing" | "security";

interface FeedbackItem {
  id: string;
  type: FeedbackType;
  message: string;
  detail?: string;
}

interface FeedbackContextValue {
  show: (type: FeedbackType, message: string, detail?: string) => void;
}

const FeedbackCtx = createContext<FeedbackContextValue>({ show: () => {} });

export function useFeedback() {
  return useContext(FeedbackCtx);
}

const typeConfig: Record<FeedbackType, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  success: { icon: CheckCircle, color: "text-success", bg: "bg-success/[0.06]", border: "border-success/15" },
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/[0.06]", border: "border-amber-400/15" },
  error: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/[0.06]", border: "border-destructive/15" },
  processing: { icon: Loader2, color: "text-electric", bg: "bg-electric/[0.06]", border: "border-electric/15" },
  security: { icon: Shield, color: "text-cyan-400", bg: "bg-cyan-400/[0.06]", border: "border-cyan-400/15" },
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>([]);

  const show = useCallback((type: FeedbackType, message: string, detail?: string) => {
    const id = `fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setItems((prev) => [...prev, { id, type, message, detail }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 3500);
  }, []);

  const dismiss = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <FeedbackCtx.Provider value={{ show }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 max-w-sm">
        {items.map((item) => {
          const cfg = typeConfig[item.type];
          const Icon = cfg.icon;
          return (
            <div key={item.id} className={cn(
              "aegis-action-success flex items-start gap-3 rounded-xl border px-4 py-3 backdrop-blur-xl shadow-lg",
              cfg.bg, cfg.border
            )}>
              <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", cfg.color, item.type === "processing" && "animate-spin")} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-xs font-medium", cfg.color)}>{item.message}</p>
                {item.detail && <p className="text-[10px] text-muted-foreground/40 mt-0.5">{item.detail}</p>}
              </div>
              <button onClick={() => dismiss(item.id)} className="p-0.5 rounded hover:bg-white/[0.03] shrink-0">
                <X className="h-3 w-3 text-muted-foreground/20" />
              </button>
            </div>
          );
        })}
      </div>
    </FeedbackCtx.Provider>
  );
}
