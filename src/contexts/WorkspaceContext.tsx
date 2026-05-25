"use client";

import { createContext, useContext, type ReactNode } from "react";
import { WorkspaceEngine } from "@/lib/workspace-engine";
import type {
  Workspace, WorkspaceMember, WorkspaceAiAgent, WorkspaceAuditEvent,
  CollaborationItem, WorkspaceGraphNode, WorkspaceStats, WorkspaceType,
  WorkspaceSecurityState, WorkspaceRole,
} from "@/types";

interface WorkspaceContextValue {
  workspaces: Workspace[];
  getWorkspaceById: (id: string) => Workspace | undefined;
  getWorkspacesByType: (type: WorkspaceType) => Workspace[];
  getWorkspacesBySecurityState: (state: WorkspaceSecurityState) => Workspace[];
  getLockedWorkspaces: () => Workspace[];
  getHighRiskWorkspaces: () => Workspace[];
  members: WorkspaceMember[];
  getMembersByWorkspace: (wsId: string) => WorkspaceMember[];
  getMembersByRole: (role: WorkspaceRole) => WorkspaceMember[];
  getActiveMembers: () => WorkspaceMember[];
  getMembersWithoutMfa: () => WorkspaceMember[];
  agents: WorkspaceAiAgent[];
  getAiAgentsByWorkspace: (wsId: string) => WorkspaceAiAgent[];
  getActiveAiAgents: () => WorkspaceAiAgent[];
  getRestrictedAgents: () => WorkspaceAiAgent[];
  getNonCompliantAgents: () => WorkspaceAiAgent[];
  auditEvents: WorkspaceAuditEvent[];
  getAuditByWorkspace: (wsId: string) => WorkspaceAuditEvent[];
  getCriticalAuditEvents: () => WorkspaceAuditEvent[];
  getAiAuditEvents: () => WorkspaceAuditEvent[];
  collaborations: CollaborationItem[];
  getCollabByWorkspace: (wsId: string) => CollaborationItem[];
  getPendingApprovals: () => CollaborationItem[];
  getEncryptedNotes: () => CollaborationItem[];
  getActiveCollaborations: () => CollaborationItem[];
  graphNodes: WorkspaceGraphNode[];
  roleDefinitions: ReturnType<typeof WorkspaceEngine.getRoleDefinitions>;
  stats: WorkspaceStats;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const value: WorkspaceContextValue = {
    workspaces: WorkspaceEngine.getWorkspaces(),
    getWorkspaceById: WorkspaceEngine.getWorkspaceById,
    getWorkspacesByType: WorkspaceEngine.getWorkspacesByType,
    getWorkspacesBySecurityState: WorkspaceEngine.getWorkspacesBySecurityState,
    getLockedWorkspaces: WorkspaceEngine.getLockedWorkspaces,
    getHighRiskWorkspaces: WorkspaceEngine.getHighRiskWorkspaces,
    members: WorkspaceEngine.getMembers(),
    getMembersByWorkspace: WorkspaceEngine.getMembersByWorkspace,
    getMembersByRole: WorkspaceEngine.getMembersByRole,
    getActiveMembers: WorkspaceEngine.getActiveMembers,
    getMembersWithoutMfa: WorkspaceEngine.getMembersWithoutMfa,
    agents: WorkspaceEngine.getAiAgents(),
    getAiAgentsByWorkspace: WorkspaceEngine.getAiAgentsByWorkspace,
    getActiveAiAgents: WorkspaceEngine.getActiveAiAgents,
    getRestrictedAgents: WorkspaceEngine.getRestrictedAgents,
    getNonCompliantAgents: WorkspaceEngine.getNonCompliantAgents,
    auditEvents: WorkspaceEngine.getAuditEvents(),
    getAuditByWorkspace: WorkspaceEngine.getAuditByWorkspace,
    getCriticalAuditEvents: WorkspaceEngine.getCriticalAuditEvents,
    getAiAuditEvents: WorkspaceEngine.getAiAuditEvents,
    collaborations: WorkspaceEngine.getCollaborations(),
    getCollabByWorkspace: WorkspaceEngine.getCollabByWorkspace,
    getPendingApprovals: WorkspaceEngine.getPendingApprovals,
    getEncryptedNotes: WorkspaceEngine.getEncryptedNotes,
    getActiveCollaborations: WorkspaceEngine.getActiveCollaborations,
    graphNodes: WorkspaceEngine.getGraphNodes(),
    roleDefinitions: WorkspaceEngine.getRoleDefinitions(),
    stats: WorkspaceEngine.getStats(),
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
