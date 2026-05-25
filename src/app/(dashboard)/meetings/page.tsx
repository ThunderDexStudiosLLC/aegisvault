"use client";

import { useState } from "react";
import {
  Calendar, Clock, Users, Lightbulb, CheckCircle,
  Circle, AlertCircle, Tag, FileText,
} from "lucide-react";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import { meetings } from "@/data/demo";

const taskStatusIcons: Record<string, React.ElementType> = {
  completed: CheckCircle,
  "in-progress": AlertCircle,
  pending: Circle,
};

const taskStatusColors: Record<string, string> = {
  completed: "text-success",
  "in-progress": "text-warning",
  pending: "text-muted-foreground",
};

export default function MeetingsPage() {
  const [selectedId, setSelectedId] = useState(meetings[0]?.id || "");
  const selected = meetings.find((m) => m.id === selectedId);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meeting Intelligence</h1>
          <p className="text-sm text-muted-foreground">AI-powered meeting summaries, decisions, and follow-ups</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-electric px-4 py-2 text-sm font-medium text-white hover:bg-electric-glow">
          <Calendar className="h-4 w-4" />
          Log Meeting
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <button
              key={meeting.id}
              onClick={() => setSelectedId(meeting.id)}
              className={cn(
                "w-full glass rounded-xl p-4 text-left transition-all",
                selectedId === meeting.id ? "border-electric-dim/30 ring-1 ring-electric/20" : "glass-hover"
              )}
            >
              <h3 className="text-sm font-semibold text-foreground">{meeting.title}</h3>
              <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(meeting.date)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {meeting.duration}min</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{meeting.attendees.length} attendees</span>
                <span>&bull;</span>
                <Lightbulb className="h-3 w-3" />
                <span>{meeting.keyDecisions.length} decisions</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {meeting.tags.map((tag) => (
                  <span key={tag.id} className="rounded px-1.5 py-0.5 text-[9px]" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="col-span-2">
          {selected ? (
            <div className="glass rounded-xl p-6">
              <div className="border-b border-border pb-4">
                <h2 className="text-lg font-semibold text-foreground">{selected.title}</h2>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(selected.date)}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {selected.duration} minutes</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {selected.attendees.length} attendees</span>
                </div>
              </div>

              <div className="mt-4 space-y-6">
                {/* Attendees */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground">Attendees</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.attendees.map((name) => (
                      <div key={name} className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-electric/10 text-electric text-[10px] font-bold">
                          {name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="text-xs text-foreground">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground">Meeting Summary</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{selected.summary}</p>
                </div>

                {/* Key Decisions */}
                <div>
                  <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Lightbulb className="h-3.5 w-3.5 text-warning" /> Key Decisions
                  </h3>
                  <div className="mt-2 space-y-2">
                    {selected.keyDecisions.map((decision, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg border border-border p-3">
                        <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-warning/10 flex items-center justify-center text-[10px] font-bold text-warning">
                          {i + 1}
                        </div>
                        <p className="text-sm text-foreground">{decision}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Follow-up Tasks */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground">Follow-up Tasks</h3>
                  <div className="mt-2 space-y-2">
                    {selected.followUpTasks.map((task) => {
                      const StatusIcon = taskStatusIcons[task.status] || Circle;
                      return (
                        <div key={task.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                          <StatusIcon className={cn("mt-0.5 h-4 w-4 shrink-0", taskStatusColors[task.status])} />
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{task.title}</p>
                            <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                              <span>Assigned: {task.assignee}</span>
                              <span>Due: {formatDate(task.dueDate)}</span>
                              <span className={cn("rounded px-1 py-0.5 text-[9px] uppercase", {
                                "bg-destructive/10 text-destructive": task.priority === "high",
                                "bg-warning/10 text-warning": task.priority === "medium",
                                "bg-muted text-muted-foreground": task.priority === "low",
                              })}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Linked Projects */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground">Linked Projects</h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selected.linkedProjects.map((proj) => (
                      <span key={proj} className="rounded bg-electric/10 px-2 py-1 text-xs text-electric-glow">{proj}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              Select a meeting to view intelligence
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
