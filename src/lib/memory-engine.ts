import type {
  MemoryNode, MemoryCluster, MemoryLink, MemorySummary,
  MemorySearchResult, MemoryGraphNode, MemoryType, MemoryStatus,
} from "@/types";

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "to", "of", "in", "for",
  "on", "with", "at", "by", "from", "as", "into", "through", "during",
  "before", "after", "above", "below", "between", "out", "off", "over",
  "under", "again", "further", "then", "once", "here", "there", "when",
  "where", "why", "how", "all", "both", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same",
  "so", "than", "too", "very", "just", "about", "and", "but", "or",
  "if", "while", "what", "which", "who", "whom", "this", "that", "these",
  "those", "i", "me", "my", "we", "our", "you", "your", "he", "she",
  "it", "they", "them", "their", "its", "show", "find", "get", "tell",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

function computeTFIDF(tokens: string[], corpus: string[][]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) || 0) + 1);
  }
  const scores = new Map<string, number>();
  const N = corpus.length;
  for (const [term, count] of tf) {
    const termFreq = count / tokens.length;
    const docCount = corpus.filter((doc) => doc.includes(term)).length || 1;
    const idf = Math.log(N / docCount);
    scores.set(term, termFreq * idf);
  }
  return scores;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, magA = 0, magB = 0;
  for (const [key, val] of a) {
    dot += val * (b.get(key) || 0);
    magA += val * val;
  }
  for (const [, val] of b) {
    magB += val * val;
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export class MemoryEngine {
  private memories: MemoryNode[];
  private clusters: MemoryCluster[];
  private links: MemoryLink[];
  private summaries: MemorySummary[];
  private corpus: string[][];
  private tfidfCache: Map<string, Map<string, number>>;

  constructor(
    memories: MemoryNode[],
    clusters: MemoryCluster[],
    links: MemoryLink[],
    summaries: MemorySummary[],
  ) {
    this.memories = memories;
    this.clusters = clusters;
    this.links = links;
    this.summaries = summaries;
    this.corpus = memories.map((m) => tokenize(m.title + " " + m.content + " " + m.summary));
    this.tfidfCache = new Map();
    this.buildIndex();
  }

  private buildIndex() {
    for (let i = 0; i < this.memories.length; i++) {
      const m = this.memories[i];
      const tokens = this.corpus[i];
      this.tfidfCache.set(m.id, computeTFIDF(tokens, this.corpus));
    }
  }

  search(query: string, limit = 20): MemorySearchResult[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const queryVec = computeTFIDF(queryTokens, this.corpus);
    const results: MemorySearchResult[] = [];

    for (const memory of this.memories) {
      const memVec = this.tfidfCache.get(memory.id);
      if (!memVec) continue;

      let similarity = cosineSimilarity(queryVec, memVec);

      const titleLower = memory.title.toLowerCase();
      const contentLower = memory.content.toLowerCase();
      const queryLower = query.toLowerCase();

      if (titleLower.includes(queryLower)) similarity += 0.3;
      for (const token of queryTokens) {
        if (titleLower.includes(token)) similarity += 0.1;
      }

      similarity += memory.importance * 0.05;
      similarity += Math.min(memory.accessCount / 100, 0.1);

      if (memory.status === "pinned") similarity += 0.05;

      const matchedTerms = queryTokens.filter(
        (t) => titleLower.includes(t) || contentLower.includes(t)
      );

      if (similarity > 0.05 || matchedTerms.length > 0) {
        const snippetStart = contentLower.indexOf(matchedTerms[0] || "");
        const start = Math.max(0, snippetStart - 40);
        const contextSnippet = memory.content.substring(start, start + 200);

        results.push({
          memory,
          relevance: Math.min(similarity * 100, 100),
          matchedTerms,
          contextSnippet: contextSnippet || memory.summary,
        });
      }
    }

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, limit);
  }

  findSimilar(memoryId: string, limit = 5): MemoryNode[] {
    const sourceVec = this.tfidfCache.get(memoryId);
    if (!sourceVec) return [];

    const scores: { memory: MemoryNode; score: number }[] = [];
    for (const memory of this.memories) {
      if (memory.id === memoryId) continue;
      const memVec = this.tfidfCache.get(memory.id);
      if (!memVec) continue;
      const score = cosineSimilarity(sourceVec, memVec);
      if (score > 0) scores.push({ memory, score });
    }

    return scores.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.memory);
  }

  getLinkedMemories(memoryId: string): { memory: MemoryNode; link: MemoryLink }[] {
    const related: { memory: MemoryNode; link: MemoryLink }[] = [];
    for (const link of this.links) {
      let targetId: string | null = null;
      if (link.sourceId === memoryId) targetId = link.targetId;
      else if (link.targetId === memoryId) targetId = link.sourceId;
      if (targetId) {
        const memory = this.memories.find((m) => m.id === targetId);
        if (memory) related.push({ memory, link });
      }
    }
    return related;
  }

  getCluster(clusterId: string): { cluster: MemoryCluster; memories: MemoryNode[] } | null {
    const cluster = this.clusters.find((c) => c.id === clusterId);
    if (!cluster) return null;
    const memories = this.memories.filter((m) => cluster.memoryIds.includes(m.id));
    return { cluster, memories };
  }

  getAllClusters(): { cluster: MemoryCluster; memories: MemoryNode[]; recentActivity: string }[] {
    return this.clusters.map((cluster) => {
      const memories = this.memories.filter((m) => cluster.memoryIds.includes(m.id));
      const mostRecent = memories.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
      return { cluster, memories, recentActivity: mostRecent?.updatedAt || cluster.createdAt };
    });
  }

  getTimeline(filters?: { type?: MemoryType; project?: string; person?: string }): MemoryNode[] {
    let filtered = [...this.memories];
    if (filters?.type) filtered = filtered.filter((m) => m.type === filters.type);
    if (filters?.project) filtered = filtered.filter((m) => m.linkedProjects.includes(filters.project!));
    if (filters?.person) filtered = filtered.filter((m) => m.linkedPeople.includes(filters.person!));
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getMemoryGraph(): MemoryGraphNode[] {
    const nodes: MemoryGraphNode[] = [];
    const people = new Set<string>();
    const projects = new Set<string>();

    for (const m of this.memories) {
      m.linkedPeople.forEach((p) => people.add(p));
      m.linkedProjects.forEach((p) => projects.add(p));
    }

    const totalNodes = this.memories.length + people.size + projects.size;
    const radius = 300;

    this.memories.forEach((m, i) => {
      const angle = (i / this.memories.length) * Math.PI * 2;
      const r = radius * (0.5 + m.importance * 0.5);
      nodes.push({
        id: m.id, label: m.title.substring(0, 30), type: m.type,
        x: 400 + Math.cos(angle) * r, y: 350 + Math.sin(angle) * r,
        size: 6 + m.importance * 8, importance: m.importance,
        connections: [
          ...m.linkedMemories,
          ...m.linkedPeople.map((p) => `person-${p}`),
          ...m.linkedProjects.map((p) => `project-${p}`),
        ],
      });
    });

    let idx = 0;
    for (const person of people) {
      const angle = (idx / people.size) * Math.PI * 2;
      const connectedMemories = this.memories.filter((m) => m.linkedPeople.includes(person));
      nodes.push({
        id: `person-${person}`, label: person, type: "person",
        x: 400 + Math.cos(angle) * (radius * 1.3), y: 350 + Math.sin(angle) * (radius * 1.3),
        size: 8 + connectedMemories.length * 2, importance: connectedMemories.length / this.memories.length,
        connections: connectedMemories.map((m) => m.id),
      });
      idx++;
    }

    idx = 0;
    for (const project of projects) {
      const angle = (idx / projects.size) * Math.PI * 2 + Math.PI / projects.size;
      const connectedMemories = this.memories.filter((m) => m.linkedProjects.includes(project));
      nodes.push({
        id: `project-${project}`, label: project, type: "project",
        x: 400 + Math.cos(angle) * (radius * 1.6), y: 350 + Math.sin(angle) * (radius * 1.6),
        size: 10 + connectedMemories.length * 2, importance: connectedMemories.length / this.memories.length,
        connections: connectedMemories.map((m) => m.id),
      });
      idx++;
    }

    return nodes;
  }

  getStats() {
    const total = this.memories.length;
    const pinned = this.memories.filter((m) => m.status === "pinned").length;
    const archived = this.memories.filter((m) => m.status === "archived").length;
    const active = total - archived;
    const totalAccesses = this.memories.reduce((sum, m) => sum + m.accessCount, 0);
    const avgImportance = this.memories.reduce((sum, m) => sum + m.importance, 0) / total;
    const typeDistribution: Record<string, number> = {};
    for (const m of this.memories) {
      typeDistribution[m.type] = (typeDistribution[m.type] || 0) + 1;
    }
    const uniquePeople = new Set(this.memories.flatMap((m) => m.linkedPeople)).size;
    const uniqueProjects = new Set(this.memories.flatMap((m) => m.linkedProjects)).size;

    return {
      total, pinned, archived, active, totalAccesses, avgImportance,
      typeDistribution, uniquePeople, uniqueProjects,
      clusterCount: this.clusters.length, linkCount: this.links.length,
      summaryCount: this.summaries.length,
    };
  }

  getMemoryById(id: string): MemoryNode | undefined {
    return this.memories.find((m) => m.id === id);
  }

  getAllMemories(): MemoryNode[] {
    return this.memories;
  }

  getAllLinks(): MemoryLink[] {
    return this.links;
  }

  getSummaries(): MemorySummary[] {
    return this.summaries;
  }

  getPinnedMemories(): MemoryNode[] {
    return this.memories.filter((m) => m.status === "pinned").sort((a, b) => b.importance - a.importance);
  }

  getRecentMemories(limit = 10): MemoryNode[] {
    return [...this.memories].sort((a, b) => new Date(b.accessedAt).getTime() - new Date(a.accessedAt).getTime()).slice(0, limit);
  }

  getMostAccessed(limit = 10): MemoryNode[] {
    return [...this.memories].sort((a, b) => b.accessCount - a.accessCount).slice(0, limit);
  }

  getMemoriesByType(type: MemoryType): MemoryNode[] {
    return this.memories.filter((m) => m.type === type);
  }

  getMemoriesByProject(project: string): MemoryNode[] {
    return this.memories.filter((m) => m.linkedProjects.includes(project));
  }

  getMemoriesByPerson(person: string): MemoryNode[] {
    return this.memories.filter((m) => m.linkedPeople.includes(person));
  }

  quickRecall(query: string): { memories: MemorySearchResult[]; summary: string; relatedClusters: MemoryCluster[] } {
    const memories = this.search(query, 5);
    const clusterIds = new Set(memories.map((r) => r.memory.clusterId).filter(Boolean));
    const relatedClusters = this.clusters.filter((c) => clusterIds.has(c.id));

    let summary = "";
    if (memories.length > 0) {
      const topMemory = memories[0];
      const related = this.getLinkedMemories(topMemory.memory.id);
      summary = `Found ${memories.length} relevant memories. Most relevant: "${topMemory.memory.title}" (${Math.round(topMemory.relevance)}% match). `;
      if (related.length > 0) {
        summary += `Connected to ${related.length} other memories. `;
      }
      if (relatedClusters.length > 0) {
        summary += `Part of ${relatedClusters.map((c) => c.label).join(", ")} cluster${relatedClusters.length > 1 ? "s" : ""}.`;
      }
    } else {
      summary = "No memories found matching your query. Try different keywords or browse memory clusters.";
    }

    return { memories, summary, relatedClusters };
  }
}
