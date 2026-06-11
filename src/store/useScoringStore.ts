import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ScoringWeightKey =
  | 'enterprise_readiness_score'
  | 'governance_score'
  | 'security_score'
  | 'cost_efficiency_score'
  | 'scalability_score'
  | 'latency_score'
  | 'ai_trust_score'
  | 'observability_score'
  | 'community_score'
  | 'ecosystem_maturity_score'
  | 'developer_experience_score'
  | 'production_reliability_score';

interface ScoringStoreState {
  weights: Record<ScoringWeightKey, number>;
  setWeight: (key: ScoringWeightKey, value: number) => void;
  resetWeights: () => void;
}

export const DEFAULT_WEIGHTS: Record<ScoringWeightKey, number> = {
  enterprise_readiness_score: 15,
  governance_score: 10,
  security_score: 15,
  cost_efficiency_score: 10,
  scalability_score: 10,
  latency_score: 10,
  ai_trust_score: 10,
  observability_score: 5,
  community_score: 5,
  ecosystem_maturity_score: 5,
  developer_experience_score: 5,
  production_reliability_score: 5,
};

export const useScoringStore = create<ScoringStoreState>()(
  persist(
    (set) => ({
      weights: DEFAULT_WEIGHTS,
      setWeight: (key, value) => {
        set((s) => ({
          weights: {
            ...s.weights,
            [key]: Math.max(0, Math.min(100, value)),
          },
        }));
      },
      resetWeights: () => set({ weights: DEFAULT_WEIGHTS }),
    }),
    {
      name: 'ai-explorer-scoring',
    }
  )
);
