"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark, Shield, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.push("/vault");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-electric/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-electric/3 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-electric">
            <Landmark className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AegisVault</h1>
          <p className="mt-1 text-sm text-muted-foreground">Secure Intelligence Vault</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-widest text-electric-dim">IronReserve Holdings</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-electric-dim/30 bg-electric/5 px-3 py-2">
            <Shield className="h-4 w-4 text-electric" />
            <span className="text-xs text-electric-glow">End-to-end encrypted session</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="brendon@ironreserve.io"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure passphrase"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-lg bg-electric font-medium text-white transition-colors hover:bg-electric-glow disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Access Vault"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button className="text-xs text-muted-foreground hover:text-electric">
              Forgot passphrase?
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] text-muted-foreground">
          Protected by AegisVault Security Protocol v2.1
        </p>
      </div>
    </div>
  );
}
