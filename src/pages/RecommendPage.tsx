import React, { useState, useEffect } from 'react';
import { useToolStore } from '@store/useToolStore';
import { recommendationEngine } from '@utils/recommendationEngine';
import { copilotEngine, CopilotCriteria, ArchitectureBlueprint } from '@utils/copilotEngine';
import { CATEGORY_REGISTRY } from '@types-app/index';
import type {
  RecommendationCriteria,
  RecommendationResult,
  RecommendationPriority,
} from '@types-app/ComparisonState';
import { ScoreBadge } from '@components/ScoreBadge';

export const RecommendPage: React.FC = () => {
  const { tools, loadAll } = useToolStore();
  const [activeTab, setActiveTab] = useState<'single' | 'copilot'>('single');

  useEffect(() => { loadAll(); }, [loadAll]);

  // ─── Single Tool Recommendation States ──────────────────────────────────────
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [wizardStep, setWizardStep] = useState<'form' | 'results'>('form');
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

  const handleRecommendSingle = (e: React.FormEvent) => {
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

  // ─── AI Architecture Copilot States ─────────────────────────────────────────
  const [copilotStep, setCopilotStep] = useState<'form' | 'blueprint'>('form');
  const [blueprint, setBlueprint] = useState<ArchitectureBlueprint | null>(null);

  const [copilotScale, setCopilotScale] = useState<CopilotCriteria['scale']>('medium');
  const [copilotBudget, setCopilotBudget] = useState<CopilotCriteria['budget']>('balanced');
  const [copilotCloud, setCopilotCloud] = useState<CopilotCriteria['cloud']>('aws');
  const [copilotCompliance, setCopilotCompliance] = useState<CopilotCriteria['compliance']>('none');
  const [copilotOS, setCopilotOS] = useState(false);
  const [copilotLatency, setCopilotLatency] = useState<CopilotCriteria['latencyLimit']>('standard');
  const [copilotRAG, setCopilotRAG] = useState(false);
  const [copilotAgent, setCopilotAgent] = useState(false);

  const handleGenerateBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    const criteria: CopilotCriteria = {
      scale: copilotScale,
      budget: copilotBudget,
      cloud: copilotCloud,
      compliance: copilotCompliance,
      openSourcePreferred: copilotOS,
      latencyLimit: copilotLatency,
      ragRequired: copilotRAG,
      agenticRequired: copilotAgent,
    };
    const bp = copilotEngine.generateBlueprint(tools, criteria);
    setBlueprint(bp);
    setCopilotStep('blueprint');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black t-text tracking-tight">AI Decision Engines</h2>
          <p className="t-text-secondary text-sm mt-0.5">Evaluate stack components or design high-reliability custom blueprints.</p>
        </div>

        {/* Tab Selection */}
        <div className="t-view-toggle rounded-lg p-1 flex">
          {[
            { id: 'single', label: '🛠️ Tool Wizard' },
            { id: 'copilot', label: '🧬 Architecture Copilot' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                activeTab === t.id ? '' : 't-theme-btn-inactive'
              }`}
              style={
                activeTab === t.id
                  ? { background: 'var(--accent-indigo)', color: '#fff' }
                  : {}
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'single' ? (
        // ─── SINGLE WIZARD LAYOUT ─────────────────────────────────────────────
        wizardStep === 'form' ? (
          <form
            onSubmit={handleRecommendSingle}
            className="glass rounded-xl p-6 space-y-6 max-w-3xl mx-auto"
            style={{ border: '1px solid var(--border-color)' }}
          >
            {/* Categories */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider t-label mb-2.5">1. Target Domain Areas</h4>
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

            {/* Priorities */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider t-label mb-2.5">2. Core Priorities (Select up to 3)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'cost', label: 'Cost Efficiency', icon: '💰' },
                  { id: 'security', label: 'Security Controls', icon: '🛡️' },
                  { id: 'latency', label: 'Low Latency', icon: '⚡' },
                  { id: 'scalability', label: 'High Scalability', icon: '📈' },
                  { id: 'enterprise', label: 'Enterprise Ready', icon: '🏢' },
                  { id: 'community', label: 'Active Community', icon: '👥' },
                ].map((p) => {
                  const active = priorities.includes(p.id as any);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePriority(p.id as any)}
                      className={`flex items-center justify-between p-3.5 rounded-lg transition-all cursor-pointer text-xs font-semibold ${
                        active ? 't-selected' : 't-unselected'
                      }`}
                    >
                      <span>{p.icon} {p.label}</span>
                      {active && (
                        <span className="text-[10px] font-black" style={{ color: 'var(--accent-indigo)' }}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Critical Requirements */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider t-label mb-2.5">3. Platform Capabilities</h4>
              <div className="grid grid-cols-2 gap-3 text-xs t-text-secondary">
                {[
                  { label: 'Require Enterprise Readiness', val: reqEnterprise, set: setReqEnterprise },
                  { label: 'Require Open Source weights', val: reqOpenSource, set: setReqOpenSource },
                  { label: 'Require native RAG support', val: reqRAG, set: setReqRAG },
                  { label: 'Require native Agent support', val: reqAgent, set: setReqAgent },
                  { label: 'Require API endpoint availability', val: reqAPI, set: setReqAPI },
                  { label: 'Require Self-Hosting capabilities', val: reqSelfHost, set: setReqSelfHost },
                  { label: 'Require compliance audits (SOC2/GDPR)', val: reqCompliance, set: setReqCompliance },
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

            {/* Budget */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider t-label mb-2.5">4. Target Budget Strategy</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'any', label: 'Any Budget Strategy' },
                  { id: 'low', label: 'Low Cost / Free Open-weight' },
                  { id: 'medium', label: 'Mid-Tier Subscriptions' },
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
              >
                Find Best Match
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setWizardStep('form')}
                className="t-btn-secondary text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
              >
                ◀ Back to Form
              </button>
              <span className="text-xs t-text-secondary">
                Found <span className="font-bold text-[var(--accent-indigo)]">{results.length}</span> optimized candidates
              </span>
            </div>

            <div className="space-y-4">
              {results.map((rec) => (
                <div
                  key={rec.tool.id}
                  className="glass rounded-xl p-5 flex flex-col md:flex-row justify-between gap-5 relative overflow-hidden"
                  style={{ border: '1px solid var(--border-color)' }}
                >
                  <div
                    className="absolute top-0 left-0 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-br-lg"
                    style={{ background: 'var(--accent-indigo)' }}
                  >
                    Rank #{rec.rank}
                  </div>

                  <div className="flex-1 space-y-3 pt-2">
                    <div className="flex gap-3 items-center">
                      <h3 className="text-base font-black t-text">{rec.tool.name}</h3>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border t-spec-row"
                        style={{ borderColor: 'var(--border-subtle)' }}
                      >
                        {rec.tool.subcategory}
                      </span>
                    </div>
                    <p className="text-xs t-text-secondary leading-relaxed">{rec.tool.description}</p>

                    <div className="pt-1.5 space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest block" style={{ color: 'var(--accent-indigo)' }}>
                        Match Reasons:
                      </span>
                      <ul className="text-[11px] t-text-muted space-y-1 list-disc list-inside">
                        {rec.reasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div
                    className="flex md:flex-col justify-between md:justify-center items-center gap-3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 w-full md:w-36"
                    style={{ borderColor: 'var(--divider)' }}
                  >
                    <div className="text-center">
                      <span className="text-[9px] t-label uppercase font-black tracking-widest block mb-0.5">Match Score</span>
                      <ScoreBadge score={rec.score} size="lg" />
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] t-label uppercase font-black tracking-widest block mb-0.5">Rating</span>
                      <ScoreBadge score={rec.tool.overall_rating} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        // ─── COPILOT WIZARD LAYOUT (V2) ───────────────────────────────────────
        copilotStep === 'form' ? (
          <form
            onSubmit={handleGenerateBlueprint}
            className="glass rounded-xl p-6 space-y-6 max-w-3xl mx-auto"
            style={{ border: '1px solid var(--border-color)' }}
          >
            <div className="border-b border-[var(--border-subtle)] pb-3">
              <h3 className="text-base font-black t-text">Generate Enterprise Architecture Blueprint</h3>
              <p className="text-[11px] t-text-secondary mt-0.5">Specify constraint parameters to assemble a complete AI pipeline blueprint.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Scale */}
              <div className="space-y-2">
                <label className="text-xs font-bold t-text block">1. Operational Scale</label>
                <select
                  value={copilotScale}
                  onChange={(e) => setCopilotScale(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border t-select"
                >
                  <option value="small">Startup (Low traffic, local developer focus)</option>
                  <option value="medium">Mid-Market (Production app, structured metrics)</option>
                  <option value="enterprise">Enterprise (Highly reliable, multi-region, heavy load)</option>
                </select>
              </div>

              {/* 2. Budget */}
              <div className="space-y-2">
                <label className="text-xs font-bold t-text block">2. Budget Profile</label>
                <select
                  value={copilotBudget}
                  onChange={(e) => setCopilotBudget(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border t-select"
                >
                  <option value="low-cost">Low-Cost (Focus on open-weight and self-hosting)</option>
                  <option value="balanced">Balanced (Hybrid approach, managed services + OS)</option>
                  <option value="premium">Premium (Frontier managed APIs, 99.9% SLAs)</option>
                </select>
              </div>

              {/* 3. Cloud Provider */}
              <div className="space-y-2">
                <label className="text-xs font-bold t-text block">3. Primary Cloud Host</label>
                <select
                  value={copilotCloud}
                  onChange={(e) => setCopilotCloud(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border t-select"
                >
                  <option value="aws">AWS (Amazon Web Services)</option>
                  <option value="azure">Microsoft Azure Cloud</option>
                  <option value="gcp">Google Cloud Platform (GCP)</option>
                  <option value="on-prem">On-Premises / Private Cloud</option>
                  <option value="hybrid">Hybrid multi-cloud</option>
                </select>
              </div>

              {/* 4. Compliance */}
              <div className="space-y-2">
                <label className="text-xs font-bold t-text block">4. Compliance Standard</label>
                <select
                  value={copilotCompliance}
                  onChange={(e) => setCopilotCompliance(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border t-select"
                >
                  <option value="none">No compliance audits required</option>
                  <option value="soc2">SOC 2 Type II Audited</option>
                  <option value="hipaa">HIPAA Compliant Healthcare Stack</option>
                  <option value="gdpr">GDPR compliant (EU data processing)</option>
                </select>
              </div>

              {/* 5. Latency */}
              <div className="space-y-2">
                <label className="text-xs font-bold t-text block">5. Latency Thresholds</label>
                <select
                  value={copilotLatency}
                  onChange={(e) => setCopilotLatency(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border t-select"
                >
                  <option value="real-time">Real-time inference (&lt;150ms response)</option>
                  <option value="standard">Standard interactive web response (&lt;1s)</option>
                  <option value="batch">Offline batch pipelines / bulk training</option>
                </select>
              </div>

              {/* Switches */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold t-text block">6. Custom Filters</label>
                <div className="space-y-2 text-xs t-text-secondary">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={copilotOS}
                      onChange={(e) => setCopilotOS(e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: 'var(--accent-indigo)' }}
                    />
                    <span>Prefer Open Source Weights / Local Stack</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={copilotRAG}
                      onChange={(e) => setCopilotRAG(e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: 'var(--accent-indigo)' }}
                    />
                    <span>Requires Retrieval-Augmented Gen (RAG)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={copilotAgent}
                      onChange={(e) => setCopilotAgent(e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: 'var(--accent-indigo)' }}
                    />
                    <span>Requires Multi-Agent orchestration loops</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg cursor-pointer transition-all shadow-glow animate-pulse"
                style={{ background: 'var(--accent-indigo)' }}
              >
                Generate blueprint blueprint
              </button>
            </div>
          </form>
        ) : (
          blueprint && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCopilotStep('form')}
                  className="t-btn-secondary text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
                >
                  ◀ Back to Form
                </button>
                <div className="flex items-center gap-2 text-xs">
                  <span className="t-text-secondary font-semibold">Cost Score:</span>
                  <ScoreBadge score={blueprint.estimatedOperationalCostIndex} label="Cost Level" size="sm" />
                </div>
              </div>

              {/* Blueprint Title Banner */}
              <div
                className="glass rounded-xl p-5 border flex flex-col md:flex-row justify-between gap-5 items-start md:items-center relative overflow-hidden"
                style={{ borderColor: 'var(--accent-indigo)', background: 'var(--glass-bg)' }}
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-black tracking-tight t-text">{blueprint.title}</h3>
                  <p className="text-xs t-text-secondary">{blueprint.description}</p>
                </div>
                <div className="text-white text-[9px] font-black uppercase px-2.5 py-1 rounded bg-[var(--accent-indigo)]">
                  Enterprise V2 Blueprint
                </div>
              </div>

              {/* Visual Architecture Diagram */}
              <div className="glass rounded-xl p-5 space-y-4 border border-[var(--border-color)]">
                <h4 className="text-xs font-black uppercase tracking-wider t-label">Enterprise Architecture Stack Diagram</h4>
                <div className="overflow-x-auto py-4">
                  <div className="flex items-center justify-between min-w-[760px] gap-2 px-4 relative">
                    {/* Visual Line connector */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform -translate-y-1/2 z-0 opacity-50" />
                    
                    {blueprint.slots.map((slot, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 z-10 w-28 relative">
                        <div className="text-[10px] font-bold text-center px-2 py-0.5 rounded bg-[var(--surface-bg)] border border-[var(--border-subtle)] t-label mb-1 shadow-sm truncate w-full">
                          {slot.slotLabel}
                        </div>
                        <div
                          className="w-14 h-14 rounded-xl flex flex-col items-center justify-center font-black text-sm shadow-md transition-all hover:scale-105 border cursor-default bg-[var(--card-bg)]"
                          style={{
                            borderColor: slot.tool ? 'var(--accent-indigo)' : 'var(--border-color)',
                          }}
                        >
                          <span className="text-xl">
                            {slot.slotLabel.includes('LLM') ? '🧠' : slot.slotLabel.includes('DB') ? '🗄️' : slot.slotLabel.includes('Orch') ? '🤖' : slot.slotLabel.includes('Obs') ? '📊' : slot.slotLabel.includes('Infra') ? '🚀' : slot.slotLabel.includes('Eval') ? '🎯' : '⚖️'}
                          </span>
                        </div>
                        <span className="text-[9px] font-black text-center t-text truncate w-full">
                          {slot.tool ? slot.tool.name : 'Unknown'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Component Cards Specification Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Specs List */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider t-label pl-1">Blueprint Component Details</h4>
                  <div className="space-y-3">
                    {blueprint.slots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="glass rounded-xl p-4 border border-[var(--border-subtle)] space-y-2 hover:border-[var(--accent-indigo)] transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] uppercase font-black block t-label">{slot.slotLabel}</span>
                            <span className="text-sm font-black t-text">{slot.tool ? slot.tool.name : 'N/A'}</span>
                          </div>
                          {slot.tool && <ScoreBadge score={slot.tool.overall_rating} size="sm" />}
                        </div>
                        <p className="text-[11px] t-text-secondary">{slot.roleDescription}</p>
                        <div className="pt-1 text-[10px] t-text-muted">
                          <strong className="t-text leading-none block mb-0.5">Deployment:</strong> {slot.deploymentRecommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tradeoffs and Compliance warnings */}
                <div className="space-y-6">
                  {/* Tradeoffs */}
                  <div className="glass rounded-xl p-5 border border-[var(--border-color)] space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider t-label flex items-center gap-1.5">
                      <span>⚖️</span> Architecture Decisions & Tradeoffs
                    </h4>
                    <ul className="text-xs t-text-secondary space-y-2 list-disc list-inside leading-relaxed">
                      {blueprint.tradeoffs.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>

                  {/* Compliance Alerts */}
                  <div className="glass rounded-xl p-5 border border-[var(--border-color)] space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider t-label flex items-center gap-1.5" style={{ color: '#ef4444' }}>
                      <span>⚠️</span> Compliance & Policy Alerts
                    </h4>
                    {blueprint.complianceWarnings.length === 0 ? (
                      <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
                        ✓ Stack aligns with standard compliance policies. No immediate flags detected.
                      </p>
                    ) : (
                      <ul className="text-xs t-text-secondary space-y-2 list-disc list-inside leading-relaxed">
                        {blueprint.complianceWarnings.map((item, idx) => (
                          <li key={idx} className="text-rose-400 font-medium">{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};
