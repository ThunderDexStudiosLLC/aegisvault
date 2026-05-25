"use client";

import { useState, useEffect } from "react";
import {
  FileText, Image, FileCode, File, Upload, Filter, Search,
  Shield, Lock, Eye, Download, MoreVertical, Grid, List,
} from "lucide-react";
import { cn, formatRelativeTime, formatDate } from "@/lib/utils";
import { documents, tags } from "@/data/demo";
import { useOrb } from "@/contexts/OrbContext";
import { useFeedback } from "@/components/global/OperationalFeedback";
import type { VaultDocument } from "@/types";

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  image: Image,
  markdown: FileCode,
  document: File,
  screenshot: Image,
  video: File,
  audio: File,
};

const classificationColors: Record<string, string> = {
  "public": "bg-success/10 text-success",
  "internal": "bg-electric/10 text-electric-glow",
  "confidential": "bg-warning/10 text-warning",
  "top-secret": "bg-destructive/10 text-destructive",
};

export default function DocumentsPage() {
  const { show } = useFeedback();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterClassification, setFilterClassification] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const { setState } = useOrb();

  useEffect(() => {
    setState("indexing");
    const timer = setTimeout(() => setState("idle"), 3000);
    return () => clearTimeout(timer);
  }, [setState]);

  const filtered = documents.filter((doc) => {
    if (filterType !== "all" && doc.type !== filterType) return false;
    if (filterClassification !== "all" && doc.classification !== filterClassification) return false;
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="aegis-page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground aegis-glow-text">Secure Documents</h1>
          <p className="text-sm text-muted-foreground/70">{documents.length} documents in vault</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-2 aegis-btn-primary rounded-lg px-4 py-2 text-sm font-medium text-white"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      {showUpload && (
        <div className="aegis-card rounded-xl p-6">
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-electric-dim/30 p-8">
            <Upload className="mb-3 h-10 w-10 text-electric-dim" />
            <p className="text-sm font-medium text-foreground">Drop files here or click to upload</p>
            <p className="mt-1 text-xs text-muted-foreground">Supports PDF, images, markdown, documents &bull; Max 50MB</p>
            <div className="mt-4 flex gap-3">
              <select className="rounded-lg border border-border/30 bg-background/50 px-3 py-2 text-xs text-foreground">
                <option>Internal</option>
                <option>Confidential</option>
                <option>Top Secret</option>
                <option>Public</option>
              </select>
              <button onClick={() => show("processing", "Opening secure file browser...")} className="rounded-lg bg-electric px-4 py-2 text-xs font-medium text-white hover:bg-electric-glow">
                Browse Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border/30 bg-background/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-electric focus:outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-9 rounded-lg border border-border/30 bg-background/50 px-3 text-xs text-foreground"
        >
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="image">Image</option>
          <option value="markdown">Markdown</option>
          <option value="document">Document</option>
        </select>
        <select
          value={filterClassification}
          onChange={(e) => setFilterClassification(e.target.value)}
          className="h-9 rounded-lg border border-border/30 bg-background/50 px-3 text-xs text-foreground"
        >
          <option value="all">All Classifications</option>
          <option value="public">Public</option>
          <option value="internal">Internal</option>
          <option value="confidential">Confidential</option>
          <option value="top-secret">Top Secret</option>
        </select>
        <div className="flex rounded-lg border border-border">
          <button onClick={() => setView("grid")} className={cn("p-2", view === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground")}>
            <Grid className="h-4 w-4" />
          </button>
          <button onClick={() => setView("list")} className={cn("p-2", view === "list" ? "bg-secondary text-foreground" : "text-muted-foreground")}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Document Grid/List */}
      {view === "grid" ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((doc) => {
            const Icon = typeIcons[doc.type] || File;
            return (
              <div key={doc.id} className="glass-interactive cursor-pointer rounded-xl p-4 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric/10">
                    <Icon className="h-5 w-5 text-electric" />
                  </div>
                  <span className={cn("rounded px-1.5 py-0.5 text-[10px] uppercase", classificationColors[doc.classification])}>
                    {doc.classification}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-medium text-foreground line-clamp-2">{doc.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {doc.tags.map((tag) => (
                    <span key={tag.id} className="rounded px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{doc.fileSize}</span>
                  <span>{formatRelativeTime(doc.updatedAt)}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => show("success", `Viewing ${doc.title}`, "Document opened in secure viewer")} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-[10px] text-muted-foreground hover:border-electric-dim hover:text-foreground">
                    <Eye className="h-3 w-3" /> View
                  </button>
                  <button onClick={() => { show("processing", `Downloading ${doc.title}...`); setTimeout(() => show("success", "Download complete", `${doc.fileSize} encrypted archive`), 1500); }} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border py-1.5 text-[10px] text-muted-foreground hover:border-electric-dim hover:text-foreground">
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="aegis-card rounded-xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="p-3">Document</th>
                <th className="p-3">Type</th>
                <th className="p-3">Classification</th>
                <th className="p-3">Size</th>
                <th className="p-3">Updated</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => {
                const Icon = typeIcons[doc.type] || File;
                return (
                  <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-electric" />
                        <span className="text-sm text-foreground">{doc.title}</span>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground uppercase">{doc.type}</td>
                    <td className="p-3">
                      <span className={cn("rounded px-1.5 py-0.5 text-[10px] uppercase", classificationColors[doc.classification])}>
                        {doc.classification}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{doc.fileSize}</td>
                    <td className="p-3 text-xs text-muted-foreground">{formatDate(doc.updatedAt)}</td>
                    <td className="p-3">
                      <button onClick={() => show("success", `Actions for ${doc.title}`)} className="text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
