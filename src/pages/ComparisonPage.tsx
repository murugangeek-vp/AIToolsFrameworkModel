import React from 'react';
import { useComparisonStore } from '@store/useComparisonStore';
import { RadarChart } from '@charts/RadarChart';
import { HeatmapChart } from '@charts/HeatmapChart';
import { ScoreBadge } from '@components/ScoreBadge';

export const ComparisonPage: React.FC = () => {
  const { selectedTools, removeTool, clearAll } = useComparisonStore();

  if (selectedTools.length === 0) {
    return (
      <div
        className="glass rounded-xl p-16 text-center space-y-4 max-w-xl mx-auto mt-12"
        style={{ border: '1px dashed var(--border-color)' }}
      >
        <span className="text-4xl block">⚖️</span>
        <h3 className="text-xl font-bold t-text">No tools selected for comparison</h3>
        <p className="t-text-secondary text-sm">
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
          <h2 className="text-2xl font-black t-text tracking-tight">Side-by-Side Comparison</h2>
          <p className="t-text-secondary text-sm mt-0.5">Evaluate technical specifications and benchmarks.</p>
        </div>
        <button
          onClick={clearAll}
          className="t-btn-secondary text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all"
        >
          Clear Comparison
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-bold t-text-muted mb-3 uppercase tracking-wider">Radar Evaluation Chart</h4>
          <RadarChart tools={selectedTools} />
        </div>
        <div>
          <h4 className="text-sm font-bold t-text-muted mb-3 uppercase tracking-wider">Composite Heatmap Matrix</h4>
          <HeatmapChart tools={selectedTools} />
        </div>
      </div>

      {/* Comparison Spec Table */}
      <div>
        <h4 className="text-sm font-bold t-text-muted mb-3 uppercase tracking-wider">Detailed Specifications Matrix</h4>
        <div className="glass rounded-xl overflow-x-auto" style={{ border: '1px solid var(--border-color)' }}>
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="t-table-header">
                <th className="p-4 text-xs font-bold uppercase t-text-muted w-48">Spec Field</th>
                {selectedTools.map((t) => (
                  <th key={t.id} className="p-4 text-sm font-bold t-text w-56 relative align-top">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="line-clamp-1">{t.name}</div>
                        <span className="text-[10px] block font-normal tracking-wide uppercase mt-0.5" style={{ color: 'var(--accent-indigo)' }}>
                          {t.subcategory}
                        </span>
                      </div>
                      <button
                        onClick={() => removeTool(t.id)}
                        className="text-xs font-bold cursor-pointer transition-colors"
                        title="Remove"
                        style={{ color: '#ef4444' }}
                        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.7')}
                        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, idx) => (
                <tr
                  key={spec.label}
                  className="t-table-row transition-colors"
                  style={{
                    background: idx % 2 === 0 ? 'transparent' : 'var(--surface-bg)',
                  }}
                >
                  <td className="p-4 text-xs font-bold t-label uppercase tracking-wider" style={{ background: 'var(--surface-bg)' }}>
                    {spec.label}
                  </td>
                  {selectedTools.map((t) => {
                    const raw = (t as any)[spec.key];
                    const val = spec.format ? spec.format(raw) : raw || 'N/A';
                    return (
                      <td key={t.id} className="p-4 text-sm t-text-secondary font-medium">
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
