"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { MemoryGraphNode } from "@/types";

const TYPE_COLORS: Record<string, string> = {
  "founder-memory": "#f59e0b",
  "project-memory": "#3b82f6",
  "workflow-memory": "#06b6d4",
  "meeting-summary": "#22c55e",
  "communication": "#60a5fa",
  "document": "#64748b",
  "sop": "#ef4444",
  "operational-log": "#f59e0b",
  "strategic-note": "#3b82f6",
  "relationship-intelligence": "#22c55e",
  "person": "#8b5cf6",
  "project": "#06b6d4",
  "cluster": "#f97316",
};

interface MemoryGraphProps {
  nodes: MemoryGraphNode[];
  width?: number;
  height?: number;
  onNodeClick?: (nodeId: string) => void;
}

export function MemoryGraph({ nodes, width = 800, height = 700, onNodeClick }: MemoryGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    timeRef.current = time;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw connections
    for (const node of nodes) {
      for (const connId of node.connections) {
        const target = nodes.find((n) => n.id === connId);
        if (!target) continue;

        const isHighlighted = hoveredNode === node.id || hoveredNode === connId;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = isHighlighted
          ? "rgba(59, 130, 246, 0.4)"
          : "rgba(59, 130, 246, 0.08)";
        ctx.lineWidth = isHighlighted ? 1.5 : 0.5;
        ctx.stroke();

        // Animated particle along highlighted links
        if (isHighlighted) {
          const t = ((time / 2000) % 1);
          const px = node.x + (target.x - node.x) * t;
          const py = node.y + (target.y - node.y) * t;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(96, 165, 250, 0.8)";
          ctx.fill();
        }
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const isHovered = hoveredNode === node.id;
      const isConnected = hoveredNode
        ? nodes.find((n) => n.id === hoveredNode)?.connections.includes(node.id)
        : false;
      const color = TYPE_COLORS[node.type] || "#3b82f6";
      const radius = node.size * (isHovered ? 1.3 : 1);

      // Glow effect
      if (isHovered || isConnected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 8, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(node.x, node.y, radius, node.x, node.y, radius + 8);
        gradient.addColorStop(0, color + "40");
        gradient.addColorStop(1, color + "00");
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Pulse ring for pinned/important
      if (node.importance > 0.8) {
        const pulseRadius = radius + 4 + Math.sin(time / 600) * 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = color + "20";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      const dimmed = hoveredNode && !isHovered && !isConnected;
      ctx.fillStyle = dimmed ? color + "20" : color + "80";
      ctx.fill();
      ctx.strokeStyle = dimmed ? color + "10" : color + "60";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = dimmed ? color + "10" : color + "ff";
      ctx.fill();

      // Label
      if (isHovered || isConnected || radius > 10) {
        ctx.font = `${isHovered ? 11 : 9}px ui-sans-serif, system-ui, sans-serif`;
        ctx.fillStyle = dimmed ? "rgba(226,232,240,0.15)" : "rgba(226,232,240,0.7)";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + radius + 14);
      }

      // Type badge on hover
      if (isHovered) {
        const typeLabel = node.type.replace(/-/g, " ");
        ctx.font = "8px ui-monospace, monospace";
        ctx.fillStyle = color + "90";
        ctx.fillText(typeLabel, node.x, node.y - radius - 8);
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

  const getNodeAt = useCallback((mx: number, my: number): MemoryGraphNode | null => {
    const x = (mx - offset.x) / scale;
    const y = (my - offset.y) / scale;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = x - n.x;
      const dy = y - n.y;
      if (dx * dx + dy * dy < (n.size + 4) * (n.size + 4)) return n;
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
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const node = getNodeAt(mx, my);

    if (node) {
      onNodeClick?.(node.id);
    } else {
      setDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    }
  }, [getNodeAt, onNodeClick]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(3, Math.max(0.3, prev * delta)));
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border/20">
      <canvas
        ref={canvasRef}
        className="bg-[#030509]"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-2">
        {[
          { label: "Founder", color: TYPE_COLORS["founder-memory"] },
          { label: "Project", color: TYPE_COLORS["project-memory"] },
          { label: "Strategic", color: TYPE_COLORS["strategic-note"] },
          { label: "Person", color: TYPE_COLORS["person"] },
          { label: "Product", color: TYPE_COLORS["project"] },
          { label: "Meeting", color: TYPE_COLORS["meeting-summary"] },
          { label: "Security", color: TYPE_COLORS["sop"] },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[9px] text-foreground/50">{item.label}</span>
          </div>
        ))}
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
