"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Network, Globe, ArrowRight, Activity, Zap, AlertTriangle,
  CheckCircle, Clock, Lightbulb, GitBranch,
  Layers, Shield, Users, Brain, Cpu, CreditCard, Phone,
  Building2, Map, Palette, Code, Hammer,
  ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useEcosystem } from "@/contexts/EcosystemContext";
import { useOrb } from "@/contexts/OrbContext";
import { EcosystemGraph } from "@/components/ecosystem/EcosystemGraph";
import type { EcosystemProduct, EcosystemRecommendation } from "@/types";

const productIcons: Record<string, React.ElementType> = {
  shield: Shield, cpu: Cpu, hammer: Hammer, "credit-card": CreditCard,
  phone: Phone, building: Building2, map: Map, palette: Palette, code: Code,
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-success", bg: "bg-success/10" },
  development: { label: "In Development", color: "text-electric", bg: "bg-electric/10" },
  beta: { label: "Beta", color: "text-info", bg: "bg-info/10" },
  planning: { label: "Planning", color: "text-warning", bg: "bg-warning/10" },
  paused: { label: "Paused", color: "text-muted-foreground", bg: "bg-white/[0.04]" },
};

const categoryConfig: Record<string, { label: string; color: string }> = {
  platform: { label: "Platform", color: "text-electric" },
  intelligence: { label: "Intelligence", color: "text-electric-glow" },
  operations: { label: "Operations", color: "text-warning" },
  finance: { label: "Finance", color: "text-success" },
  communication: { label: "Communication", color: "text-info" },
  civic: { label: "Civic", color: "text-purple-400" },
  development: { label: "Development", color: "text-yellow-400" },
};

const recTypeConfig: Record<EcosystemRecommendation["type"], { icon: React.ElementType; color: string; label: string }> = {
  "link-suggestion": { icon: GitBranch, color: "text-electric", label: "Link Suggestion" },
  "dependency-alert": { icon: AlertTriangle, color: "text-warning", label: "Dependency Alert" },
  "optimization": { icon: Zap, color: "text-success", label: "Optimization" },
  "knowledge-gap": { icon: Brain, color: "text-destructive", label: "Knowledge Gap" },
  "workflow-improvement": { icon: Lightbulb, color: "text-info", label: "Workflow Improvement" },
};

type ViewMode = "overview" | "graph" | "dependencies" | "workflows" | "recommendations";

export default function EcosystemPage() {
  const engine = useEcosystem();
  const { setState } = useOrb();
  const [view, setView] = useState<ViewMode>("overview");
  const [selectedProduct, setSelectedProduct] = useState<EcosystemProduct | null>(null);

  const health = useMemo(() => engine.getEcosystemHealth(), [engine]);
  const products = useMemo(() => engine.getAllProducts(), [engine]);
  const workflows = useMemo(() => engine.getAllWorkflows(), [engine]);
  const recommendations = useMemo(() => engine.getAllRecommendations(), [engine]);
  const graphNodes = useMemo(() => engine.getEcosystemGraph(), [engine]);

  useEffect(() => {
    setState("high-orchestration");
    const timer = setTimeout(() => setState("idle"), 3000);
    return () => clearTimeout(timer);
  }, [setState]);

  const renderProductCard = (product: EcosystemProduct) => {
    const IconComponent = productIcons[product.icon] || Globe;
    const status = statusConfig[product.status];
    const category = categoryConfig[product.category];
    const links = engine.getProductLinks(product.id);
    const deps = engine.getProductDependencies(product.id);
    const dependents = engine.getProductDependents(product.id);
    const prodWorkflows = engine.getProductWorkflows(product.id);
    const prodRecs = engine.getProductRecommendations(product.id);
    const isSelected = selectedProduct?.id === product.id;

    return (
      <div
        key={product.id}
        className={cn(
          "aegis-card rounded-xl p-4 cursor-pointer transition-all",
          isSelected && "ring-1 ring-electric/30"
        )}
        onClick={() => setSelectedProduct(isSelected ? null : product)}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/[0.06]" style={{ backgroundColor: product.color + "20" }}>
            <IconComponent className="h-5 w-5" style={{ color: product.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground/90">{product.name}</h3>
              <span className={cn("rounded px-1.5 py-0.5 text-[9px]", status.bg, status.color)}>{status.label}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-muted-foreground/50 line-clamp-1">{product.description}</p>
            <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground/40">
              <span className={cn(category.color)}>{category.label}</span>
              {product.version && <span className="font-mono">v{product.version}</span>}
              <span>{links.length} links</span>
              <span>{prodWorkflows.length} workflows</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <div className="h-2 w-16 rounded-full bg-white/[0.04]">
                <div className="h-2 rounded-full transition-all" style={{ width: `${product.health * 100}%`, backgroundColor: product.color + "80" }} />
              </div>
              <span className="text-[9px] font-mono text-muted-foreground/30">{Math.round(product.health * 100)}%</span>
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="mt-4 pt-4 border-t border-border/20 space-y-4 animate-fade-in">
            {/* Capabilities */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Shared Capabilities</p>
              <div className="flex flex-wrap gap-1">
                {product.sharedCapabilities.map((cap) => (
                  <span key={cap} className="rounded px-1.5 py-0.5 text-[9px] bg-white/[0.03] text-foreground/50">{cap.replace(/-/g, " ")}</span>
                ))}
              </div>
            </div>

            {/* Dependencies */}
            {deps.length > 0 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Depends On</p>
                <div className="flex flex-wrap gap-2">
                  {deps.map((dep) => (
                    <button key={dep.id} onClick={(e) => { e.stopPropagation(); setSelectedProduct(dep); }} className="flex items-center gap-1.5 rounded-lg bg-white/[0.02] px-2 py-1 hover:bg-white/[0.04] transition-colors">
                      <ArrowDownLeft className="h-2.5 w-2.5 text-warning/50" />
                      <span className="text-[10px]" style={{ color: dep.color }}>{dep.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dependents */}
            {dependents.length > 0 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Depended On By</p>
                <div className="flex flex-wrap gap-2">
                  {dependents.map((dep) => (
                    <button key={dep.id} onClick={(e) => { e.stopPropagation(); setSelectedProduct(dep); }} className="flex items-center gap-1.5 rounded-lg bg-white/[0.02] px-2 py-1 hover:bg-white/[0.04] transition-colors">
                      <ArrowUpRight className="h-2.5 w-2.5 text-success/50" />
                      <span className="text-[10px]" style={{ color: dep.color }}>{dep.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Data Flows */}
            {product.dataFlows.length > 0 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Data Flows</p>
                <div className="space-y-1.5">
                  {product.dataFlows.map((flow) => {
                    const target = engine.getProduct(flow.direction === "inbound" ? flow.sourceProductId : flow.targetProductId);
                    const DirectionIcon = flow.direction === "inbound" ? ArrowDownLeft : flow.direction === "outbound" ? ArrowUpRight : ArrowLeftRight;
                    return (
                      <div key={flow.id} className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2">
                        <DirectionIcon className={cn("h-3 w-3 shrink-0", flow.status === "active" ? "text-success/60" : "text-muted-foreground/30")} />
                        <span className="text-[10px] text-foreground/60 flex-1 truncate">{flow.description}</span>
                        {target && <span className="text-[9px] shrink-0" style={{ color: target.color }}>{target.shortName}</span>}
                        <span className={cn("text-[9px] shrink-0", flow.status === "active" ? "text-success/50" : "text-muted-foreground/30")}>{flow.status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {prodRecs.length > 0 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">AI Recommendations</p>
                <div className="space-y-1.5">
                  {prodRecs.slice(0, 3).map((rec) => {
                    const recConfig = recTypeConfig[rec.type];
                    const RecIcon = recConfig.icon;
                    return (
                      <div key={rec.id} className="flex items-start gap-2 rounded-lg bg-white/[0.02] px-3 py-2">
                        <RecIcon className={cn("h-3 w-3 mt-0.5 shrink-0", recConfig.color)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-foreground/70 truncate">{rec.title}</p>
                          <p className="text-[9px] text-muted-foreground/30">{recConfig.label} &bull; {Math.round(rec.confidence * 100)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground/30">
              <span>{product.metrics.memoryCount} memories</span>
              <span>{product.metrics.workflowCount} workflows</span>
              {product.metrics.activeUsers && <span>{product.metrics.activeUsers} users</span>}
              {product.metrics.uptime && <span>{product.metrics.uptime}% uptime</span>}
              {product.metrics.lastSync && <span>Synced {formatRelativeTime(product.metrics.lastSync)}</span>}
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
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Ecosystem Intelligence</h1>
          <p className="text-sm text-muted-foreground/60">Cross-system memory linking, operational continuity, and shared cognition</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="aegis-badge aegis-badge-electric">
            <Globe className="h-3 w-3" />
            {products.length} Products &bull; {health.totalLinks} Links &bull; {health.totalWorkflows} Workflows
          </div>
        </div>
      </div>

      {/* Health Stats */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: "Ecosystem Health", value: `${Math.round(health.overall * 100)}%`, icon: Activity, color: "text-success" },
          { label: "Active Products", value: health.activeCount, icon: CheckCircle, color: "text-success" },
          { label: "In Development", value: health.devCount, icon: Cpu, color: "text-electric" },
          { label: "Active Links", value: `${health.activeLinks}/${health.totalLinks}`, icon: GitBranch, color: "text-info" },
          { label: "Data Flows", value: health.totalDataFlows, icon: ArrowLeftRight, color: "text-electric-glow" },
          { label: "Recommendations", value: health.criticalRecommendations, icon: Sparkles, color: "text-warning" },
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
          { key: "overview" as ViewMode, label: "Products", icon: Layers },
          { key: "graph" as ViewMode, label: "Ecosystem Graph", icon: Network },
          { key: "dependencies" as ViewMode, label: "Dependencies", icon: GitBranch },
          { key: "workflows" as ViewMode, label: "Workflows", icon: Activity },
          { key: "recommendations" as ViewMode, label: "AI Recommendations", icon: Sparkles },
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

      {/* Overview — Products Grid */}
      {view === "overview" && (
        <div className="grid grid-cols-2 gap-4">
          {products.map(renderProductCard)}
        </div>
      )}

      {/* Graph View */}
      {view === "graph" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground/90">Ecosystem Relationship Graph</h2>
              <p className="text-xs text-muted-foreground/40">Interactive visualization of product connections, shared capabilities, and active workflows</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/30">
              <span>{graphNodes.length} nodes</span>
              <span>&bull;</span>
              <span>Scroll to zoom, drag to pan, click products to explore</span>
            </div>
          </div>
          <EcosystemGraph
            nodes={graphNodes}
            width={900}
            height={700}
            onNodeClick={(nodeId) => {
              const product = engine.getProduct(nodeId);
              if (product) {
                setSelectedProduct(product);
                setView("overview");
              }
            }}
          />
        </div>
      )}

      {/* Dependencies View */}
      {view === "dependencies" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Operational Dependency Explorer</h2>
            <p className="text-xs text-muted-foreground/40">System dependency awareness across the ecosystem</p>
          </div>

          {products.map((product) => {
            const deps = engine.getProductDependencies(product.id);
            const dependents = engine.getProductDependents(product.id);
            const IconComponent = productIcons[product.icon] || Globe;
            if (deps.length === 0 && dependents.length === 0) return null;

            return (
              <div key={product.id} className="aegis-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: product.color + "20" }}>
                    <IconComponent className="h-4 w-4" style={{ color: product.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/90">{product.name}</h3>
                    <p className="text-[10px] text-muted-foreground/40">{product.category} &bull; {statusConfig[product.status].label}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {deps.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Depends On ({deps.length})</p>
                      <div className="space-y-1.5">
                        {deps.map((dep) => {
                          const DepIcon = productIcons[dep.icon] || Globe;
                          return (
                            <div key={dep.id} className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2">
                              <ArrowDownLeft className="h-3 w-3 text-warning/50 shrink-0" />
                              <DepIcon className="h-3 w-3 shrink-0" style={{ color: dep.color }} />
                              <span className="text-xs text-foreground/70 flex-1">{dep.name}</span>
                              <div className="h-1.5 w-8 rounded-full bg-white/[0.04]">
                                <div className="h-1.5 rounded-full" style={{ width: `${dep.health * 100}%`, backgroundColor: dep.color + "60" }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {dependents.length > 0 && (
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/40 mb-2">Depended On By ({dependents.length})</p>
                      <div className="space-y-1.5">
                        {dependents.map((dep) => {
                          const DepIcon = productIcons[dep.icon] || Globe;
                          return (
                            <div key={dep.id} className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2">
                              <ArrowUpRight className="h-3 w-3 text-success/50 shrink-0" />
                              <DepIcon className="h-3 w-3 shrink-0" style={{ color: dep.color }} />
                              <span className="text-xs text-foreground/70 flex-1">{dep.name}</span>
                              <span className={cn("text-[9px]", statusConfig[dep.status].color)}>{statusConfig[dep.status].label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Workflows View */}
      {view === "workflows" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">Linked Workflow Intelligence</h2>
            <p className="text-xs text-muted-foreground/40">Cross-product operational workflows and shared continuity</p>
          </div>

          {workflows.map((wf) => {
            const wfProducts = wf.productIds.map((id) => engine.getProduct(id)).filter((p): p is EcosystemProduct => !!p);

            return (
              <div key={wf.id} className="aegis-card rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-electric/60" />
                      {wf.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground/50">{wf.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("rounded px-1.5 py-0.5 text-[9px]", wf.status === "active" ? "bg-success/10 text-success" : wf.status === "draft" ? "bg-warning/10 text-warning" : "bg-white/[0.04] text-muted-foreground")}>
                      {wf.status}
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground/30">{wf.frequency}</span>
                  </div>
                </div>

                {/* Product chain */}
                <div className="flex items-center gap-2 mb-4">
                  {wfProducts.map((p, i) => {
                    const PIcon = productIcons[p.icon] || Globe;
                    return (
                      <div key={p.id} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.03] px-2 py-1">
                          <PIcon className="h-3 w-3" style={{ color: p.color }} />
                          <span className="text-[10px]" style={{ color: p.color }}>{p.shortName}</span>
                        </div>
                        {i < wfProducts.length - 1 && <ArrowRight className="h-3 w-3 text-electric/30" />}
                      </div>
                    );
                  })}
                </div>

                {/* Steps */}
                <div className="space-y-2">
                  {wf.steps.map((step) => {
                    const stepProduct = engine.getProduct(step.productId);
                    return (
                      <div key={step.order} className="flex items-start gap-3">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-electric/10 text-[9px] font-bold text-electric/60">{step.order}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground/70">{step.action}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {stepProduct && <span className="text-[9px]" style={{ color: stepProduct.color }}>{stepProduct.shortName}</span>}
                            {step.dataIn && <span className="text-[9px] text-success/40 flex items-center gap-0.5"><ArrowDownLeft className="h-2 w-2" />{step.dataIn}</span>}
                            {step.dataOut && <span className="text-[9px] text-electric/40 flex items-center gap-0.5"><ArrowUpRight className="h-2 w-2" />{step.dataOut}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {wf.lastExecuted && (
                  <div className="mt-3 pt-3 border-t border-border/10 text-[10px] text-muted-foreground/30 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Last executed {formatRelativeTime(wf.lastExecuted)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Recommendations View */}
      {view === "recommendations" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground/90">AI Contextual Recommendations</h2>
            <p className="text-xs text-muted-foreground/40">Intelligent suggestions for ecosystem optimization, linking, and knowledge continuity</p>
          </div>

          {recommendations.sort((a, b) => {
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          }).map((rec) => {
            const config = recTypeConfig[rec.type];
            const RecIcon = config.icon;
            const relatedProducts = rec.relatedProducts.map((id) => engine.getProduct(id)).filter((p): p is EcosystemProduct => !!p);

            return (
              <div key={rec.id} className="aegis-card rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]", config.color)}>
                    <RecIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground/90">{rec.title}</h3>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]",
                        rec.priority === "critical" ? "bg-destructive/10 text-destructive" :
                        rec.priority === "high" ? "bg-warning/10 text-warning" :
                        "bg-electric/10 text-electric"
                      )}>{rec.priority}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground/50 leading-relaxed">{rec.description}</p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground/40">Products:</span>
                        {relatedProducts.map((p) => {
                          const PIcon = productIcons[p.icon] || Globe;
                          return (
                            <button key={p.id} onClick={() => { setSelectedProduct(p); setView("overview"); }} className="flex items-center gap-1 rounded bg-white/[0.03] px-1.5 py-0.5 hover:bg-white/[0.06] transition-colors">
                              <PIcon className="h-2.5 w-2.5" style={{ color: p.color }} />
                              <span className="text-[9px]" style={{ color: p.color }}>{p.shortName}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-electric/40" />
                        <span className="text-[9px] font-mono text-electric/50">{Math.round(rec.confidence * 100)}% confidence</span>
                      </div>
                      <span className={cn("rounded px-1.5 py-0.5 text-[9px]", config.color, "bg-white/[0.03]")}>{config.label}</span>
                      {rec.actionable && (
                        <span className="text-[9px] text-success/50 flex items-center gap-0.5"><CheckCircle className="h-2.5 w-2.5" /> Actionable</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
