import React from 'react';
import { useComparisonStore } from '@store/useComparisonStore';
import { RadarChart } from '@charts/RadarChart';
import { HeatmapChart } from '@charts/HeatmapChart';
import { ScoreBadge } from '@components/ScoreBadge';

export const ComparisonPage: React.FC = () => {
  const { selectedTools, removeTool, clearAll } = useComparisonStore();

  if (selectedTools.length === 0) {
    return (
      <div className="glass rounded-xl p-16 text-center border border-dashed border-slate-800 space-y-4 max-w-xl mx-auto mt-12">
        <span className="text-4xl block">⚖️</span>
        <h3 className="text-xl font-bold text-white">No tools selected for comparison</h3>
        <p className="text-slate-400 text-sm">
          Go back to the Explorer view and add up to 5 tools to evaluate them side-by-side.
        </p>
      </div>
    );
  }

  const specs = [
    { label: 'Vendor', key: 'vendor' },
    { label: 'Subcategory', key: 'subcategory' },
    { label: 'License Type', key: 'license' },
    { label: 'Open Source', key: 'open_source', format: (val: any) => (val ? 'Yes' : 'No') },
    { label: 'Overall Rating', key: 'overall_rating', format: (val: any) => <ScoreBadge score={val} size="sm" /> },
    { label: 'Readiness Score', key: 'enterprise_readiness_score', format: (val: any) => <ScoreBadge score={val} size="sm" /> },
    { label: 'Latency Score', key: 'latency_score', format: (val: any) => <ScoreBadge score={val} size="sm" /> },
    { label: 'Cost Score', key: 'cost_efficiency_score', format: (val: any) => <ScoreBadge score={val} size="sm" /> },
    { label: 'Security Score', key: 'security_score', format: (val: any) => <ScoreBadge score={val} size="sm" /> },
    { label: 'SLA Support', key: 'sla_support', format: (val: any) => (val ? 'Supported' : 'Not Supported') },
    { label: 'Pricing Model', key: 'pricing_model' },
    { label: 'Compliance', key: 'compliance' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Side-by-Side Comparison</h2>
          <p className="text-slate-400 text-sm mt-0.5">Evaluate technical specifications and benchmarks.</p>
        </div>
        <button
          onClick={clearAll}
          className="text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Clear Comparison
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-bold text-slate-350 mb-3 uppercase tracking-wider">Radar Evaluation Chart</h4>
          <RadarChart tools={selectedTools} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-350 mb-3 uppercase tracking-wider">Composite Heatmap Matrix</h4>
          <HeatmapChart tools={selectedTools} />
        </div>
      </div>

      {/* Comparison Spec Table */}
      <div>
        <h4 className="text-sm font-bold text-slate-350 mb-3 uppercase tracking-wider">Detailed Specifications Matrix</h4>
        <div className="glass rounded-xl border border-slate-800/80 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800">
                <th className="p-4 text-xs font-bold uppercase text-slate-400 w-48">Spec Field</th>
                {selectedTools.map((t) => (
                  <th key={t.id} className="p-4 text-sm font-bold text-white w-56 relative align-top">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="line-clamp-1">{t.name}</div>
                        <span className="text-[10px] text-indigo-400 block font-normal tracking-wide uppercase mt-0.5">
                          {t.subcategory}
                        </span>
                      </div>
                      <button
                        onClick={() => removeTool(t.id)}
                        className="text-xs text-rose-500 hover:text-rose-455 font-bold cursor-pointer"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {specs.map((spec) => (
                <tr key={spec.label} className="hover:bg-slate-900/20">
                  <td className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/20">
                    {spec.label}
                  </td>
                  {selectedTools.map((t) => {
                    const raw = (t as any)[spec.key];
                    const val = spec.format ? spec.format(raw) : raw || 'N/A';
                    return (
                      <td key={t.id} className="p-4 text-sm text-slate-300 font-medium">
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
