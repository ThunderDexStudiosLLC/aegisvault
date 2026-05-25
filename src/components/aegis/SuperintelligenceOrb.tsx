"use client";

import { useEffect, useRef, useMemo } from "react";
import { useOrb, type OrbState } from "@/contexts/OrbContext";
import { cn } from "@/lib/utils";

const stateConfig: Record<OrbState, {
  coreR: number; coreG: number; coreB: number;
  coronaColor: string;
  pulseSpeed: string;
  ringSpeed: string;
  intensity: number;
  particleCount: number;
  arcCount: number;
  sparkFreq: number;
}> = {
  idle:                  { coreR: 0.23, coreG: 0.51, coreB: 0.96, coronaColor: "rgba(96,165,250,0.08)",  pulseSpeed: "4s",   ringSpeed: "20s", intensity: 0.4,  particleCount: 14, arcCount: 2, sparkFreq: 0.02 },
  listening:             { coreR: 0.30, coreG: 0.60, coreB: 1.00, coronaColor: "rgba(96,165,250,0.10)",  pulseSpeed: "3s",   ringSpeed: "16s", intensity: 0.5,  particleCount: 18, arcCount: 3, sparkFreq: 0.03 },
  processing:            { coreR: 0.40, coreG: 0.55, coreB: 0.95, coronaColor: "rgba(96,165,250,0.14)",  pulseSpeed: "1.5s", ringSpeed: "8s",  intensity: 0.75, particleCount: 28, arcCount: 5, sparkFreq: 0.06 },
  alert:                 { coreR: 0.94, coreG: 0.27, coreB: 0.27, coronaColor: "rgba(239,68,68,0.15)",   pulseSpeed: "0.6s", ringSpeed: "3s",  intensity: 1.0,  particleCount: 40, arcCount: 8, sparkFreq: 0.12 },
  secure:                { coreR: 0.13, coreG: 0.72, coreB: 0.37, coronaColor: "rgba(34,197,94,0.10)",   pulseSpeed: "4s",   ringSpeed: "22s", intensity: 0.35, particleCount: 10, arcCount: 2, sparkFreq: 0.01 },
  communications:        { coreR: 0.40, coreG: 0.70, coreB: 1.00, coronaColor: "rgba(96,165,250,0.10)",  pulseSpeed: "2.5s", ringSpeed: "14s", intensity: 0.55, particleCount: 16, arcCount: 3, sparkFreq: 0.03 },
  founder:               { coreR: 0.20, coreG: 0.45, coreB: 0.90, coronaColor: "rgba(59,130,246,0.18)",  pulseSpeed: "3.5s", ringSpeed: "18s", intensity: 0.65, particleCount: 20, arcCount: 4, sparkFreq: 0.02 },
  research:              { coreR: 0.50, coreG: 0.35, coreB: 0.85, coronaColor: "rgba(168,85,247,0.12)",  pulseSpeed: "1.8s", ringSpeed: "7s",  intensity: 0.8,  particleCount: 30, arcCount: 5, sparkFreq: 0.07 },
  autonomous:            { coreR: 0.96, coreG: 0.62, coreB: 0.04, coronaColor: "rgba(245,158,11,0.14)",  pulseSpeed: "1s",   ringSpeed: "5s",  intensity: 0.9,  particleCount: 35, arcCount: 7, sparkFreq: 0.09 },
  "emergency-lockdown":  { coreR: 0.94, coreG: 0.15, coreB: 0.15, coronaColor: "rgba(220,38,38,0.20)",   pulseSpeed: "0.4s", ringSpeed: "2s",  intensity: 1.0,  particleCount: 50, arcCount: 10, sparkFreq: 0.15 },
  indexing:              { coreR: 0.23, coreG: 0.51, coreB: 0.96, coronaColor: "rgba(96,165,250,0.15)",  pulseSpeed: "1.5s", ringSpeed: "8s",  intensity: 0.8,  particleCount: 30, arcCount: 5, sparkFreq: 0.06 },
  searching:             { coreR: 0.38, coreG: 0.65, coreB: 0.98, coronaColor: "rgba(59,130,246,0.20)",  pulseSpeed: "1s",   ringSpeed: "6s",  intensity: 0.9,  particleCount: 25, arcCount: 4, sparkFreq: 0.08 },
  "linking-memory":      { coreR: 0.13, coreG: 0.77, coreB: 0.37, coronaColor: "rgba(34,197,94,0.12)",   pulseSpeed: "2s",   ringSpeed: "10s", intensity: 0.7,  particleCount: 20, arcCount: 6, sparkFreq: 0.04 },
  "generating-summaries":{ coreR: 0.66, coreG: 0.33, coreB: 0.97, coronaColor: "rgba(168,85,247,0.15)",  pulseSpeed: "2.5s", ringSpeed: "12s", intensity: 0.75, particleCount: 22, arcCount: 3, sparkFreq: 0.04 },
  "high-orchestration":  { coreR: 0.96, coreG: 0.62, coreB: 0.04, coronaColor: "rgba(245,158,11,0.15)",  pulseSpeed: "0.8s", ringSpeed: "4s",  intensity: 1.0,  particleCount: 40, arcCount: 8, sparkFreq: 0.10 },
  "executive-briefing":  { coreR: 0.02, coreG: 0.71, coreB: 0.83, coronaColor: "rgba(6,182,212,0.12)",   pulseSpeed: "3s",   ringSpeed: "15s", intensity: 0.6,  particleCount: 15, arcCount: 3, sparkFreq: 0.02 },
  synchronization:       { coreR: 0.23, coreG: 0.51, coreB: 0.96, coronaColor: "rgba(96,165,250,0.18)",  pulseSpeed: "1.2s", ringSpeed: "5s",  intensity: 0.85, particleCount: 35, arcCount: 6, sparkFreq: 0.08 },
};

/* WebGL shader source */
const VERT_SRC = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG_SRC = `
precision highp float;
varying vec2 v_uv;
uniform float u_time;
uniform float u_intensity;
uniform vec3 u_coreColor;
uniform float u_pulseFreq;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = v_uv * 2.0 - 1.0;
  float dist = length(uv);

  float pulse = sin(u_time * u_pulseFreq) * 0.5 + 0.5;
  float orbRadius = 0.38 + pulse * 0.02 * u_intensity;

  // deep space noise background
  float spaceNoise = fbm(uv * 3.0 + u_time * 0.05) * 0.03;

  // orb core with internal plasma currents
  float core = smoothstep(orbRadius, orbRadius - 0.12, dist);
  float plasma = fbm(uv * 4.0 + vec2(u_time * 0.3, u_time * 0.2));
  float plasma2 = fbm(uv * 6.0 - vec2(u_time * 0.25, u_time * 0.35));
  float internalFlow = mix(plasma, plasma2, 0.5) * core;

  // volumetric glow layers
  float glow1 = exp(-dist * 2.5) * 0.3 * u_intensity;
  float glow2 = exp(-dist * 5.0) * 0.5 * u_intensity;
  float glow3 = exp(-dist * 1.2) * 0.12 * u_intensity;

  // energy shell
  float shellDist = abs(dist - orbRadius - 0.02);
  float shell = exp(-shellDist * 40.0) * 0.4 * u_intensity;

  // scanning rings
  float ring1Dist = abs(dist - 0.5 - sin(u_time * 0.8) * 0.05);
  float ring1 = exp(-ring1Dist * 60.0) * 0.2 * u_intensity;
  float ring2Dist = abs(dist - 0.6 + cos(u_time * 0.6) * 0.03);
  float ring2 = exp(-ring2Dist * 50.0) * 0.15 * u_intensity;

  // electrical arc shimmer
  float angle = atan(uv.y, uv.x);
  float arcNoise = fbm(vec2(angle * 3.0, u_time * 1.5)) * step(0.35, dist) * step(dist, 0.65);
  float arcs = arcNoise * 0.3 * u_intensity * step(0.7, hash(vec2(angle * 10.0, floor(u_time * 3.0))));

  // galaxy-like internal rotation
  float rotAngle = angle + u_time * 0.2;
  float spiral = sin(rotAngle * 3.0 + dist * 8.0 - u_time) * 0.5 + 0.5;
  float galaxyPattern = spiral * core * 0.15;

  // compose
  vec3 deepSpace = vec3(0.012, 0.02, 0.035) + spaceNoise;
  vec3 coreGlow = u_coreColor * (core * 0.7 + internalFlow * 0.4 + galaxyPattern);
  vec3 outerGlow = u_coreColor * (glow1 + glow2 + glow3);
  vec3 shellColor = u_coreColor * (shell + ring1 + ring2 + arcs);

  vec3 color = deepSpace + coreGlow + outerGlow + shellColor;

  // highlight bloom center
  float centerBloom = exp(-dist * 12.0) * pulse * 0.3 * u_intensity;
  color += vec3(1.0) * centerBloom;

  // fade edges
  float vignette = 1.0 - smoothstep(0.7, 1.0, dist);
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}`;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
}

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  brightness: number;
}

interface Arc {
  startAngle: number; endAngle: number;
  radius: number; life: number; maxLife: number;
  width: number;
}

export function SuperintelligenceOrb({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const { state, label } = useOrb();
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{ gl: WebGLRenderingContext; program: WebGLProgram; startTime: number } | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sparksRef = useRef<Spark[]>([]);
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

  /* WebGL orb core setup */
  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.w * dpr;
    canvas.height = dimensions.h * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    function createShader(g: WebGLRenderingContext, type: number, src: string) {
      const s = g.createShader(type)!;
      g.shaderSource(s, src);
      g.compileShader(s);
      return s;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "a_position");
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    glRef.current = { gl, program, startTime: performance.now() };

    return () => {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [dimensions]);

  /* Animation loop */
  useEffect(() => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    overlay.width = dimensions.w * dpr;
    overlay.height = dimensions.h * dpr;
    ctx.scale(dpr, dpr);

    const cx = dimensions.w / 2;
    const cy = dimensions.h / 2;

    function spawnParticle() {
      const angle = Math.random() * Math.PI * 2;
      const dist = dimensions.orbR * (0.7 + Math.random() * 0.5);
      particlesRef.current.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.2 * config.intensity,
        vy: (Math.random() - 0.5) * 1.2 * config.intensity,
        life: 0, maxLife: 50 + Math.random() * 70,
        size: 0.8 + Math.random() * 2,
      });
    }

    function spawnSpark() {
      const angle = Math.random() * Math.PI * 2;
      const dist = dimensions.orbR * (0.9 + Math.random() * 0.3);
      const speed = 2 + Math.random() * 3;
      sparksRef.current.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: Math.cos(angle) * speed * config.intensity,
        vy: Math.sin(angle) * speed * config.intensity,
        life: 0, maxLife: 8 + Math.random() * 12,
        brightness: 0.6 + Math.random() * 0.4,
      });
    }

    function spawnArc() {
      const startAngle = Math.random() * Math.PI * 2;
      arcsRef.current.push({
        startAngle,
        endAngle: startAngle + (Math.random() * 0.6 + 0.15),
        radius: dimensions.orbR * (0.85 + Math.random() * 0.7),
        life: 0, maxLife: 12 + Math.random() * 20,
        width: 0.5 + Math.random() * 1.5,
      });
    }

    const cR = Math.round(config.coreR * 255);
    const cG = Math.round(config.coreG * 255);
    const cB = Math.round(config.coreB * 255);

    let tick = 0;
    function animate() {
      const glData = glRef.current;
      if (glData) {
        const { gl, program } = glData;
        const t = (performance.now() - glData.startTime) / 1000;
        gl.uniform1f(gl.getUniformLocation(program, "u_time"), t);
        gl.uniform1f(gl.getUniformLocation(program, "u_intensity"), config.intensity);
        gl.uniform3f(gl.getUniformLocation(program, "u_coreColor"), config.coreR, config.coreG, config.coreB);
        const pulseFreqMap: Record<string, number> = { "0.4s": 15.7, "0.6s": 10.5, "0.8s": 7.85, "1s": 6.28, "1.2s": 5.24, "1.5s": 4.19, "1.8s": 3.49, "2s": 3.14, "2.5s": 2.51, "3s": 2.09, "3.5s": 1.8, "4s": 1.57 };
        gl.uniform1f(gl.getUniformLocation(program, "u_pulseFreq"), pulseFreqMap[config.pulseSpeed] || 2.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      if (!ctx) return;
      ctx.clearRect(0, 0, dimensions.w, dimensions.h);
      tick++;

      // spawn particles
      if (tick % Math.max(1, Math.floor(3 / config.intensity)) === 0 && particlesRef.current.length < config.particleCount) {
        spawnParticle();
      }
      // spawn sparks
      if (Math.random() < config.sparkFreq) {
        spawnSpark();
      }
      // spawn arcs
      if (tick % Math.max(1, Math.floor(10 / config.intensity)) === 0 && arcsRef.current.length < config.arcCount) {
        spawnArc();
      }

      // draw arcs
      arcsRef.current = arcsRef.current.filter((a) => {
        a.life++;
        if (a.life >= a.maxLife) return false;
        const alpha = (1 - a.life / a.maxLife) * 0.6 * config.intensity;
        ctx.beginPath();
        ctx.arc(cx, cy, a.radius, a.startAngle, a.endAngle);
        ctx.strokeStyle = `rgba(${cR},${cG},${cB},${alpha})`;
        ctx.lineWidth = a.width;
        ctx.stroke();
        return true;
      });

      // draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        if (p.life >= p.maxLife) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        const alpha = (1 - p.life / p.maxLife) * config.intensity * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cR},${cG},${cB},${alpha})`;
        ctx.fill();
        return true;
      });

      // draw sparks
      sparksRef.current = sparksRef.current.filter((s) => {
        s.life++;
        if (s.life >= s.maxLife) return false;
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
        const alpha = (1 - s.life / s.maxLife) * s.brightness;
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 3);
        grd.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grd.addColorStop(1, `rgba(${cR},${cG},${cB},0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
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
        "--orb-core-color": `rgba(${Math.round(config.coreR*255)},${Math.round(config.coreG*255)},${Math.round(config.coreB*255)},0.7)`,
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

      {/* WebGL core */}
      <canvas
        ref={glCanvasRef}
        className="absolute inset-[15%] rounded-full"
        style={{ width: dimensions.w * 0.7, height: dimensions.h * 0.7 }}
      />

      {/* Scan line */}
      <div className="aegis-orb-scanline absolute inset-[15%] rounded-full overflow-hidden" />

      {/* Canvas overlay for particles, sparks, arcs */}
      <canvas
        ref={overlayCanvasRef}
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
