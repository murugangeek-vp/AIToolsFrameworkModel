import React from 'react';
import { useScoringStore, ScoringWeightKey } from '@store/useScoringStore';

export const ScoringWeightsPanel: React.FC = () => {
  const { weights, setWeight, resetWeights } = useScoringStore();

  const metrics: { key: ScoringWeightKey; label: string; desc: string }[] = [
    { key: 'enterprise_readiness_score', label: 'Enterprise Readiness', desc: 'SLA support, multi-cloud, platform scale' },
    { key: 'governance_score', label: 'Governance & Compliance', desc: 'Lineage, audit logs, GDPR/HIPAA suitability' },
    { key: 'security_score', label: 'Security Infrastructure', desc: 'Data encryption, RBAC, access controls' },
    { key: 'cost_efficiency_score', label: 'Cost Efficiency', desc: 'Open-weights utility, token/API pricing index' },
    { key: 'scalability_score', label: 'Platform Scalability', desc: 'Concurrent query, multi-node clustering potential' },
    { key: 'latency_score', label: 'Latency Response Time', desc: 'Time-to-First-Token and average execution delay' },
    { key: 'ai_trust_score', label: 'AI Trust & Safeguards', desc: 'Guardrails, toxic scanners, alignment scores' },
    { key: 'observability_score', label: 'Observability & Logs', desc: 'Tracing, metrics aggregation, debug pipelines' },
    { key: 'community_score', label: 'GitHub & Community', desc: 'Star rating, forum updates, active contributions' },
    { key: 'ecosystem_maturity_score', label: 'Ecosystem Maturity', desc: 'Pre-built SDKs, plugins, framework integrations' },
    { key: 'developer_experience_score', label: 'Developer Experience', desc: 'Documentation clarity, tutorial steps, SDK ease' },
    { key: 'production_reliability_score', label: 'Production Reliability', desc: 'Cluster failover index, hosting maturity' },
  ];

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="glass rounded-xl p-5 space-y-4 border border-[var(--border-color)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h4 className="text-sm font-black t-text tracking-tight uppercase">Leaderboard Ranking Weights</h4>
          <p className="text-[10px] t-text-secondary mt-0.5">
            Calibrate metric importances. Ratings are dynamically computed. Active sum: <strong style={{ color: 'var(--accent-indigo)' }}>{totalWeight}%</strong>
          </p>
        </div>
        <button
          onClick={resetWeights}
          className="t-btn-secondary text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          Reset defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
        {metrics.map((m) => {
          const val = weights[m.key] || 0;
          return (
            <div
              key={m.key}
              className="p-3.5 rounded-lg border t-spec-row space-y-2 flex flex-col justify-between"
              title={m.desc}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold t-text leading-tight">{m.label}</span>
                <span className="text-xs font-black" style={{ color: 'var(--accent-indigo)' }}>
                  {val}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={val}
                onChange={(e) => setWeight(m.key, parseInt(e.target.value, 10))}
                className="w-full cursor-pointer h-1 rounded"
                style={{ accentColor: 'var(--accent-indigo)' }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
