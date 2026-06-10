import React, { useState, useEffect } from 'react';
import { useToolStore } from '@store/useToolStore';
import { recommendationEngine } from '@utils/recommendationEngine';
import { CATEGORY_REGISTRY } from '@types-app/index';
import type {
  RecommendationCriteria,
  RecommendationResult,
  RecommendationPriority,
} from '@types-app/ComparisonState';
import { ScoreBadge } from '@components/ScoreBadge';

export const RecommendPage: React.FC = () => {
  const { tools, loadAll } = useToolStore();
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [wizardStep, setWizardStep] = useState<'form' | 'results'>('form');

  useEffect(() => { loadAll(); }, [loadAll]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<RecommendationPriority[]>([]);
  const [maxBudget, setMaxBudget] = useState<RecommendationCriteria['maxBudget']>('any');

  const [reqEnterprise, setReqEnterprise] = useState(false);
  const [reqOpenSource, setReqOpenSource] = useState(false);
  const [reqRAG, setReqRAG] = useState(false);
  const [reqAgent, setReqAgent] = useState(false);
  const [reqAPI, setReqAPI] = useState(false);
  const [reqSelfHost, setReqSelfHost] = useState(false);
  const [reqCompliance, setReqCompliance] = useState(false);

  const toggleCategory = (label: string) =>
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );

  const togglePriority = (priority: RecommendationPriority) =>
    setPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );

  const handleRecommend = (e: React.FormEvent) => {
    e.preventDefault();
    const criteria: RecommendationCriteria = {
      categories: selectedCategories,
      prioritize: priorities,
      maxBudget,
      requireEnterprise: reqEnterprise,
      requireOpenSource: reqOpenSource,
      requireRAG: reqRAG,
      requireAgentSupport: reqAgent,
      requireAPI: reqAPI,
      requireSelfHosting: reqSelfHost,
      requireCompliance: reqCompliance,
    };
    setResults(recommendationEngine.recommend(tools, criteria));
    setWizardStep('results');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black t-text tracking-tight">Recommendation Wizard</h2>
        <p className="t-text-secondary text-sm mt-0.5">Find optimized tools for your target technical stack.</p>
      </div>

      {wizardStep === 'form' ? (
        <form
          onSubmit={handleRecommend}
          className="glass rounded-xl p-6 space-y-6 max-w-3xl mx-auto"
          style={{ border: '1px solid var(--border-color)' }}
        >
          {/* 1. Categories */}
          <div>
            <h4 className="text-sm font-bold t-text mb-2.5">1. Target Domain Areas</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(CATEGORY_REGISTRY.map((c) => c.label))).map((label) => {
                const active = selectedCategories.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleCategory(label)}
                    className={`text-xs px-3.5 py-2 rounded-lg transition-all cursor-pointer font-semibold ${
                      active ? 't-selected' : 't-unselected'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Priorities */}
          <div>
            <h4 className="text-sm font-bold t-text mb-2.5">2. Priorities (Select up to 3)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'cost', label: 'Cost Efficiency', icon: '💰' },
                { id: 'security', label: 'Security & Compliance', icon: '🛡️' },
                { id: 'latency', label: 'Low Latency / Speed', icon: '⚡' },
                { id: 'scalability', label: 'High Scalability', icon: '📈' },
                { id: 'enterprise', label: 'Enterprise Readiness', icon: '🏢' },
                { id: 'community', label: 'Community Support', icon: '👥' },
              ].map((p) => {
                const active = priorities.includes(p.id as any);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePriority(p.id as any)}
                    className={`flex items-center justify-between p-3.5 rounded-lg transition-all cursor-pointer text-sm font-medium ${
                      active ? 't-selected' : 't-unselected'
                    }`}
                  >
                    <span>{p.icon} {p.label}</span>
                    {active && (
                      <span className="text-xs font-bold" style={{ color: 'var(--accent-indigo)' }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Requirements */}
          <div>
            <h4 className="text-sm font-bold t-text mb-2.5">3. Critical Requirements</h4>
            <div className="grid grid-cols-2 gap-3 text-sm t-text-secondary">
              {[
                { label: 'Require Enterprise Readiness', val: reqEnterprise, set: setReqEnterprise },
                { label: 'Require Open Source weights', val: reqOpenSource, set: setReqOpenSource },
                { label: 'Require native RAG support', val: reqRAG, set: setReqRAG },
                { label: 'Require native Agent support', val: reqAgent, set: setReqAgent },
                { label: 'Require API endpoint', val: reqAPI, set: setReqAPI },
                { label: 'Require Self Hosting capability', val: reqSelfHost, set: setReqSelfHost },
                { label: 'Require Compliance audits (SOC2/GDPR)', val: reqCompliance, set: setReqCompliance },
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={(e) => item.set(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: 'var(--accent-indigo)' }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Budget */}
          <div>
            <h4 className="text-sm font-bold t-text mb-2.5">4. Target Budget Strategy</h4>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'any', label: 'Any Budget' },
                { id: 'low', label: 'Low cost focus (free/open-weight)' },
                { id: 'medium', label: 'Medium cost' },
                { id: 'free', label: 'Free Open-Source Only' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setMaxBudget(b.id as any)}
                  className={`text-xs px-3.5 py-2 rounded-lg transition-all cursor-pointer font-semibold ${
                    maxBudget === b.id ? 't-selected' : 't-unselected'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg cursor-pointer transition-all shadow-glow"
              style={{ background: 'var(--accent-indigo)' }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Generate Recommendation
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setWizardStep('form')}
              className="t-btn-secondary text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer"
            >
              ◀ Back to Form
            </button>
            <span className="text-sm t-text-secondary">
              Found <span className="font-bold" style={{ color: 'var(--accent-indigo)' }}>{results.length}</span> optimized candidates
            </span>
          </div>

          <div className="space-y-4">
            {results.map((rec) => (
              <div
                key={rec.tool.id}
                className="glass rounded-xl p-5 flex flex-col md:flex-row justify-between gap-5 relative overflow-hidden"
                style={{ border: '1px solid var(--border-color)' }}
              >
                {/* Rank Badge */}
                <div
                  className="absolute top-0 left-0 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-br-lg"
                  style={{ background: 'var(--accent-indigo)' }}
                >
                  Rank #{rec.rank}
                </div>

                <div className="flex-1 space-y-3 pt-2">
                  <div className="flex gap-3 items-center">
                    <h3 className="text-lg font-extrabold t-text">{rec.tool.name}</h3>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{
                        background: 'var(--surface-bg)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {rec.tool.subcategory}
                    </span>
                  </div>
                  <p className="text-sm t-text-secondary leading-relaxed">{rec.tool.description}</p>

                  <div className="pt-1.5 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: 'var(--accent-indigo)' }}>
                      Match Reasons:
                    </span>
                    <ul className="text-xs t-text-muted space-y-1 list-disc list-inside">
                      {rec.reasons.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>

                <div
                  className="flex md:flex-col justify-between md:justify-center items-center gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 w-full md:w-36"
                  style={{ borderColor: 'var(--divider)' }}
                >
                  <div className="text-center">
                    <span className="text-[10px] t-label uppercase font-bold tracking-widest block mb-0.5">Match Score</span>
                    <ScoreBadge score={rec.score} size="lg" />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] t-label uppercase font-bold tracking-widest block mb-0.5">Overall Rating</span>
                    <ScoreBadge score={rec.tool.overall_rating} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
