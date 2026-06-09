/**
 * recommendationEngine — Domain Layer
 * Weighted scoring recommendation system based on user priorities
 */
import type { AITool } from '@types-app/AITool';
import type { RecommendationCriteria, RecommendationResult, RecommendationPriority } from '@types-app/ComparisonState';

const PRIORITY_SCORE_KEYS: Record<RecommendationPriority, Array<keyof AITool>> = {
  cost:         ['cost_efficiency_score'],
  security:     ['security_score', 'governance_score'],
  scalability:  ['scalability_score', 'performance_score'],
  governance:   ['governance_score'],
  observability:['observability_score'],
  latency:      ['latency_score', 'benchmark_score'],
  enterprise:   ['enterprise_readiness_score', 'governance_score'],
  community:    ['community_score'],
  ecosystem:    ['ecosystem_maturity_score', 'integration_score'],
};

const BUDGET_FILTER: Record<RecommendationCriteria['maxBudget'], (t: AITool) => boolean> = {
  free:   (t) => t.open_source && t.pricing_model === 'Free',
  low:    (t) => t.open_source || ['Freemium', 'Free', 'Open Source'].includes(t.pricing_model),
  medium: (t) => !['Enterprise', 'Custom'].includes(t.pricing_model),
  high:   () => true,
  any:    () => true,
};

class RecommendationEngine {
  recommend(tools: AITool[], criteria: RecommendationCriteria, limit = 10): RecommendationResult[] {
    let candidates = [...tools];

    // Hard filters
    if (criteria.requireEnterprise) candidates = candidates.filter((t) => t.enterprise_readiness_score >= 65);
    if (criteria.requireOpenSource)  candidates = candidates.filter((t) => t.open_source);
    if (criteria.requireRAG)         candidates = candidates.filter((t) => t.rag_support);
    if (criteria.requireAgentSupport) candidates = candidates.filter((t) => t.agent_support);
    if (criteria.requireAPI)         candidates = candidates.filter((t) => t.api_available);
    if (criteria.requireSelfHosting) candidates = candidates.filter((t) => t.self_hosting_support);
    if (criteria.requireCompliance)  candidates = candidates.filter((t) => t.compliance.length > 0);
    if (criteria.categories.length)  candidates = candidates.filter((t) => criteria.categories.includes(t.category));
    candidates = candidates.filter(BUDGET_FILTER[criteria.maxBudget]);

    // Weighted scoring
    const scored = candidates.map((tool) => {
      let score = tool.overall_rating * 0.2;
      const reasons: string[] = [];

      criteria.prioritize.forEach((priority) => {
        const keys = PRIORITY_SCORE_KEYS[priority];
        keys.forEach((key) => {
          const val = tool[key] as number;
          if (typeof val === 'number') {
            score += val * (1 / criteria.prioritize.length);
            if (val >= 80) reasons.push(`Excellent ${priority} score (${Math.round(val)})`);
          }
        });
      });

      // Bonus signals
      if (tool.enterprise_readiness_score >= 85) reasons.push('Highly enterprise-ready');
      if (tool.open_source) reasons.push('Open source — no licensing cost');
      if (tool.sla_support) reasons.push('SLA-backed support');
      if (tool.api_available) reasons.push('API available');

      return { tool, score: Math.round(score), reasons };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }
}

export const recommendationEngine = new RecommendationEngine();
