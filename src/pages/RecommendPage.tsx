import React, { useState, useEffect } from 'react';
import { useToolStore } from '@store/useToolStore';
import { recommendationEngine } from '@utils/recommendationEngine';
import { CATEGORY_REGISTRY } from '@types-app/index';
import type { RecommendationCriteria, RecommendationResult, RecommendationPriority } from '@types-app/ComparisonState';
import { ScoreBadge } from '@components/ScoreBadge';

export const RecommendPage: React.FC = () => {
  const { tools, loadAll } = useToolStore();
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [wizardStep, setWizardStep] = useState<'form' | 'results'>('form');

  // Load tools on enter
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Form State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<RecommendationPriority[]>([]);
  const [maxBudget, setMaxBudget] = useState<RecommendationCriteria['maxBudget']>('any');
  
  // Flags
  const [reqEnterprise, setReqEnterprise] = useState(false);
  const [reqOpenSource, setReqOpenSource] = useState(false);
  const [reqRAG, setReqRAG] = useState(false);
  const [reqAgent, setReqAgent] = useState(false);
  const [reqAPI, setReqAPI] = useState(false);
  const [reqSelfHost, setReqSelfHost] = useState(false);
  const [reqCompliance, setReqCompliance] = useState(false);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const togglePriority = (priority: RecommendationPriority) => {
    setPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  };

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

    const recs = recommendationEngine.recommend(tools, criteria);
    setResults(recs);
    setWizardStep('results');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Recommendation Wizard</h2>
        <p className="text-slate-400 text-sm mt-0.5">Find optimized tools for your target technical stack.</p>
      </div>

      {wizardStep === 'form' ? (
        <form onSubmit={handleRecommend} className="glass rounded-xl p-6 border border-slate-800 space-y-6 max-w-3xl mx-auto">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2.5">1. Target Domain Areas</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(CATEGORY_REGISTRY.map((c) => c.label))).map((label) => {
                const active = selectedCategories.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleCategory(label)}
                    className={`text-xs px-3.5 py-2 rounded-lg border transition-all cursor-pointer font-semibold ${
                      active
                        ? 'bg-indigo-600/20 border-indigo-550 text-indigo-300'
                        : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priorities */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2.5">2. Priorities (Select up to 3)</h4>
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
                    className={`flex items-center justify-between p-3.5 rounded-lg border text-sm transition-all cursor-pointer ${
                      active
                        ? 'bg-indigo-600/15 border-indigo-550 text-indigo-300 font-bold'
                        : 'border-slate-850 bg-slate-900/40 text-slate-350 hover:border-slate-750'
                    }`}
                  >
                    <span>{p.icon} {p.label}</span>
                    {active && <span className="text-indigo-400 text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Requirements flags */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2.5">3. Critical Requirements</h4>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
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
                    className="w-4 h-4 accent-indigo-500 rounded border-slate-800 bg-slate-900 focus:ring-indigo-500/20"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2.5">4. Target Budget Strategy</h4>
            <div className="flex gap-3">
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
                  className={`text-xs px-3.5 py-2 rounded-lg border transition-all cursor-pointer font-semibold ${
                    maxBudget === b.id
                      ? 'bg-indigo-600/20 border-indigo-550 text-indigo-300'
                      : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:border-slate-700'
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
              className="bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg cursor-pointer transition-colors shadow-glow"
            >
              Generate Recommendation
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Back button */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setWizardStep('form')}
              className="text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-350 hover:text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              ◀ Back to Form
            </button>
            <span className="text-sm text-slate-400">
              Found <span className="font-bold text-indigo-400">{results.length}</span> optimized candidates
            </span>
          </div>

          {/* Result cards list */}
          <div className="space-y-4">
            {results.map((rec) => (
              <div
                key={rec.tool.id}
                className="glass rounded-xl p-5 border border-slate-850 flex flex-col md:flex-row justify-between gap-5 relative overflow-hidden"
              >
                {/* Ranking Badge */}
                <div className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-br-lg">
                  Rank #{rec.rank}
                </div>

                <div className="flex-1 space-y-3 pt-2">
                  <div className="flex gap-3 items-center">
                    <h3 className="text-lg font-extrabold text-white">{rec.tool.name}</h3>
                    <span className="text-[10px] bg-slate-800 text-slate-350 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {rec.tool.subcategory}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{rec.tool.description}</p>
                  
                  {/* Reasons list */}
                  <div className="pt-1.5 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Match Reasons:</span>
                    <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                      {rec.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Score & rating widgets */}
                <div className="flex md:flex-col justify-between md:justify-center items-center gap-3 border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 w-full md:w-36">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-0.5">Match Score</span>
                    <ScoreBadge score={rec.score} size="lg" />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-0.5">Overall Rating</span>
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
