"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { knowledgeNodes } from "@/data/demo";
import { useOrb } from "@/contexts/OrbContext";
import type { KnowledgeNode } from "@/types";

const nodeColors: Record<string, { bg: string; border: string; text: string }> = {
  product: { bg: "#3b82f620", border: "#3b82f6", text: "#60a5fa" },
  person: { bg: "#22c55e20", border: "#22c55e", text: "#4ade80" },
  company: { bg: "#f59e0b20", border: "#f59e0b", text: "#fbbf24" },
  decision: { bg: "#ef444420", border: "#ef4444", text: "#f87171" },
  partnership: { bg: "#8b5cf620", border: "#8b5cf6", text: "#a78bfa" },
  technology: { bg: "#06b6d420", border: "#06b6d4", text: "#22d3ee" },
};

export default function KnowledgeGraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { setState } = useOrb();

  useEffect(() => {
    setState("high-orchestration");
    const timer = setTimeout(() => setState("idle"), 3000);
    return () => clearTimeout(timer);
  }, [setState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.save();
    ctx.translate(offset.x + rect.width / 2, offset.y + rect.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-rect.width / 2, -rect.height / 2);

    knowledgeNodes.forEach((node) => {
      node.connections.forEach((connId) => {
        const target = knowledgeNodes.find((n) => n.id === connId);
        if (!target) return;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = selectedNode && (selectedNode.id === node.id || selectedNode.id === connId)
          ? "#3b82f640" : "#1e293b60";
        ctx.lineWidth = selectedNode && (selectedNode.id === node.id || selectedNode.id === connId) ? 2 : 1;
        ctx.stroke();
      });
    });

    knowledgeNodes.forEach((node) => {
      const colors = nodeColors[node.type] || nodeColors.product;
      const isSelected = selectedNode?.id === node.id;
      const isConnected = selectedNode?.connections.includes(node.id);
      const radius = isSelected ? 32 : 24;

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? colors.border + "40" : colors.bg;
      ctx.fill();
      ctx.strokeStyle = isSelected || isConnected ? colors.border : colors.border + "60";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = colors.border + "30";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.fillStyle = isSelected || isConnected ? colors.text : colors.text + "cc";
      ctx.font = `${isSelected ? "bold " : ""}${isSelected ? 11 : 9}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const words = node.label.split(" ");
      if (words.length > 1 && node.label.length > 10) {
        const mid = Math.ceil(words.length / 2);
        ctx.fillText(words.slice(0, mid).join(" "), node.x, node.y - 5);
        ctx.fillText(words.slice(mid).join(" "), node.x, node.y + 7);
      } else {
        ctx.fillText(node.label, node.x, node.y);
      }
    });

    ctx.restore();
  }, [zoom, offset, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x - rect.width / 2) / zoom + rect.width / 2;
    const y = (e.clientY - rect.top - offset.y - rect.height / 2) / zoom + rect.height / 2;

    const clicked = knowledgeNodes.find((node) => {
      const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return dist < 30;
    });
    setSelectedNode(clicked || null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="aegis-page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Knowledge Graph</h1>
          <p className="text-sm text-muted-foreground/70">Visualize relationships between projects, people, companies, and decisions</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <div className="glass relative overflow-hidden rounded-xl" style={{ height: "600px" }}>
            <canvas
              ref={canvasRef}
              className="h-full w-full cursor-grab active:cursor-grabbing"
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button onClick={() => setZoom((z) => Math.min(z + 0.2, 3))} className="rounded-lg bg-card p-2 text-muted-foreground hover:text-foreground border border-border">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))} className="rounded-lg bg-card p-2 text-muted-foreground hover:text-foreground border border-border">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="rounded-lg bg-card p-2 text-muted-foreground hover:text-foreground border border-border">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Legend */}
            <div className="absolute top-4 left-4 glass rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Legend</p>
              <div className="space-y-1.5">
                {Object.entries(nodeColors).map(([type, colors]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors.border }} />
                    <span className="text-[10px] text-muted-foreground capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Node Detail */}
        <div>
          {selectedNode ? (
            <div className="aegis-card rounded-xl p-4 sticky top-24">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: nodeColors[selectedNode.type]?.border || "#3b82f6" }} />
                <h2 className="text-sm font-semibold text-foreground">{selectedNode.label}</h2>
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Type</p>
                  <p className="mt-1 text-sm capitalize text-foreground">{selectedNode.type}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Connections ({selectedNode.connections.length})</p>
                  <div className="mt-2 space-y-1.5">
                    {selectedNode.connections.map((connId) => {
                      const connected = knowledgeNodes.find((n) => n.id === connId);
                      if (!connected) return null;
                      return (
                        <button
                          key={connId}
                          onClick={() => setSelectedNode(connected)}
                          className="flex w-full items-center gap-2 rounded-lg border border-border/20 p-2 text-left hover:bg-white/[0.02]"
                        >
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: nodeColors[connected.type]?.border || "#3b82f6" }} />
                          <span className="text-xs text-foreground">{connected.label}</span>
                          <span className="ml-auto text-[9px] text-muted-foreground capitalize">{connected.type}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="aegis-card rounded-xl p-6 text-center">
              <Share2 className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground/70">Click a node to view details</p>
              <p className="mt-1 text-xs text-muted-foreground">Drag to pan, scroll to zoom</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
