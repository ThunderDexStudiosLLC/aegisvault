import type {
  EcosystemProduct, EcosystemLink, EcosystemWorkflow,
  EcosystemRecommendation, EcosystemGraphNode,
} from "@/types";

export class EcosystemEngine {
  private products: EcosystemProduct[];
  private links: EcosystemLink[];
  private workflows: EcosystemWorkflow[];
  private recommendations: EcosystemRecommendation[];

  constructor(
    products: EcosystemProduct[],
    links: EcosystemLink[],
    workflows: EcosystemWorkflow[],
    recommendations: EcosystemRecommendation[],
  ) {
    this.products = products;
    this.links = links;
    this.workflows = workflows;
    this.recommendations = recommendations;
  }

  getProduct(id: string): EcosystemProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  getAllProducts(): EcosystemProduct[] {
    return this.products;
  }

  getProductsByStatus(status: EcosystemProduct["status"]): EcosystemProduct[] {
    return this.products.filter((p) => p.status === status);
  }

  getProductLinks(productId: string): { link: EcosystemLink; product: EcosystemProduct }[] {
    const result: { link: EcosystemLink; product: EcosystemProduct }[] = [];
    for (const link of this.links) {
      let otherId: string | null = null;
      if (link.sourceProductId === productId) otherId = link.targetProductId;
      else if (link.targetProductId === productId) otherId = link.sourceProductId;
      if (otherId) {
        const product = this.products.find((p) => p.id === otherId);
        if (product) result.push({ link, product });
      }
    }
    return result;
  }

  getProductDependencies(productId: string): EcosystemProduct[] {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return [];
    return product.dependencies
      .map((depId) => this.products.find((p) => p.id === depId))
      .filter((p): p is EcosystemProduct => !!p);
  }

  getProductDependents(productId: string): EcosystemProduct[] {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return [];
    return product.dependents
      .map((depId) => this.products.find((p) => p.id === depId))
      .filter((p): p is EcosystemProduct => !!p);
  }

  getProductWorkflows(productId: string): EcosystemWorkflow[] {
    return this.workflows.filter((w) => w.productIds.includes(productId));
  }

  getProductRecommendations(productId: string): EcosystemRecommendation[] {
    return this.recommendations.filter((r) => r.relatedProducts.includes(productId));
  }

  getAllLinks(): EcosystemLink[] {
    return this.links;
  }

  getAllWorkflows(): EcosystemWorkflow[] {
    return this.workflows;
  }

  getAllRecommendations(): EcosystemRecommendation[] {
    return this.recommendations;
  }

  getRelatedProducts(query: string): EcosystemProduct[] {
    const q = query.toLowerCase();
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.sharedCapabilities.some((c) => c.toLowerCase().includes(q))
    );
  }

  detectCrossProjectRelations(memoryContent: string): { product: EcosystemProduct; relevance: number; reason: string }[] {
    const content = memoryContent.toLowerCase();
    const results: { product: EcosystemProduct; relevance: number; reason: string }[] = [];

    for (const product of this.products) {
      let relevance = 0;
      const reasons: string[] = [];

      if (content.includes(product.name.toLowerCase())) {
        relevance += 0.8;
        reasons.push(`Directly references ${product.name}`);
      }
      if (content.includes(product.shortName.toLowerCase())) {
        relevance += 0.6;
        reasons.push(`References ${product.shortName}`);
      }

      for (const cap of product.sharedCapabilities) {
        const capWords = cap.replace(/-/g, " ").toLowerCase();
        if (content.includes(capWords)) {
          relevance += 0.3;
          reasons.push(`Related capability: ${cap}`);
        }
      }

      if (relevance > 0) {
        results.push({
          product,
          relevance: Math.min(relevance, 1),
          reason: reasons.join("; "),
        });
      }
    }

    return results.sort((a, b) => b.relevance - a.relevance);
  }

  getDependencyChain(productId: string, visited = new Set<string>()): string[] {
    if (visited.has(productId)) return [];
    visited.add(productId);
    const product = this.products.find((p) => p.id === productId);
    if (!product) return [];

    const chain: string[] = [productId];
    for (const depId of product.dependencies) {
      chain.push(...this.getDependencyChain(depId, visited));
    }
    return chain;
  }

  getEcosystemHealth(): {
    overall: number;
    activeCount: number;
    devCount: number;
    planningCount: number;
    totalLinks: number;
    activeLinks: number;
    totalWorkflows: number;
    activeWorkflows: number;
    criticalRecommendations: number;
    totalDataFlows: number;
  } {
    const activeCount = this.products.filter((p) => p.status === "active").length;
    const devCount = this.products.filter((p) => p.status === "development" || p.status === "beta").length;
    const planningCount = this.products.filter((p) => p.status === "planning").length;
    const activeLinks = this.links.filter((l) => l.status === "active").length;
    const activeWorkflows = this.workflows.filter((w) => w.status === "active").length;
    const criticalRecommendations = this.recommendations.filter((r) => r.priority === "critical" || r.priority === "high").length;
    const totalDataFlows = this.products.reduce((sum, p) => sum + p.dataFlows.length, 0);
    const overall = this.products.reduce((sum, p) => sum + p.health, 0) / this.products.length;

    return {
      overall,
      activeCount,
      devCount,
      planningCount,
      totalLinks: this.links.length,
      activeLinks,
      totalWorkflows: this.workflows.length,
      activeWorkflows,
      criticalRecommendations,
      totalDataFlows,
    };
  }

  getEcosystemGraph(): EcosystemGraphNode[] {
    const nodes: EcosystemGraphNode[] = [];
    const centerX = 450;
    const centerY = 380;
    const radius = 280;

    // Product nodes in a circle
    this.products.forEach((product, i) => {
      const angle = (i / this.products.length) * Math.PI * 2 - Math.PI / 2;
      const r = radius * (0.7 + product.health * 0.3);
      const connections: string[] = [];

      for (const link of this.links) {
        if (link.sourceProductId === product.id) connections.push(link.targetProductId);
        else if (link.targetProductId === product.id) connections.push(link.sourceProductId);
      }

      nodes.push({
        id: product.id,
        label: product.shortName,
        type: "product",
        category: product.category,
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        size: 14 + product.health * 12,
        color: product.color,
        status: product.status,
        connections,
      });
    });

    // Capability nodes (shared between products)
    const capMap = new Map<string, string[]>();
    for (const product of this.products) {
      for (const cap of product.sharedCapabilities) {
        if (!capMap.has(cap)) capMap.set(cap, []);
        capMap.get(cap)!.push(product.id);
      }
    }

    const sharedCaps = Array.from(capMap.entries()).filter(([, products]) => products.length > 1);
    sharedCaps.forEach(([cap, productIds], i) => {
      const avgX = productIds.reduce((sum, id) => {
        const node = nodes.find((n) => n.id === id);
        return sum + (node?.x || centerX);
      }, 0) / productIds.length;
      const avgY = productIds.reduce((sum, id) => {
        const node = nodes.find((n) => n.id === id);
        return sum + (node?.y || centerY);
      }, 0) / productIds.length;

      const midX = (avgX + centerX) / 2;
      const midY = (avgY + centerY) / 2;

      nodes.push({
        id: `cap-${cap}`,
        label: cap.replace(/-/g, " "),
        type: "capability",
        x: midX + (Math.random() - 0.5) * 40,
        y: midY + (Math.random() - 0.5) * 40,
        size: 4 + productIds.length * 2,
        color: "#64748b",
        status: "active",
        connections: productIds,
      });
    });

    // Workflow nodes
    this.workflows.filter((w) => w.status === "active").forEach((wf, i) => {
      const avgX = wf.productIds.reduce((sum, id) => {
        const node = nodes.find((n) => n.id === id);
        return sum + (node?.x || centerX);
      }, 0) / wf.productIds.length;
      const avgY = wf.productIds.reduce((sum, id) => {
        const node = nodes.find((n) => n.id === id);
        return sum + (node?.y || centerY);
      }, 0) / wf.productIds.length;

      nodes.push({
        id: wf.id,
        label: wf.name.substring(0, 20),
        type: "workflow",
        x: avgX + (i % 2 === 0 ? 30 : -30),
        y: avgY + (i % 2 === 0 ? -30 : 30),
        size: 6,
        color: "#22c55e",
        status: wf.status,
        connections: wf.productIds,
      });
    });

    return nodes;
  }
}
