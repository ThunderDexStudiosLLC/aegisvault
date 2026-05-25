import type {
  User, Organization, Tag, VaultDocument, SecureNote, MemoryEntry,
  Project, Relationship, CommunicationEntry, Meeting, Decision,
  KnowledgeNode, ActivityLog, Notification, AISummary, Integration,
} from "@/types";

export const currentUser: User = {
  id: "u1",
  name: "Brendon Kahmann",
  email: "brendon@ironreserve.io",
  role: "founder",
  avatar: "",
  organization: "IronReserve Holdings",
};

export const organization: Organization = {
  id: "org1",
  name: "IronReserve Holdings",
  slug: "ironreserve",
  plan: "enterprise",
  memberCount: 12,
};

export const tags: Tag[] = [
  { id: "t1", name: "Infrastructure", color: "#3b82f6" },
  { id: "t2", name: "AI/ML", color: "#8b5cf6" },
  { id: "t3", name: "Partnership", color: "#22c55e" },
  { id: "t4", name: "Strategy", color: "#f59e0b" },
  { id: "t5", name: "Security", color: "#ef4444" },
  { id: "t6", name: "Revenue", color: "#10b981" },
  { id: "t7", name: "Product", color: "#06b6d4" },
  { id: "t8", name: "Operations", color: "#f97316" },
  { id: "t9", name: "Legal", color: "#ec4899" },
  { id: "t10", name: "Investor", color: "#a855f7" },
  { id: "t11", name: "Critical", color: "#dc2626" },
  { id: "t12", name: "KahmannAI", color: "#3b82f6" },
];

export const documents: VaultDocument[] = [
  { id: "d1", title: "AegisOS Architecture Specification v3.2", type: "pdf", fileSize: "4.2 MB", uploadedAt: "2026-05-20T10:00:00Z", updatedAt: "2026-05-22T14:30:00Z", tags: [tags[0], tags[1]], createdBy: "u1", classification: "confidential" },
  { id: "d2", title: "Microsoft Partnership Term Sheet", type: "pdf", fileSize: "1.8 MB", uploadedAt: "2026-05-15T09:00:00Z", updatedAt: "2026-05-18T11:00:00Z", tags: [tags[2], tags[8]], createdBy: "u1", classification: "top-secret" },
  { id: "d3", title: "Q2 2026 Revenue Projections", type: "document", fileSize: "890 KB", uploadedAt: "2026-05-10T08:00:00Z", updatedAt: "2026-05-12T16:00:00Z", tags: [tags[5], tags[3]], createdBy: "u1", classification: "confidential" },
  { id: "d4", title: "ForgeOps AI System Diagram", type: "image", fileSize: "2.1 MB", uploadedAt: "2026-05-08T14:00:00Z", updatedAt: "2026-05-08T14:00:00Z", tags: [tags[0], tags[1]], createdBy: "u1", classification: "internal" },
  { id: "d5", title: "Investor Pitch Deck - Series A", type: "pdf", fileSize: "12.4 MB", uploadedAt: "2026-05-05T10:00:00Z", updatedAt: "2026-05-20T09:00:00Z", tags: [tags[9], tags[3]], createdBy: "u1", classification: "confidential" },
  { id: "d6", title: "CallAxisAI Integration Specs", type: "markdown", fileSize: "320 KB", uploadedAt: "2026-05-01T11:00:00Z", updatedAt: "2026-05-15T13:00:00Z", tags: [tags[6], tags[0]], createdBy: "u1", classification: "internal" },
  { id: "d7", title: "Security Audit Report - AegisVault", type: "pdf", fileSize: "3.7 MB", uploadedAt: "2026-04-28T09:00:00Z", updatedAt: "2026-04-30T17:00:00Z", tags: [tags[4], tags[10]], createdBy: "u1", classification: "top-secret" },
  { id: "d8", title: "DistrictIQ Market Analysis", type: "document", fileSize: "1.5 MB", uploadedAt: "2026-04-25T10:00:00Z", updatedAt: "2026-05-02T14:00:00Z", tags: [tags[3], tags[5]], createdBy: "u1", classification: "internal" },
];

export const notes: SecureNote[] = [
  { id: "n1", title: "AegisPay Integration Strategy", content: "AegisPay should integrate directly with ForgeOps for automated billing and payment processing. Key considerations:\n\n1. Payment gateway selection - Stripe vs custom solution\n2. Multi-currency support from day one\n3. Subscription management tied to AegisOS licensing\n4. Revenue split architecture for ecosystem partners\n\nNeed to discuss with Microsoft partnership team about potential co-branded payment flows.", createdAt: "2026-05-22T10:00:00Z", updatedAt: "2026-05-24T16:00:00Z", tags: [tags[5], tags[6]], createdBy: "u1", isPinned: true, projectId: "p3", classification: "confidential" },
  { id: "n2", title: "Vector Embedding Architecture Notes", content: "For AegisVault's AI retrieval system, we need:\n\n- pgvector for PostgreSQL-native vector storage\n- OpenAI Ada-002 or custom embedding model\n- Chunking strategy: 512 tokens with 50-token overlap\n- Metadata filtering before vector search\n- Hybrid search: BM25 + vector similarity\n\nThis will power natural language queries across the entire vault.", createdAt: "2026-05-20T14:00:00Z", updatedAt: "2026-05-23T09:00:00Z", tags: [tags[1], tags[0]], createdBy: "u1", isPinned: true, projectId: "p1", classification: "internal" },
  { id: "n3", title: "Founder OS Vision Document", content: "Founder OS is the meta-layer connecting all KahmannAI ecosystem products into a unified operational platform for founders.\n\nCore premise: Every founder needs a personal operating system that:\n- Tracks all decisions and their outcomes\n- Maintains relationship context across interactions\n- Provides AI-powered briefings before meetings\n- Reconstructs timelines of any project or partnership\n- Surfaces forgotten commitments and follow-ups\n\nAegisVault is the memory/storage layer. SignalDesk is the intelligence layer. ForgeOps is the execution layer.", createdAt: "2026-05-18T08:00:00Z", updatedAt: "2026-05-21T11:00:00Z", tags: [tags[3], tags[11]], createdBy: "u1", isPinned: true, projectId: "p5", classification: "confidential" },
  { id: "n4", title: "Infrastructure Cost Analysis", content: "Current monthly cloud spend:\n- AWS: $4,200\n- Vercel: $320\n- Supabase: $275\n- OpenAI API: $1,800\n- Monitoring: $150\n\nTotal: ~$6,745/mo\n\nProjected at scale (10K users): ~$28K/mo\nTarget margin: 70%+ at scale\n\nNeed to evaluate reserved instances and committed use discounts.", createdAt: "2026-05-15T10:00:00Z", updatedAt: "2026-05-19T15:00:00Z", tags: [tags[7], tags[5]], createdBy: "u1", isPinned: false, classification: "confidential" },
  { id: "n5", title: "SignalDesk Alpha Requirements", content: "SignalDesk v0.1 needs to support:\n- Real-time signal ingestion from 5+ sources\n- AI-powered signal classification\n- Alert routing based on user-defined rules\n- Dashboard with signal timeline\n- Integration hooks for AegisVault storage\n\nAlpha launch target: July 2026\nBeta target: September 2026", createdAt: "2026-05-12T09:00:00Z", updatedAt: "2026-05-17T14:00:00Z", tags: [tags[6], tags[1]], createdBy: "u1", isPinned: false, projectId: "p4", classification: "internal" },
  { id: "n6", title: "Competitive Analysis - Intelligence Platforms", content: "Key competitors in the operational intelligence space:\n\n1. Notion - Strong knowledge management, weak on security\n2. Obsidian - Great for personal use, limited team features\n3. Palantir Foundry - Enterprise-grade but prohibitively expensive\n4. Roam Research - Good graph features, limited enterprise\n\nAegisVault differentiators:\n- AI-native from ground up\n- Founder-centric memory architecture\n- Ecosystem integration (not standalone)\n- Security-first design\n- Operational timeline reconstruction", createdAt: "2026-05-08T11:00:00Z", updatedAt: "2026-05-14T10:00:00Z", tags: [tags[3], tags[6]], createdBy: "u1", isPinned: false, classification: "internal" },
];

export const memories: MemoryEntry[] = [
  { id: "m1", type: "decision", title: "Chose Supabase over Firebase for AegisVault", content: "After evaluating Firebase, Supabase, and PlanetScale, decided on Supabase for AegisVault backend. Key factors: PostgreSQL native (needed for pgvector), open source, row-level security, real-time subscriptions, and better pricing at scale.", date: "2026-05-22T14:00:00Z", tags: [tags[0], tags[1]], linkedPeople: ["Brendon Kahmann"], linkedProjects: ["AegisVault"], importance: "high" },
  { id: "m2", type: "conversation", title: "Call with Microsoft Azure team about partnership", content: "Discussed potential integration of KahmannAI ecosystem with Azure Marketplace. Microsoft interested in AegisOS as a managed service. Key takeaway: They want a POC by Q3 2026. Need to allocate engineering resources.", date: "2026-05-20T16:00:00Z", tags: [tags[2], tags[3]], linkedPeople: ["Sarah Chen", "David Park"], linkedProjects: ["AegisOS", "Microsoft Partnership"], importance: "critical" },
  { id: "m3", type: "idea", title: "AI Memory Graph - Persistent Context Engine", content: "What if AegisVault could maintain a persistent AI context that evolves with every interaction? Not just storing memories but understanding the relationships between them. A founder could ask 'how did we get here?' about any project and get a complete narrative reconstruction.", date: "2026-05-18T23:00:00Z", tags: [tags[1], tags[6]], linkedPeople: ["Brendon Kahmann"], linkedProjects: ["AegisVault", "Founder OS"], importance: "high" },
  { id: "m4", type: "milestone", title: "CallAxisAI MVP Launch", content: "Successfully launched CallAxisAI minimum viable product. Platform handles AI-powered call routing, analytics, and CRM integration. Initial feedback from 3 beta customers is positive. Key metrics: 99.7% uptime, <200ms response time, 85% caller satisfaction.", date: "2026-05-15T10:00:00Z", tags: [tags[6], tags[11]], linkedPeople: ["Brendon Kahmann", "Alex Rivera"], linkedProjects: ["CallAxisAI"], importance: "critical" },
  { id: "m5", type: "decision", title: "Established IronReserve Holdings as parent entity", content: "Formally established IronReserve Holdings as the parent holding company for the KahmannAI ecosystem. This provides better IP protection, tax optimization, and clearer ownership structure across AegisOS, CallAxisAI, ForgeOps, and future products.", date: "2026-05-10T09:00:00Z", tags: [tags[8], tags[3]], linkedPeople: ["Brendon Kahmann", "Legal Team"], linkedProjects: ["IronReserve Holdings"], importance: "critical" },
  { id: "m6", type: "note", title: "DistrictIQ pivot consideration", content: "DistrictIQ as standalone product may not have sufficient TAM. Consider pivoting to a module within AegisOS that provides district-level intelligence for municipal clients. This aligns better with the ecosystem strategy.", date: "2026-05-08T15:00:00Z", tags: [tags[3], tags[6]], linkedPeople: ["Brendon Kahmann"], linkedProjects: ["DistrictIQ", "AegisOS"], importance: "medium" },
  { id: "m7", type: "event", title: "Y Combinator office hours", content: "Attended YC office hours. Feedback: Focus on one product first (AegisOS), prove PMF, then expand ecosystem. Investor interest is high for AI infrastructure plays. Suggested connecting with Sequoia scout.", date: "2026-05-05T14:00:00Z", tags: [tags[9], tags[3]], linkedPeople: ["Brendon Kahmann", "YC Partners"], linkedProjects: ["IronReserve Holdings"], importance: "high" },
  { id: "m8", type: "idea", title: "Secure AI Recall - Local-first encrypted memory", content: "Build a local-first encrypted memory system that syncs to AegisVault cloud. Users can capture screenshots, voice notes, and text that gets AI-indexed locally before encrypted sync. Privacy-first approach to founder memory.", date: "2026-05-03T21:00:00Z", tags: [tags[4], tags[1]], linkedPeople: ["Brendon Kahmann"], linkedProjects: ["AegisVault"], importance: "medium" },
  { id: "m9", type: "conversation", title: "Investor intro from Naval via Twitter DM", content: "Naval Ravikant connected us with an angel investor interested in AI infrastructure. Meeting scheduled for next week. Need to prepare custom demo focusing on AegisOS enterprise capabilities.", date: "2026-05-01T18:00:00Z", tags: [tags[9], tags[3]], linkedPeople: ["Brendon Kahmann", "Naval Ravikant"], linkedProjects: ["IronReserve Holdings"], importance: "high" },
  { id: "m10", type: "milestone", title: "AegisVault prototype complete", content: "First working prototype of AegisVault with secure document storage, basic AI search, and timeline view. Ready for internal testing. Next phase: relationship intelligence and knowledge graph.", date: "2026-04-28T17:00:00Z", tags: [tags[6], tags[0]], linkedPeople: ["Brendon Kahmann"], linkedProjects: ["AegisVault"], importance: "high" },
];

export const projects: Project[] = [
  { id: "p1", name: "AegisVault", description: "AI-native secure memory, knowledge, document, and operational intelligence vault", status: "active", startDate: "2026-04-01", tags: [tags[0], tags[1], tags[4]], team: ["Brendon Kahmann", "Alex Rivera", "Sarah Chen"], linkedProducts: ["AegisOS", "Founder OS"], noteCount: 24, decisionCount: 8, progress: 45, priority: "critical" },
  { id: "p2", name: "AegisOS", description: "Core operating system for AI-native organizations", status: "active", startDate: "2026-01-15", tags: [tags[0], tags[6]], team: ["Brendon Kahmann", "Marcus Liu", "Elena Vasquez"], linkedProducts: ["AegisVault", "ForgeOps AI", "AegisOSAI"], noteCount: 67, decisionCount: 23, progress: 62, priority: "critical" },
  { id: "p3", name: "AegisPay", description: "Integrated payment and billing system for the KahmannAI ecosystem", status: "planning", startDate: "2026-06-01", tags: [tags[5], tags[6]], team: ["Brendon Kahmann", "Jordan Blake"], linkedProducts: ["ForgeOps AI", "AegisOS"], noteCount: 8, decisionCount: 3, progress: 15, priority: "high" },
  { id: "p4", name: "SignalDesk", description: "Real-time signal intelligence and alert routing platform", status: "planning", startDate: "2026-05-15", tags: [tags[1], tags[6]], team: ["Brendon Kahmann", "Alex Rivera"], linkedProducts: ["AegisVault", "AegisOS"], noteCount: 12, decisionCount: 5, progress: 20, priority: "high" },
  { id: "p5", name: "Founder OS", description: "Meta-layer connecting all ecosystem products for founder productivity", status: "planning", startDate: "2026-07-01", tags: [tags[3], tags[11]], team: ["Brendon Kahmann"], linkedProducts: ["AegisVault", "AegisOS", "SignalDesk", "ForgeOps AI"], noteCount: 6, decisionCount: 2, progress: 10, priority: "medium" },
  { id: "p6", name: "CallAxisAI", description: "AI-powered call routing, analytics, and CRM intelligence", status: "active", startDate: "2026-02-01", tags: [tags[1], tags[6]], team: ["Brendon Kahmann", "Alex Rivera", "Maya Patel"], linkedProducts: ["AegisOS"], noteCount: 34, decisionCount: 15, progress: 78, priority: "high" },
  { id: "p7", name: "ForgeOps AI", description: "AI-driven DevOps and infrastructure management platform", status: "active", startDate: "2026-03-01", tags: [tags[0], tags[7]], team: ["Brendon Kahmann", "Marcus Liu"], linkedProducts: ["AegisOS", "AegisVault"], noteCount: 19, decisionCount: 9, progress: 55, priority: "high" },
  { id: "p8", name: "Microsoft Partnership", description: "Strategic partnership with Microsoft for Azure Marketplace integration", status: "active", startDate: "2026-04-15", tags: [tags[2], tags[3]], team: ["Brendon Kahmann", "Sarah Chen"], linkedProducts: ["AegisOS"], noteCount: 11, decisionCount: 4, progress: 30, priority: "critical" },
  { id: "p9", name: "DistrictIQ", description: "District-level intelligence platform for municipal and enterprise clients", status: "on-hold", startDate: "2026-03-15", tags: [tags[3], tags[6]], team: ["Brendon Kahmann"], linkedProducts: ["AegisOS"], noteCount: 9, decisionCount: 6, progress: 25, priority: "low" },
];

export const relationships: Relationship[] = [
  { id: "r1", name: "Sarah Chen", type: "partner", company: "Microsoft", role: "Azure Partnerships Lead", email: "sarah.chen@microsoft.com", strategicImportance: "critical", linkedProjects: ["Microsoft Partnership", "AegisOS"], lastContact: "2026-05-20T16:00:00Z", notes: "Key champion for KahmannAI within Microsoft. Driving Azure Marketplace integration.", tags: [tags[2], tags[3]], communicationHistory: [
    { id: "c1", type: "meeting", subject: "Azure integration planning", summary: "Discussed POC timeline and resource allocation", date: "2026-05-20T16:00:00Z", participants: ["Brendon Kahmann", "Sarah Chen", "David Park"] },
    { id: "c2", type: "email", subject: "Partnership MOU draft", summary: "Shared initial MOU for legal review", date: "2026-05-15T10:00:00Z", participants: ["Brendon Kahmann", "Sarah Chen"] },
  ]},
  { id: "r2", name: "David Park", type: "partner", company: "Microsoft", role: "Senior PM - Azure AI", email: "david.park@microsoft.com", strategicImportance: "high", linkedProjects: ["Microsoft Partnership"], lastContact: "2026-05-20T16:00:00Z", notes: "Technical contact at Microsoft. Evaluating AegisOS for Azure AI services integration.", tags: [tags[2], tags[1]], communicationHistory: [
    { id: "c3", type: "meeting", subject: "Technical review of AegisOS APIs", summary: "Reviewed API compatibility with Azure services", date: "2026-05-18T14:00:00Z", participants: ["Brendon Kahmann", "David Park", "Marcus Liu"] },
  ]},
  { id: "r3", name: "Alex Rivera", type: "collaborator", company: "IronReserve Holdings", role: "Lead Engineer", email: "alex@ironreserve.io", strategicImportance: "critical", linkedProjects: ["AegisVault", "CallAxisAI", "SignalDesk"], lastContact: "2026-05-24T09:00:00Z", notes: "Core technical co-builder. Leads engineering on CallAxisAI and contributes to AegisVault.", tags: [tags[0], tags[11]], communicationHistory: [
    { id: "c4", type: "meeting", subject: "Sprint planning - Week 21", summary: "Planned AegisVault timeline module and CallAxisAI bug fixes", date: "2026-05-24T09:00:00Z", participants: ["Brendon Kahmann", "Alex Rivera"] },
  ]},
  { id: "r4", name: "Victoria Reeves", type: "investor", company: "Apex Ventures", role: "Managing Partner", email: "victoria@apexvc.com", strategicImportance: "critical", linkedProjects: ["IronReserve Holdings"], lastContact: "2026-05-12T15:00:00Z", notes: "Interested in leading Series A. Wants to see AegisOS PMF metrics by Q3.", tags: [tags[9], tags[3]], communicationHistory: [
    { id: "c5", type: "call", subject: "Series A timeline discussion", summary: "Discussed fundraising timeline, valuation expectations, and milestone targets", date: "2026-05-12T15:00:00Z", participants: ["Brendon Kahmann", "Victoria Reeves"] },
    { id: "c6", type: "email", subject: "Due diligence document request", summary: "Sent preliminary due diligence package", date: "2026-05-08T10:00:00Z", participants: ["Brendon Kahmann", "Victoria Reeves"] },
  ]},
  { id: "r5", name: "Marcus Liu", type: "collaborator", company: "IronReserve Holdings", role: "Infrastructure Lead", email: "marcus@ironreserve.io", strategicImportance: "high", linkedProjects: ["AegisOS", "ForgeOps AI"], lastContact: "2026-05-23T11:00:00Z", notes: "Leading AegisOS infrastructure and ForgeOps AI development.", tags: [tags[0], tags[7]], communicationHistory: [] },
  { id: "r6", name: "Naval Ravikant", type: "advisor", company: "AngelList", role: "Founder & Advisor", strategicImportance: "high", linkedProjects: ["IronReserve Holdings"], lastContact: "2026-05-01T18:00:00Z", notes: "Connected us with potential angel investors. Interested in AI infrastructure thesis.", tags: [tags[9], tags[3]], communicationHistory: [
    { id: "c7", type: "message", subject: "Investor intro via DM", summary: "Introduced angel investor interested in AI infra", date: "2026-05-01T18:00:00Z", participants: ["Brendon Kahmann", "Naval Ravikant"] },
  ]},
];

export const meetings: Meeting[] = [
  { id: "mt1", title: "Microsoft Azure Partnership Review", date: "2026-05-20T16:00:00Z", duration: 60, attendees: ["Brendon Kahmann", "Sarah Chen", "David Park"], summary: "Reviewed partnership progress and agreed on POC timeline. Microsoft committed engineering resources for Azure Marketplace integration. Key blocker: need to finalize API compatibility layer by June 15.", keyDecisions: ["POC deadline set for August 2026", "Microsoft to assign 2 engineers", "Weekly sync meetings starting June"], followUpTasks: [
    { id: "ft1", title: "Prepare API compatibility assessment", assignee: "Marcus Liu", dueDate: "2026-06-01", status: "in-progress", priority: "high" },
    { id: "ft2", title: "Draft integration architecture document", assignee: "Brendon Kahmann", dueDate: "2026-06-10", status: "pending", priority: "high" },
  ], linkedProjects: ["Microsoft Partnership", "AegisOS"], tags: [tags[2], tags[3]] },
  { id: "mt2", title: "Weekly Engineering Standup", date: "2026-05-24T09:00:00Z", duration: 30, attendees: ["Brendon Kahmann", "Alex Rivera", "Marcus Liu", "Maya Patel"], summary: "Sprint review: AegisVault timeline module 80% complete, CallAxisAI bug fixes deployed, ForgeOps CI/CD pipeline improvements merged. Discussed AegisPay architecture decisions.", keyDecisions: ["Prioritize AegisVault search over knowledge graph", "Deploy CallAxisAI hotfix by EOD"], followUpTasks: [
    { id: "ft3", title: "Complete AegisVault timeline UI", assignee: "Alex Rivera", dueDate: "2026-05-28", status: "in-progress", priority: "high" },
    { id: "ft4", title: "Write AegisPay architecture RFC", assignee: "Brendon Kahmann", dueDate: "2026-06-05", status: "pending", priority: "medium" },
  ], linkedProjects: ["AegisVault", "CallAxisAI", "ForgeOps AI", "AegisPay"], tags: [tags[7], tags[0]] },
  { id: "mt3", title: "Investor Update Call - Apex Ventures", date: "2026-05-12T15:00:00Z", duration: 45, attendees: ["Brendon Kahmann", "Victoria Reeves"], summary: "Shared Q2 progress update. Victoria expressed strong interest in leading Series A. Discussed valuation expectations ($15-20M pre-money). Key ask: demonstrate AegisOS PMF with 3+ paying enterprise clients by Q3.", keyDecisions: ["Target Series A close by October 2026", "Prepare detailed metrics dashboard for investors"], followUpTasks: [
    { id: "ft5", title: "Build investor metrics dashboard", assignee: "Brendon Kahmann", dueDate: "2026-06-15", status: "pending", priority: "high" },
    { id: "ft6", title: "Identify 3 enterprise pilot candidates", assignee: "Brendon Kahmann", dueDate: "2026-06-01", status: "in-progress", priority: "critical" },
  ], linkedProjects: ["IronReserve Holdings"], tags: [tags[9], tags[5]] },
  { id: "mt4", title: "AegisVault Security Architecture Review", date: "2026-05-08T14:00:00Z", duration: 90, attendees: ["Brendon Kahmann", "Alex Rivera", "Marcus Liu"], summary: "Deep dive into AegisVault security architecture. Reviewed encryption at rest, in transit, and field-level encryption for sensitive vault entries. Decided on zero-knowledge architecture for top-secret classified documents.", keyDecisions: ["Adopt AES-256-GCM for field-level encryption", "Implement zero-knowledge proofs for top-secret docs", "Monthly security audits starting June"], followUpTasks: [
    { id: "ft7", title: "Implement field-level encryption", assignee: "Marcus Liu", dueDate: "2026-06-15", status: "pending", priority: "critical" },
  ], linkedProjects: ["AegisVault"], tags: [tags[4], tags[0]] },
];

export const decisions: Decision[] = [
  { id: "dc1", title: "Adopt Supabase as primary backend for AegisVault", description: "Selected Supabase over Firebase and PlanetScale for AegisVault's backend infrastructure", date: "2026-05-22T14:00:00Z", madeBy: "Brendon Kahmann", rationale: "PostgreSQL native (essential for pgvector), open source, built-in RLS, real-time subscriptions, and significantly better pricing at scale compared to Firebase. PlanetScale lacks native vector search.", impact: "high", status: "implemented", linkedProjects: ["AegisVault"], linkedPeople: ["Brendon Kahmann", "Alex Rivera"], tags: [tags[0], tags[1]] },
  { id: "dc2", title: "Establish IronReserve Holdings as parent entity", description: "Created IronReserve Holdings as the parent holding company for all KahmannAI ecosystem products", date: "2026-05-10T09:00:00Z", madeBy: "Brendon Kahmann", rationale: "Provides better IP protection across products, enables tax optimization through proper corporate structure, clearer ownership for investor discussions, and future M&A flexibility.", impact: "critical", status: "implemented", linkedProjects: ["IronReserve Holdings"], linkedPeople: ["Brendon Kahmann", "Legal Team"], tags: [tags[8], tags[3]] },
  { id: "dc3", title: "Prioritize AegisOS enterprise features over consumer launch", description: "Focus engineering resources on enterprise capabilities rather than consumer-facing features", date: "2026-05-05T11:00:00Z", madeBy: "Brendon Kahmann", rationale: "Enterprise clients provide higher ACV, more predictable revenue, and better case studies for fundraising. Consumer launch deferred to Q1 2027.", impact: "critical", status: "approved", linkedProjects: ["AegisOS"], linkedPeople: ["Brendon Kahmann", "Victoria Reeves"], tags: [tags[3], tags[5]] },
  { id: "dc4", title: "Put DistrictIQ on hold, pivot to AegisOS module", description: "Pause standalone DistrictIQ development, reconceptualize as AegisOS module", date: "2026-05-08T15:00:00Z", madeBy: "Brendon Kahmann", rationale: "Insufficient TAM as standalone product. Better positioned as a vertical module within AegisOS, serving municipal and enterprise clients who already use the platform.", impact: "medium", status: "approved", linkedProjects: ["DistrictIQ", "AegisOS"], linkedPeople: ["Brendon Kahmann"], tags: [tags[3], tags[6]] },
  { id: "dc5", title: "Adopt zero-knowledge architecture for top-secret vault entries", description: "Implement zero-knowledge proofs for the highest classification level in AegisVault", date: "2026-05-08T14:00:00Z", madeBy: "Brendon Kahmann", rationale: "Enterprise clients require assurance that even AegisVault operators cannot access their most sensitive data. Zero-knowledge architecture provides this guarantee and is a strong competitive differentiator.", impact: "high", status: "approved", linkedProjects: ["AegisVault"], linkedPeople: ["Brendon Kahmann", "Marcus Liu"], tags: [tags[4], tags[0]] },
];

export const knowledgeNodes: KnowledgeNode[] = [
  { id: "kn1", label: "AegisVault", type: "product", x: 400, y: 300, connections: ["kn2", "kn3", "kn5", "kn7", "kn10"] },
  { id: "kn2", label: "AegisOS", type: "product", x: 250, y: 200, connections: ["kn1", "kn3", "kn4", "kn6", "kn8", "kn9", "kn11"] },
  { id: "kn3", label: "ForgeOps AI", type: "product", x: 550, y: 200, connections: ["kn1", "kn2", "kn5"] },
  { id: "kn4", label: "CallAxisAI", type: "product", x: 150, y: 350, connections: ["kn2", "kn12"] },
  { id: "kn5", label: "AegisPay", type: "product", x: 550, y: 400, connections: ["kn1", "kn3"] },
  { id: "kn6", label: "SignalDesk", type: "product", x: 100, y: 200, connections: ["kn2", "kn10"] },
  { id: "kn7", label: "Founder OS", type: "product", x: 400, y: 150, connections: ["kn1", "kn2", "kn10"] },
  { id: "kn8", label: "Microsoft", type: "company", x: 300, y: 450, connections: ["kn2", "kn13", "kn14"] },
  { id: "kn9", label: "DistrictIQ", type: "product", x: 100, y: 450, connections: ["kn2"] },
  { id: "kn10", label: "Brendon Kahmann", type: "person", x: 350, y: 50, connections: ["kn1", "kn2", "kn6", "kn7", "kn11"] },
  { id: "kn11", label: "IronReserve Holdings", type: "company", x: 500, y: 50, connections: ["kn2", "kn10", "kn15"] },
  { id: "kn12", label: "Alex Rivera", type: "person", x: 50, y: 300, connections: ["kn4", "kn1"] },
  { id: "kn13", label: "Sarah Chen", type: "person", x: 200, y: 500, connections: ["kn8"] },
  { id: "kn14", label: "David Park", type: "person", x: 400, y: 500, connections: ["kn8"] },
  { id: "kn15", label: "Apex Ventures", type: "company", x: 600, y: 100, connections: ["kn11"] },
];

export const activityLogs: ActivityLog[] = [
  { id: "a1", action: "created", entity: "AegisPay Integration Strategy", entityType: "note", user: "Brendon Kahmann", timestamp: "2026-05-24T16:00:00Z" },
  { id: "a2", action: "updated", entity: "AegisOS Architecture Specification v3.2", entityType: "document", user: "Brendon Kahmann", timestamp: "2026-05-22T14:30:00Z" },
  { id: "a3", action: "decided", entity: "Adopt Supabase as primary backend", entityType: "decision", user: "Brendon Kahmann", timestamp: "2026-05-22T14:00:00Z" },
  { id: "a4", action: "completed", entity: "Microsoft Azure Partnership Review", entityType: "meeting", user: "Brendon Kahmann", timestamp: "2026-05-20T17:00:00Z" },
  { id: "a5", action: "uploaded", entity: "Microsoft Partnership Term Sheet", entityType: "document", user: "Brendon Kahmann", timestamp: "2026-05-18T11:00:00Z" },
  { id: "a6", action: "created", entity: "Founder OS Vision Document", entityType: "note", user: "Brendon Kahmann", timestamp: "2026-05-18T08:00:00Z" },
  { id: "a7", action: "launched", entity: "CallAxisAI", entityType: "project", user: "Brendon Kahmann", timestamp: "2026-05-15T10:00:00Z", details: "MVP launch with 3 beta customers" },
  { id: "a8", action: "updated", entity: "SignalDesk Alpha Requirements", entityType: "note", user: "Brendon Kahmann", timestamp: "2026-05-17T14:00:00Z" },
  { id: "a9", action: "met with", entity: "Victoria Reeves - Apex Ventures", entityType: "meeting", user: "Brendon Kahmann", timestamp: "2026-05-12T15:00:00Z" },
  { id: "a10", action: "created", entity: "DistrictIQ Market Analysis", entityType: "document", user: "Brendon Kahmann", timestamp: "2026-05-02T14:00:00Z" },
  { id: "a11", action: "decided", entity: "Prioritize enterprise over consumer", entityType: "decision", user: "Brendon Kahmann", timestamp: "2026-05-05T11:00:00Z" },
  { id: "a12", action: "connected", entity: "Naval Ravikant", entityType: "relationship", user: "Brendon Kahmann", timestamp: "2026-05-01T18:00:00Z" },
];

export const notifications: Notification[] = [
  { id: "nt1", title: "Meeting Tomorrow", message: "Microsoft Azure Partnership sync at 4:00 PM", type: "info", read: false, timestamp: "2026-05-24T18:00:00Z", actionUrl: "/meetings" },
  { id: "nt2", title: "Document Updated", message: "AegisOS Architecture Spec v3.2 has been updated", type: "success", read: false, timestamp: "2026-05-22T14:30:00Z", actionUrl: "/vault" },
  { id: "nt3", title: "Follow-up Overdue", message: "API compatibility assessment is due tomorrow", type: "warning", read: false, timestamp: "2026-05-24T09:00:00Z", actionUrl: "/projects" },
  { id: "nt4", title: "New Connection", message: "Naval Ravikant introduced angel investor", type: "info", read: true, timestamp: "2026-05-01T18:00:00Z", actionUrl: "/relationships" },
  { id: "nt5", title: "Security Alert", message: "Monthly security audit scheduled for June 1", type: "alert", read: true, timestamp: "2026-05-20T10:00:00Z", actionUrl: "/settings" },
];

export const aiSummaries: AISummary[] = [
  { id: "as1", type: "executive", title: "Weekly Executive Briefing", content: "**Key Developments (May 18-24, 2026)**\n\n• Microsoft partnership advancing — POC deadline set for August, 2 engineers committed\n• AegisVault development at 45% — timeline module nearing completion\n• CallAxisAI showing strong early metrics: 99.7% uptime, 85% satisfaction\n• Series A discussions progressing with Apex Ventures — target $15-20M pre-money\n\n**Requires Attention:**\n• API compatibility assessment due June 1\n• Need to identify 3 enterprise pilot candidates for AegisOS\n• DistrictIQ pivot decision needs team communication\n\n**Strategic Outlook:**\nEcosystem strategy is solidifying. Priority should remain on AegisOS enterprise PMF to support Series A timeline.", generatedAt: "2026-05-24T20:00:00Z", sourceCount: 34, confidence: 0.92 },
  { id: "as2", type: "project", title: "AegisVault Project Summary", content: "**Status:** Active (45% complete)\n**Team:** 3 core members\n**Timeline:** Started April 2026, targeting Q3 2026 for beta\n\n**Completed:**\n• Secure document storage with classification levels\n• Basic AI search with vector embeddings\n• Authentication and role-based access\n• Core data models and API layer\n\n**In Progress:**\n• Founder Memory Timeline (80%)\n• Knowledge Graph visualization\n• Relationship Intelligence module\n\n**Key Decisions:**\n• Supabase selected as backend\n• Zero-knowledge architecture for top-secret entries\n• pgvector for embedding storage\n\n**Risks:**\n• Vector search performance at scale untested\n• Zero-knowledge implementation complexity may delay Q3 target", generatedAt: "2026-05-24T20:00:00Z", sourceCount: 24, confidence: 0.88 },
  { id: "as3", type: "relationship", title: "Microsoft Partnership Intelligence", content: "**Partnership Status:** Active, progressing well\n**Key Contacts:** Sarah Chen (Partnerships Lead), David Park (Senior PM)\n**Strategic Value:** Critical — Azure Marketplace integration\n\n**Timeline:**\n• April 15: Initial partnership discussions\n• May 15: MOU draft shared\n• May 20: POC timeline agreed (August 2026)\n\n**Commitments:**\n• Microsoft: 2 dedicated engineers for integration\n• KahmannAI: API compatibility layer by June 15\n• Joint: Weekly sync meetings starting June\n\n**Opportunities:**\n• Azure Marketplace listing for AegisOS\n• Co-marketing potential\n• Azure AI services integration\n\n**Risks:**\n• API compatibility work is resource-intensive\n• Microsoft timelines may shift with internal priorities", generatedAt: "2026-05-24T20:00:00Z", sourceCount: 11, confidence: 0.85 },
  { id: "as4", type: "operational", title: "Operational Health Snapshot", content: "**Infrastructure:**\n• Monthly cloud spend: $6,745\n• All services operational (99.9%+ uptime)\n• Security audit scheduled for June 1\n\n**Team:**\n• 5 active team members across 4 products\n• Engineering capacity stretched across too many projects\n• Need to hire 2-3 more engineers by Q3\n\n**Financial:**\n• Burn rate: ~$45K/month (including team + infrastructure)\n• Runway: 14 months at current burn\n• Series A target: October 2026\n\n**Product Health:**\n• CallAxisAI: Production, strong early metrics\n• AegisOS: Active development, enterprise focus\n• AegisVault: Active development, 45% complete\n• ForgeOps AI: Active development, 55% complete\n• SignalDesk: Planning phase\n• DistrictIQ: On hold (pivot to AegisOS module)", generatedAt: "2026-05-24T20:00:00Z", sourceCount: 42, confidence: 0.90 },
];

export const integrations: Integration[] = [
  { id: "i1", name: "AegisOSAI", description: "AI intelligence layer for AegisOS", icon: "brain", status: "coming-soon", category: "ecosystem" },
  { id: "i2", name: "Aegis Core", description: "Core infrastructure services", icon: "server", status: "coming-soon", category: "ecosystem" },
  { id: "i3", name: "ForgeOps AI", description: "AI-driven DevOps platform", icon: "hammer", status: "available", category: "ecosystem" },
  { id: "i4", name: "SignalDesk", description: "Signal intelligence platform", icon: "radio", status: "coming-soon", category: "ecosystem" },
  { id: "i5", name: "CallAxisAI", description: "AI call routing & analytics", icon: "phone", status: "available", category: "ecosystem" },
  { id: "i6", name: "Founder OS", description: "Founder productivity meta-layer", icon: "crown", status: "coming-soon", category: "ecosystem" },
  { id: "i7", name: "Google Drive", description: "Cloud document storage", icon: "cloud", status: "available", category: "storage" },
  { id: "i8", name: "OneDrive", description: "Microsoft cloud storage", icon: "cloud", status: "available", category: "storage" },
  { id: "i9", name: "Dropbox", description: "File hosting service", icon: "box", status: "available", category: "storage" },
  { id: "i10", name: "Local AI Indexing", description: "On-device AI document indexing", icon: "cpu", status: "coming-soon", category: "ai" },
  { id: "i11", name: "OCR Pipeline", description: "Optical character recognition", icon: "scan", status: "coming-soon", category: "ai" },
  { id: "i12", name: "Speech-to-Text", description: "Audio transcription service", icon: "mic", status: "coming-soon", category: "ai" },
  { id: "i13", name: "Vector Embeddings", description: "AI vector search engine", icon: "search", status: "available", category: "ai" },
  { id: "i14", name: "Slack", description: "Team communication platform", icon: "message-square", status: "available", category: "communication" },
  { id: "i15", name: "Microsoft Teams", description: "Enterprise communication", icon: "users", status: "available", category: "communication" },
];
