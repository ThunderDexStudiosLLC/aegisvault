"use client";

import { useState, useEffect } from "react";
import {
  Settings, User, Shield, Bell, Palette, Database,
  Key, Globe, Lock, Save, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser, organization } from "@/data/demo";
import { useFeedback } from "@/components/global/OperationalFeedback";
import { useOrb } from "@/contexts/OrbContext";

const tabs = [
  { key: "profile", label: "Profile", icon: User },
  { key: "security", label: "Security", icon: Shield },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "organization", label: "Organization", icon: Users },
  { key: "api", label: "API & Keys", icon: Key },
  { key: "data", label: "Data & Storage", icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const { show } = useFeedback();
  const { setState } = useOrb();

  useEffect(() => { setState("processing"); const t = setTimeout(() => setState("idle"), 2000); return () => clearTimeout(t); }, [setState]);

  const handleSave = () => {
    setSaved(true);
    show("success", "Settings saved", "Configuration updated successfully");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="aegis-page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Settings</h1>
          <p className="text-sm text-muted-foreground/70">Manage your vault configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors",
            saved ? "bg-success" : "bg-electric hover:bg-electric-glow"
          )}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  activeTab === tab.key ? "bg-electric/10 text-electric-glow" : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="col-span-3 glass rounded-xl p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name</label>
                  <input defaultValue={currentUser.name} className="h-10 w-full rounded-lg border border-border/30 bg-background/50 px-3 text-sm text-foreground focus:border-electric focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                  <input defaultValue={currentUser.email} className="h-10 w-full rounded-lg border border-border/30 bg-background/50 px-3 text-sm text-foreground focus:border-electric focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Role</label>
                  <select defaultValue={currentUser.role} className="h-10 w-full rounded-lg border border-border/30 bg-background/50 px-3 text-sm text-foreground">
                    <option value="founder">Founder</option>
                    <option value="executive">Executive</option>
                    <option value="operations">Operations</option>
                    <option value="analyst">Analyst</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Organization</label>
                  <input defaultValue={currentUser.organization} disabled className="h-10 w-full rounded-lg border border-border bg-white/[0.04] px-3 text-sm text-muted-foreground" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border/20 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <button onClick={() => show("success", "2FA enabled", "Two-factor authentication activated")} className="rounded-lg bg-electric px-4 py-2 text-xs font-medium text-white hover:bg-electric-glow">Enable</button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/20 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Session Encryption</p>
                    <p className="text-xs text-muted-foreground">End-to-end encryption for all vault sessions</p>
                  </div>
                  <div className="flex items-center gap-2 text-success">
                    <Lock className="h-4 w-4" />
                    <span className="text-xs font-medium">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/20 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Zero-Knowledge Mode</p>
                    <p className="text-xs text-muted-foreground">Enable ZK proofs for top-secret classified documents</p>
                  </div>
                  <button onClick={() => show("processing", "Configuring ZK mode...", "Zero-knowledge proof initialization")} className="rounded-lg border border-electric px-4 py-2 text-xs font-medium text-electric hover:bg-electric/10">Configure</button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/20 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your vault passphrase</p>
                  </div>
                  <button onClick={() => show("success", "Password updated", "Vault passphrase changed successfully")} className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground">Update</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
              <div className="space-y-4">
                {["Meeting reminders", "Document updates", "Decision alerts", "Relationship alerts", "AI briefing digest", "Security alerts", "Follow-up reminders"].map((pref) => (
                  <div key={pref} className="flex items-center justify-between rounded-lg border border-border/20 p-4">
                    <span className="text-sm text-foreground">{pref}</span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <div className="peer h-5 w-9 rounded-full bg-secondary after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-muted-foreground after:transition-all peer-checked:bg-electric peer-checked:after:translate-x-full peer-checked:after:bg-white" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "organization" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Organization Settings</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Organization Name</label>
                  <input defaultValue={organization.name} className="h-10 w-full rounded-lg border border-border/30 bg-background/50 px-3 text-sm text-foreground focus:border-electric focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Plan</label>
                  <div className="flex h-10 items-center rounded-lg border border-electric bg-electric/5 px-3">
                    <span className="text-sm font-medium text-electric-glow capitalize">{organization.plan}</span>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Members</label>
                  <input defaultValue={organization.memberCount} disabled className="h-10 w-full rounded-lg border border-border bg-white/[0.04] px-3 text-sm text-muted-foreground" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Slug</label>
                  <input defaultValue={organization.slug} className="h-10 w-full rounded-lg border border-border/30 bg-background/50 px-3 text-sm text-foreground focus:border-electric focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">API & Integration Keys</h2>
              <div className="space-y-4">
                <div className="rounded-lg border border-border/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Vault API Key</p>
                      <p className="text-xs text-muted-foreground">For programmatic access to your vault</p>
                    </div>
                    <button onClick={() => show("success", "API key generated", "New key available — copy it now")} className="rounded-lg bg-electric px-4 py-2 text-xs font-medium text-white hover:bg-electric-glow">Generate</button>
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary p-2">
                    <code className="flex-1 text-xs text-muted-foreground font-mono">av_sk_****************************</code>
                    <button onClick={() => show("success", "Copied to clipboard")} className="text-xs text-electric hover:text-electric-glow">Copy</button>
                  </div>
                </div>
                <div className="rounded-lg border border-border/20 p-4">
                  <p className="text-sm font-medium text-foreground">Webhook URL</p>
                  <p className="text-xs text-muted-foreground">Receive real-time events from your vault</p>
                  <input placeholder="https://your-app.com/webhook" className="mt-3 h-10 w-full rounded-lg border border-border/30 bg-background/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Data & Storage</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-border/20 p-4 text-center">
                  <p className="text-2xl font-bold text-foreground aegis-glow-text">2.4 GB</p>
                  <p className="text-xs text-muted-foreground">Storage Used</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
                    <div className="h-1.5 w-1/4 rounded-full bg-electric" />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">of 10 GB</p>
                </div>
                <div className="rounded-lg border border-border/20 p-4 text-center">
                  <p className="text-2xl font-bold text-foreground aegis-glow-text">47</p>
                  <p className="text-xs text-muted-foreground">Documents</p>
                </div>
                <div className="rounded-lg border border-border/20 p-4 text-center">
                  <p className="text-2xl font-bold text-foreground aegis-glow-text">1,284</p>
                  <p className="text-xs text-muted-foreground">Vector Embeddings</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border/20 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Export Vault Data</p>
                    <p className="text-xs text-muted-foreground">Download all your data in JSON format</p>
                  </div>
                  <button onClick={() => { show("processing", "Exporting vault data..."); setTimeout(() => show("success", "Export ready", "JSON archive prepared"), 2000); }} className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground">Export</button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/20 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Clear Vector Cache</p>
                    <p className="text-xs text-muted-foreground">Rebuild AI search index from scratch</p>
                  </div>
                  <button onClick={() => { show("warning", "Clearing vector cache..."); setTimeout(() => show("success", "Cache cleared", "AI search index will rebuild"), 2000); }} className="rounded-lg border border-destructive/30 px-4 py-2 text-xs text-destructive hover:bg-destructive/10">Clear</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
