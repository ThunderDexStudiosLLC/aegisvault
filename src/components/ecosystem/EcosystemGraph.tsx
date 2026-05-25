"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { EcosystemGraphNode } from "@/types";

interface EcosystemGraphProps {
  nodes: EcosystemGraphNode[];
  width?: number;
  height?: number;
  onNodeClick?: (nodeId: string) => void;
}

const STATUS_OPACITY: Record<string, number> = {
  active: 1,
  development: 0.8,
  beta: 0.7,
  planning: 0.5,
  paused: 0.3,
};

export function EcosystemGraph({ nodes, width = 900, height = 760, onNodeClick }: EcosystemGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw connections
    for (const node of nodes) {
      for (const connId of node.connections) {
        const target = nodes.find((n) => n.id === connId);
        if (!target) continue;
        if (node.id > connId) continue; // draw each link once

        const isHighlighted = hoveredNode === node.id || hoveredNode === connId;
        const hoveredConnections = hoveredNode ? nodes.find((n) => n.id === hoveredNode)?.connections : undefined;
        const isRelated = hoveredConnections?.includes(node.id) || hoveredConnections?.includes(connId);

        // Link line
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);

        // Curved connections for product-to-product
        if (node.type === "product" && target.type === "product") {
          const midX = (node.x + target.x) / 2;
          const midY = (node.y + target.y) / 2;
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const perpX = -dy * 0.15;
          const perpY = dx * 0.15;
          ctx.quadraticCurveTo(midX + perpX, midY + perpY, target.x, target.y);
        } else {
          ctx.lineTo(target.x, target.y);
        }

        if (isHighlighted) {
          ctx.strokeStyle = `rgba(96, 165, 250, 0.6)`;
          ctx.lineWidth = 2.5;
          ctx.setLineDash([]);
        } else if (isRelated) {
          ctx.strokeStyle = `rgba(96, 165, 250, 0.3)`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
        } else if (node.type === "product" && target.type === "product") {
          ctx.strokeStyle = `rgba(59, 130, 246, 0.12)`;
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = `rgba(59, 130, 246, 0.06)`;
          ctx.lineWidth = 0.5;
          ctx.setLineDash([3, 3]);
        }

        ctx.stroke();
        ctx.setLineDash([]);

        // Animated particle on highlighted links
        if (isHighlighted && node.type === "product" && target.type === "product") {
          for (let p = 0; p < 3; p++) {
            const t = ((time / 3000 + p * 0.33) % 1);
            const px = node.x + (target.x - node.x) * t;
            const py = node.y + (target.y - node.y) * t;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(96, 165, 250, ${0.8 - t * 0.5})`;
            ctx.fill();
          }
        }
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const isHovered = hoveredNode === node.id;
      const hoveredConns = hoveredNode ? nodes.find((n) => n.id === hoveredNode)?.connections : undefined;
      const isConnected = hoveredConns?.includes(node.id) ?? false;
      const dimmed = hoveredNode && !isHovered && !isConnected;
      const opacity = STATUS_OPACITY[node.status] ?? 0.5;
      const r = node.size * (isHovered ? 1.25 : 1);

      if (node.type === "product") {
        // Outer glow for products
        if (isHovered || isConnected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 14, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(node.x, node.y, r, node.x, node.y, r + 14);
          grad.addColorStop(0, node.color + "50");
          grad.addColorStop(1, node.color + "00");
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Pulse ring
        const pulseR = r + 4 + Math.sin(time / 800) * 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = dimmed ? node.color + "08" : node.color + (isHovered ? "40" : "18");
        ctx.lineWidth = 1;
        ctx.stroke();

        // Orbit ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = dimmed ? node.color + "05" : node.color + "15";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Product circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        const fillGrad = ctx.createRadialGradient(node.x - r * 0.3, node.y - r * 0.3, 0, node.x, node.y, r);
        fillGrad.addColorStop(0, dimmed ? node.color + "15" : node.color + (isHovered ? "cc" : "80"));
        fillGrad.addColorStop(1, dimmed ? node.color + "08" : node.color + (isHovered ? "90" : "50"));
        ctx.fillStyle = fillGrad;
        ctx.fill();
        ctx.strokeStyle = dimmed ? node.color + "10" : node.color + (isHovered ? "ff" : "60");
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Inner glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = dimmed ? node.color + "05" : node.color + (isHovered ? "ff" : "90");
        ctx.fill();

        // Label
        ctx.font = `${isHovered ? 13 : 11}px ui-sans-serif, system-ui, sans-serif`;
        ctx.fillStyle = dimmed ? "rgba(226,232,240,0.15)" : "rgba(226,232,240,0.85)";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + r + 18);

        // Status badge
        if (isHovered) {
          ctx.font = "9px ui-monospace, monospace";
          ctx.fillStyle = node.color + "aa";
          ctx.fillText(node.status, node.x, node.y - r - 10);

          // Category
          if (node.category) {
            ctx.fillStyle = node.color + "60";
            ctx.fillText(node.category, node.x, node.y - r - 22);
          }
        }
      } else if (node.type === "capability") {
        // Small diamond for capabilities
        const s = r;
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.rect(-s / 2, -s / 2, s, s);
        ctx.fillStyle = dimmed ? node.color + "08" : node.color + "30";
        ctx.fill();
        ctx.strokeStyle = dimmed ? node.color + "05" : node.color + "20";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();

        if (isHovered || isConnected) {
          ctx.font = "8px ui-sans-serif, system-ui, sans-serif";
          ctx.fillStyle = "rgba(226,232,240,0.5)";
          ctx.textAlign = "center";
          ctx.fillText(node.label, node.x, node.y + r + 10);
        }
      } else if (node.type === "workflow") {
        // Hexagonal shape for workflows
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
          const px = node.x + Math.cos(angle) * r;
          const py = node.y + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = dimmed ? node.color + "10" : node.color + "40";
        ctx.fill();
        ctx.strokeStyle = dimmed ? node.color + "08" : node.color + "30";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        if (isHovered) {
          ctx.font = "8px ui-sans-serif, system-ui, sans-serif";
          ctx.fillStyle = "rgba(226,232,240,0.6)";
          ctx.textAlign = "center";
          ctx.fillText(node.label, node.x, node.y + r + 10);
        }
      }
    }

    ctx.restore();
  }, [nodes, hoveredNode, offset, scale, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const animate = (time: number) => {
      draw(ctx, time);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw, width, height]);

  const getNodeAt = useCallback((mx: number, my: number): EcosystemGraphNode | null => {
    const x = (mx - offset.x) / scale;
    const y = (my - offset.y) / scale;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = x - n.x;
      const dy = y - n.y;
      const hitRadius = n.size + 6;
      if (dx * dx + dy * dy < hitRadius * hitRadius) return n;
    }
    return null;
  }, [nodes, offset, scale]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (dragging) {
      setOffset((prev) => ({
        x: prev.x + (e.clientX - dragStart.x),
        y: prev.y + (e.clientY - dragStart.y),
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const node = getNodeAt(mx, my);
    setHoveredNode(node?.id || null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = node ? "pointer" : "grab";
    }
  }, [dragging, dragStart, getNodeAt]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const node = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);

    if (node) {
      onNodeClick?.(node.id);
    } else {
      setDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    }
  }, [getNodeAt, onNodeClick]);

  const handleMouseUp = useCallback(() => { setDragging(false); }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    setScale((prev) => Math.min(3, Math.max(0.3, prev * delta)));
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border/20">
      <canvas
        ref={canvasRef}
        className="bg-[#020408]"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-lg bg-black/70 backdrop-blur-sm px-3 py-2">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-blue-500/70" />
          <span className="text-[9px] text-foreground/50">Product</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rotate-45 bg-slate-500/40" />
          <span className="text-[9px] text-foreground/50">Shared Capability</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 bg-green-500/50 [clip-path:polygon(50%_0,100%_38%,82%_100%,18%_100%,0_38%)]" />
          <span className="text-[9px] text-foreground/50">Workflow</span>
        </div>
        <div className="border-l border-border/20 pl-3 flex items-center gap-3">
          {["active", "development", "planning"].map((s) => (
            <div key={s} className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full" style={{ opacity: STATUS_OPACITY[s], backgroundColor: "#3b82f6" }} />
              <span className="text-[8px] text-foreground/30">{s}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <button onClick={() => setScale((s) => Math.min(3, s * 1.2))} className="flex h-6 w-6 items-center justify-center rounded bg-black/60 text-xs text-foreground/60 hover:text-foreground backdrop-blur-sm">+</button>
        <button onClick={() => setScale((s) => Math.max(0.3, s * 0.8))} className="flex h-6 w-6 items-center justify-center rounded bg-black/60 text-xs text-foreground/60 hover:text-foreground backdrop-blur-sm">−</button>
        <button onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }} className="flex h-6 w-6 items-center justify-center rounded bg-black/60 text-[9px] text-foreground/60 hover:text-foreground backdrop-blur-sm">⌀</button>
      </div>
    </div>
  );
}
