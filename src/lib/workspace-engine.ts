import {
  workspaces, workspaceMembers, workspaceAiAgents, workspaceAuditEvents,
  collaborationItems, workspaceGraphNodes, workspaceRoleDefinitions, workspaceStats,
} from "@/data/workspace-data";
import type {
  Workspace, WorkspaceMember, WorkspaceAiAgent, WorkspaceAuditEvent,
  CollaborationItem, WorkspaceGraphNode, WorkspaceStats, WorkspaceType,
  WorkspaceSecurityState, WorkspaceRole,
} from "@/types";

export const WorkspaceEngine = {
  getWorkspaces: (): Workspace[] => workspaces,
  getWorkspaceById: (id: string): Workspace | undefined => workspaces.find((w) => w.id === id),
  getWorkspacesByType: (type: WorkspaceType): Workspace[] => workspaces.filter((w) => w.type === type),
  getWorkspacesBySecurityState: (state: WorkspaceSecurityState): Workspace[] => workspaces.filter((w) => w.securityState === state),
  getLockedWorkspaces: (): Workspace[] => workspaces.filter((w) => w.securityState === "lockdown"),
  getHighRiskWorkspaces: (): Workspace[] => workspaces.filter((w) => w.securityScore < 80),

  getMembers: (): WorkspaceMember[] => workspaceMembers,
  getMembersByWorkspace: (wsId: string): WorkspaceMember[] => workspaceMembers.filter((m) => m.workspaceId === wsId),
  getMembersByRole: (role: WorkspaceRole): WorkspaceMember[] => workspaceMembers.filter((m) => m.role === role),
  getActiveMembers: (): WorkspaceMember[] => workspaceMembers.filter((m) => m.status === "active"),
  getMembersWithoutMfa: (): WorkspaceMember[] => workspaceMembers.filter((m) => !m.mfaEnabled && m.role !== "ai-agent"),

  getAiAgents: (): WorkspaceAiAgent[] => workspaceAiAgents,
  getAiAgentsByWorkspace: (wsId: string): WorkspaceAiAgent[] => workspaceAiAgents.filter((a) => a.workspaceId === wsId),
  getActiveAiAgents: (): WorkspaceAiAgent[] => workspaceAiAgents.filter((a) => a.status === "active"),
  getRestrictedAgents: (): WorkspaceAiAgent[] => workspaceAiAgents.filter((a) => a.status === "restricted" || a.status === "suspended"),
  getNonCompliantAgents: (): WorkspaceAiAgent[] => workspaceAiAgents.filter((a) => a.governanceCompliance < 90),

  getAuditEvents: (): WorkspaceAuditEvent[] => workspaceAuditEvents,
  getAuditByWorkspace: (wsId: string): WorkspaceAuditEvent[] => workspaceAuditEvents.filter((e) => e.workspaceId === wsId),
  getCriticalAuditEvents: (): WorkspaceAuditEvent[] => workspaceAuditEvents.filter((e) => e.severity === "critical"),
  getAiAuditEvents: (): WorkspaceAuditEvent[] => workspaceAuditEvents.filter((e) => e.actorType === "ai-agent"),

  getCollaborations: (): CollaborationItem[] => collaborationItems,
  getCollabByWorkspace: (wsId: string): CollaborationItem[] => collaborationItems.filter((c) => c.workspaceId === wsId),
  getPendingApprovals: (): CollaborationItem[] => collaborationItems.filter((c) => c.type === "approval" && c.status === "pending"),
  getEncryptedNotes: (): CollaborationItem[] => collaborationItems.filter((c) => c.encrypted),
  getActiveCollaborations: (): CollaborationItem[] => collaborationItems.filter((c) => c.status === "active" || c.status === "pending"),

  getGraphNodes: (): WorkspaceGraphNode[] => workspaceGraphNodes,
  getRoleDefinitions: () => workspaceRoleDefinitions,

  getStats: (): WorkspaceStats => workspaceStats,
};
