"use client";

import { useEffect, useRef, useMemo } from "react";
import { useOrb, type OrbState } from "@/contexts/OrbContext";
import { cn } from "@/lib/utils";

const stateConfig: Record<OrbState, {
  coreColor: string;
  coronaColor: string;
  pulseSpeed: string;
  ringSpeed: string;
  intensity: number;
  particleCount: number;
  arcCount: number;
}> = {
  idle: {
    coreColor: "rgba(59,130,246,0.6)",
    coronaColor: "rgba(96,165,250,0.08)",
    pulseSpeed: "4s",
    ringSpeed: "20s",
    intensity: 0.4,
    particleCount: 12,
    arcCount: 2,
  },
  indexing: {
    coreColor: "rgba(59,130,246,0.85)",
    coronaColor: "rgba(96,165,250,0.15)",
    pulseSpeed: "1.5s",
    ringSpeed: "8s",
    intensity: 0.8,
    particleCount: 30,
    arcCount: 5,
  },
  searching: {
    coreColor: "rgba(96,165,250,0.9)",
    coronaColor: "rgba(59,130,246,0.2)",
    pulseSpeed: "1s",
    ringSpeed: "6s",
    intensity: 0.9,
    particleCount: 25,
    arcCount: 4,
  },
  "linking-memory": {
    coreColor: "rgba(34,197,94,0.7)",
    coronaColor: "rgba(34,197,94,0.12)",
    pulseSpeed: "2s",
    ringSpeed: "10s",
    intensity: 0.7,
    particleCount: 20,
    arcCount: 6,
  },
  "generating-summaries": {
    coreColor: "rgba(168,85,247,0.8)",
    coronaColor: "rgba(168,85,247,0.15)",
    pulseSpeed: "2.5s",
    ringSpeed: "12s",
    intensity: 0.75,
    particleCount: 22,
    arcCount: 3,
  },
  "high-orchestration": {
    coreColor: "rgba(245,158,11,0.85)",
    coronaColor: "rgba(245,158,11,0.15)",
    pulseSpeed: "0.8s",
    ringSpeed: "4s",
    intensity: 1,
    particleCount: 40,
    arcCount: 8,
  },
  "executive-briefing": {
    coreColor: "rgba(6,182,212,0.8)",
    coronaColor: "rgba(6,182,212,0.12)",
    pulseSpeed: "3s",
    ringSpeed: "15s",
    intensity: 0.6,
    particleCount: 15,
    arcCount: 3,
  },
  synchronization: {
    coreColor: "rgba(59,130,246,0.9)",
    coronaColor: "rgba(96,165,250,0.18)",
    pulseSpeed: "1.2s",
    ringSpeed: "5s",
    intensity: 0.85,
    particleCount: 35,
    arcCount: 6,
  },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface Arc {
  startAngle: number;
  endAngle: number;
  radius: number;
  life: number;
  maxLife: number;
  width: number;
}

export function SuperintelligenceOrb({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const { state, label } = useOrb();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const arcsRef = useRef<Arc[]>([]);
  const animFrameRef = useRef<number>(0);
  const config = stateConfig[state];

  const dimensions = useMemo(() => {
    switch (size) {
      case "sm": return { w: 48, h: 48, orbR: 16 };
      case "md": return { w: 120, h: 120, orbR: 36 };
      case "lg": return { w: 200, h: 200, orbR: 64 };
    }
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.w * dpr;
    canvas.height = dimensions.h * dpr;
    ctx.scale(dpr, dpr);

    const cx = dimensions.w / 2;
    const cy = dimensions.h / 2;

    function spawnParticle() {
      const angle = Math.random() * Math.PI * 2;
      const dist = dimensions.orbR * (0.8 + Math.random() * 0.4);
      particlesRef.current.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.5 * config.intensity,
        vy: (Math.random() - 0.5) * 1.5 * config.intensity,
        life: 0,
        maxLife: 40 + Math.random() * 60,
        size: 1 + Math.random() * 2,
      });
    }

    function spawnArc() {
      const startAngle = Math.random() * Math.PI * 2;
      arcsRef.current.push({
        startAngle,
        endAngle: startAngle + (Math.random() * 0.8 + 0.2),
        radius: dimensions.orbR * (0.9 + Math.random() * 0.6),
        life: 0,
        maxLife: 15 + Math.random() * 25,
        width: 0.5 + Math.random() * 1.5,
      });
    }

    let tick = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, dimensions.w, dimensions.h);
      tick++;

      if (tick % Math.max(1, Math.floor(4 / config.intensity)) === 0 &&
          particlesRef.current.length < config.particleCount) {
        spawnParticle();
      }
      if (tick % Math.max(1, Math.floor(12 / config.intensity)) === 0 &&
          arcsRef.current.length < config.arcCount) {
        spawnArc();
      }

      arcsRef.current = arcsRef.current.filter((a) => {
        a.life++;
        if (a.life >= a.maxLife) return false;
        const alpha = 1 - a.life / a.maxLife;
        ctx.beginPath();
        ctx.arc(cx, cy, a.radius, a.startAngle, a.endAngle);
        ctx.strokeStyle = `rgba(96,165,250,${alpha * 0.6 * config.intensity})`;
        ctx.lineWidth = a.width;
        ctx.stroke();
        return true;
      });

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        if (p.life >= p.maxLife) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        const alpha = (1 - p.life / p.maxLife) * config.intensity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${alpha})`;
        ctx.fill();
        return true;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [state, config, dimensions]);

  return (
    <div
      className={cn("aegis-orb-container relative flex items-center justify-center", {
        "w-12 h-12": size === "sm",
        "w-[120px] h-[120px]": size === "md",
        "w-[200px] h-[200px]": size === "lg",
      })}
      style={{
        "--orb-pulse-speed": config.pulseSpeed,
        "--orb-ring-speed": config.ringSpeed,
        "--orb-core-color": config.coreColor,
        "--orb-corona-color": config.coronaColor,
        "--orb-intensity": config.intensity,
      } as React.CSSProperties}
    >
      {/* Corona glow */}
      <div className="aegis-orb-corona absolute inset-0 rounded-full" />

      {/* Outer ring */}
      <div className="aegis-orb-ring absolute inset-[10%] rounded-full" />

      {/* Inner ring */}
      <div className="aegis-orb-ring-inner absolute inset-[20%] rounded-full" />

      {/* Core */}
      <div className="aegis-orb-core absolute inset-[25%] rounded-full" />

      {/* Scan line */}
      <div className="aegis-orb-scanline absolute inset-[15%] rounded-full overflow-hidden" />

      {/* Canvas for particles and arcs */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: dimensions.w, height: dimensions.h }}
      />

      {/* State label */}
      {size === "lg" && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="aegis-orb-label text-[10px] font-mono uppercase tracking-[0.2em] text-electric-glow/70">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
