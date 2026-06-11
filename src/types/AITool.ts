/**
 * AITool Domain Types — SOLID / Clean Architecture
 * Single Responsibility: All AI tool domain contracts live here
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum Category {
  LLM_MODELS = 'LLM Models',
  EMBEDDING_MODELS = 'Embedding Models',
  MULTIMODAL_MODELS = 'Multimodal Models',
  AGENT_FRAMEWORKS = 'Agent Frameworks',
  RAG_FRAMEWORKS = 'RAG Frameworks',
  VECTOR_DATABASES = 'Vector Databases',
  AI_APIS = 'AI APIs',
  CLOUD_AI_PLATFORMS = 'Cloud AI Platforms',
  LLMOPS = 'LLMOps',
  AGENTOPS = 'AgentOps',
  OBSERVABILITY = 'Observability',
  AI_SECURITY = 'AI Security',
  AI_GOVERNANCE = 'AI Governance',
  MLOPS = 'MLOps',
  DEPLOYMENT_TOOLS = 'Deployment Tools',
  STREAMING_PLATFORMS = 'Streaming Platforms',
  FEATURE_STORES = 'Feature Stores',
  EVALUATION_FRAMEWORKS = 'Evaluation Frameworks',
  INFERENCE_ENGINES = 'Inference Engines',
  AI_IDE_TOOLS = 'AI IDE Tools',
  GPU_PLATFORMS = 'GPU Platforms',
  DATA_PIPELINES = 'Data Pipelines',
  WORKFLOW_ORCHESTRATION = 'Workflow Orchestration',
  
  // V2 Category Extensions
  BI_TOOLS = 'BI Tools',
  DASHBOARD_PLATFORMS = 'Dashboard Platforms',
  SQL_ENGINES = 'SQL Engines',
  DATA_SCIENCE_TOOLS = 'Data Science Tools',
  EXPERIMENT_TRACKING = 'Experiment Tracking',
  VISUALIZATION_LIBRARIES = 'Visualization Libraries',
  ML_FRAMEWORKS = 'ML Frameworks',
  ML_ALGORITHMS = 'ML Algorithms',
  RECOMMENDATION_SYSTEMS = 'Recommendation Systems',
  TIME_SERIES_TOOLS = 'Time Series Tools',
  AI_SDLC_TOOLS = 'AI SDLC Tools',
  MODEL_REGISTRY = 'Model Registries',
  FEATURE_ENGINEERING = 'Feature Engineering',
  DISTRIBUTED_AI = 'Distributed AI',
  AI_EVALUATION_TOOLS = 'AI Evaluation Tools',
  AI_SAFETY_TOOLS = 'AI Safety Tools',
  LINEAGE_TOOLS = 'Lineage Tools',
  COMPLIANCE_TOOLS = 'Compliance Tools',
}

export type PricingModel = 'Free' | 'Open Source' | 'Freemium' | 'Subscription' | 'Pay-per-use' | 'Enterprise' | 'Custom';

export type LicenseType = 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'BSD-3-Clause' | 'Commercial' | 'Proprietary' | 'Custom' | 'CC BY-SA 4.0';

// ─── Interfaces (Interface Segregation Principle) ────────────────────────────

/** Anything that can be filtered */
export interface IFilterable {
  id: string;
  name: string;
  category: string;
  open_source: boolean;
  pricing_model: PricingModel;
  overall_rating: number;
  enterprise_readiness_score: number;
  latency_score: number;
  security_score: number;
  scalability_score: number;
  cost_efficiency_score: number;
}

/** Anything that can be compared */
export interface IComparable {
  id: string;
  name: string;
  latency_score: number;
  performance_score: number;
  scalability_score: number;
  governance_score: number;
  observability_score: number;
  security_score: number;
  deployment_complexity_score: number;
  community_score: number;
  ecosystem_maturity_score: number;
  enterprise_readiness_score: number;
  developer_experience_score: number;
  ai_trust_score?: number;
  production_reliability_score?: number;
}

/** Anything that can be bookmarked/favorited */
export interface IBookmarkable {
  id: string;
  name: string;
  category: string;
}

/** Anything that can be exported */
export interface IExportable {
  id: string;
  name: string;
  vendor: string;
  category: string;
}

// ─── Core AITool Domain Model ─────────────────────────────────────────────────

export interface AITool extends IFilterable, IComparable, IBookmarkable, IExportable {
  // Identity
  id: string;
  name: string;
  category: string;
  subcategory: string;
  vendor: string;
  website: string;
  documentation: string;
  github_url: string;
  logo: string;
  description: string;

  // Licensing & Pricing
  open_source: boolean;
  license: LicenseType;
  pricing_model: PricingModel;
  pricing_notes: string;

  // Release Info
  release_year: number;
  latest_version: string;
  last_updated: string;

  // Community
  github_stars: number;
  community_score: number;

  // Scores (0–100)
  enterprise_adoption_score: number;
  enterprise_readiness_score: number;
  latency_score: number;
  performance_score: number;
  scalability_score: number;
  security_score: number;
  governance_score: number;
  observability_score: number;
  cost_efficiency_score: number;
  developer_experience_score: number;
  deployment_complexity_score: number;
  ecosystem_maturity_score: number;
  integration_score: number;
  maintenance_score: number;
  benchmark_score: number;
  overall_rating: number;
  
  // V2 Overhauls
  ai_trust_score: number;
  production_reliability_score: number;

  // Capabilities
  best_for: string;
  supported_clouds: string;
  gpu_requirement: string;
  multi_modal_support: boolean;
  rag_support: boolean;
  agent_support: boolean;
  fine_tuning_support: boolean;
  api_available: boolean;
  self_hosting_support: boolean;
  vector_search_support: boolean;
  streaming_support: boolean;

  // Enterprise
  compliance: string;
  sla_support: boolean;
  enterprise_clients: string;

  // Market
  top_competitors: string;
  tags: string;
}

// ─── Category Metadata ────────────────────────────────────────────────────────

export interface CategoryMeta {
  id: string;
  label: Category;
  csvFile: string;
  icon: string;
  color: string;
  description: string;
  trending: boolean;
}

// ─── Score Labels ─────────────────────────────────────────────────────────────

export type ScoreKey = keyof Pick<
  AITool,
  | 'enterprise_readiness_score'
  | 'latency_score'
  | 'performance_score'
  | 'scalability_score'
  | 'security_score'
  | 'governance_score'
  | 'observability_score'
  | 'cost_efficiency_score'
  | 'developer_experience_score'
  | 'deployment_complexity_score'
  | 'ecosystem_maturity_score'
  | 'integration_score'
  | 'maintenance_score'
  | 'benchmark_score'
  | 'community_score'
  | 'overall_rating'
  | 'ai_trust_score'
  | 'production_reliability_score'
>;

export const SCORE_LABELS: Record<ScoreKey, string> = {
  enterprise_readiness_score: 'Enterprise Ready',
  latency_score: 'Latency',
  performance_score: 'Performance',
  scalability_score: 'Scalability',
  security_score: 'Security',
  governance_score: 'Governance',
  observability_score: 'Observability',
  cost_efficiency_score: 'Cost Efficiency',
  developer_experience_score: 'Dev Experience',
  deployment_complexity_score: 'Deployment',
  ecosystem_maturity_score: 'Ecosystem',
  integration_score: 'Integration',
  maintenance_score: 'Maintenance',
  benchmark_score: 'Benchmark',
  community_score: 'Community',
  overall_rating: 'Overall Rating',
  ai_trust_score: 'AI Trust Score',
  production_reliability_score: 'Prod Reliability',
};
