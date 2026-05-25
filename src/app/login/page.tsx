"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Landmark, Shield, Eye, EyeOff, Radio } from "lucide-react";

function LoginOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const size = 280;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const cx = size / 2;
    const cy = size / 2;
    const orbR = 60;

    interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; s: number; }
    const particles: Particle[] = [];
    let tick = 0;
    let animId = 0;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);
      tick++;

      if (tick % 3 === 0 && particles.length < 20) {
        const angle = Math.random() * Math.PI * 2;
        const dist = orbR * (0.7 + Math.random() * 0.5);
        particles.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          life: 0, maxLife: 50 + Math.random() * 80,
          s: 0.8 + Math.random() * 1.5,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
        p.x += p.vx; p.y += p.vy;
        const alpha = (1 - p.life / p.maxLife) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${alpha})`;
        ctx.fill();
      }

      if (tick % 8 === 0) {
        const startAngle = Math.random() * Math.PI * 2;
        const r = orbR * (0.9 + Math.random() * 0.5);
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, startAngle + Math.random() * 0.6 + 0.2);
        ctx.strokeStyle = `rgba(96,165,250,${0.2 + Math.random() * 0.3})`;
        ctx.lineWidth = 0.5 + Math.random();
        ctx.stroke();
      }

      animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-[280px] h-[280px] mx-auto mb-8">
      {/* Corona */}
      <div className="absolute inset-0 rounded-full" style={{
        background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
        animation: "orbPulse 4s ease-in-out infinite",
      }} />
      {/* Outer ring */}
      <div className="absolute inset-[15%] rounded-full border border-electric/10" style={{
        animation: "orbRingSpin 20s linear infinite",
        boxShadow: "0 0 8px rgba(59,130,246,0.08) inset",
      }}>
        <div className="absolute -top-[3px] left-1/2 w-[6px] h-[6px] rounded-full bg-electric-glow shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
      </div>
      {/* Inner ring */}
      <div className="absolute inset-[25%] rounded-full border border-electric/[0.06]" style={{
        animation: "orbRingSpin 15s linear infinite reverse",
      }}>
        <div className="absolute -bottom-[2px] right-[30%] w-[4px] h-[4px] rounded-full bg-electric-glow/50 shadow-[0_0_4px_rgba(96,165,250,0.4)]" />
      </div>
      {/* Core */}
      <div className="absolute inset-[30%] rounded-full" style={{
        background: "radial-gradient(circle at 40% 35%, rgba(96,165,250,0.25) 0%, rgba(59,130,246,0.5) 40%, rgba(30,58,95,0.3) 70%, rgba(15,23,42,0.5) 100%)",
        boxShadow: "0 0 40px rgba(59,130,246,0.15), 0 0 80px rgba(59,130,246,0.08), 0 0 4px rgba(96,165,250,0.2) inset",
        animation: "orbCorePulse 4s ease-in-out infinite",
      }} />
      {/* Scanline */}
      <div className="absolute inset-[20%] rounded-full overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(96,165,250,0.06) 48%, rgba(96,165,250,0.12) 50%, rgba(96,165,250,0.06) 52%, transparent 100%)",
          animation: "scanline 3s linear infinite",
        }} />
      </div>
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ width: 280, height: 280 }} />
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-electric/20 backdrop-blur-sm border border-electric/10">
          <Landmark className="h-8 w-8 text-electric-glow drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/vault");
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      {/* Deep space background */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 100% 80% at 50% 30%, rgba(59,130,246,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(30,58,95,0.05) 0%, transparent 50%),
          radial-gradient(ellipse 50% 30% at 20% 70%, rgba(59,130,246,0.03) 0%, transparent 50%),
          linear-gradient(180deg, #020408 0%, #030509 50%, #040710 100%)
        `
      }} />

      {/* Grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 70%)",
      }} />

      <div className="relative z-10 w-full max-w-md px-6">
        <LoginOrb />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground aegis-glow-text tracking-wide">AegisVault</h1>
          <p className="mt-1 text-sm text-muted-foreground/60">Secure Intelligence Vault</p>
          <p className="mt-0.5 text-[9px] font-mono uppercase tracking-[0.2em] text-electric-dim/60">IronReserve Holdings</p>
        </div>

        <div className="aegis-card rounded-xl p-6">
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-electric/[0.04] border border-electric/10 px-3 py-2">
            <Shield className="h-3.5 w-3.5 text-electric/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-electric/50">End-to-end encrypted session</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="brendon@ironreserve.io"
                className="aegis-input h-10 w-full rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/30"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure passphrase"
                  className="aegis-input h-10 w-full rounded-lg px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="aegis-btn-primary h-10 w-full rounded-lg font-medium text-white disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Radio className="h-4 w-4 animate-spin" />
                  Authenticating...
                </span>
              ) : "Access Vault"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/30 hover:text-electric/60 transition-colors">
              Forgot passphrase?
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground/20">
          Protected by AegisVault Security Protocol v2.1
        </p>
      </div>
    </div>
  );
}
