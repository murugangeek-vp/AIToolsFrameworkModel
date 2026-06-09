import type { AITool } from './AITool';

// ─── Comparison State ─────────────────────────────────────────────────────────

export interface ComparisonItem {
  tool: AITool;
  addedAt: string;
}

export interface RadarDataPoint {
  metric: string;
  fullMark: number;
  [toolName: string]: number | string;
}

export interface HeatmapCell {
  toolId: string;
  toolName: string;
  metric: string;
  value: number;
  normalized: number; // 0–1
}

export interface ComparisonMetric {
  key: keyof AITool;
  label: string;
  description: string;
  higherIsBetter: boolean;
  unit?: string;
}

export const COMPARISON_METRICS: ComparisonMetric[] = [
  { key: 'enterprise_readiness_score', label: 'Enterprise Ready', description: 'Suitability for enterprise deployment', higherIsBetter: true },
  { key: 'latency_score', label: 'Latency', description: 'Inference speed and response time', higherIsBetter: true },
  { key: 'security_score', label: 'Security', description: 'Security features and compliance', higherIsBetter: true },
  { key: 'scalability_score', label: 'Scalability', description: 'Ability to scale under load', higherIsBetter: true },
  { key: 'governance_score', label: 'Governance', description: 'Governance & audit capabilities', higherIsBetter: true },
  { key: 'observability_score', label: 'Observability', description: 'Monitoring & observability support', higherIsBetter: true },
  { key: 'cost_efficiency_score', label: 'Cost Efficiency', description: 'Value for money', higherIsBetter: true },
  { key: 'developer_experience_score', label: 'Dev Experience', description: 'SDK, docs, and DX quality', higherIsBetter: true },
  { key: 'ecosystem_maturity_score', label: 'Ecosystem', description: 'Integration ecosystem maturity', higherIsBetter: true },
  { key: 'community_score', label: 'Community', description: 'Community size and activity', higherIsBetter: true },
  { key: 'benchmark_score', label: 'Benchmark', description: 'Performance benchmark results', higherIsBetter: true },
  { key: 'deployment_complexity_score', label: 'Deployment Ease', description: 'Ease of deployment (higher = simpler)', higherIsBetter: true },
];

export const RADAR_METRICS: ComparisonMetric[] = COMPARISON_METRICS.slice(0, 8);

// ─── Recommendation Engine ────────────────────────────────────────────────────

export interface RecommendationCriteria {
  prioritize: RecommendationPriority[];
  requireEnterprise: boolean;
  requireOpenSource: boolean;
  requireRAG: boolean;
  requireAgentSupport: boolean;
  requireAPI: boolean;
  requireSelfHosting: boolean;
  requireCompliance: boolean;
  maxBudget: 'free' | 'low' | 'medium' | 'high' | 'any';
  categories: string[];
}

export type RecommendationPriority = 
  | 'cost'
  | 'security'
  | 'scalability'
  | 'governance'
  | 'observability'
  | 'latency'
  | 'enterprise'
  | 'community'
  | 'ecosystem';

export interface RecommendationResult {
  tool: AITool;
  score: number;
  reasons: string[];
  rank: number;
}
