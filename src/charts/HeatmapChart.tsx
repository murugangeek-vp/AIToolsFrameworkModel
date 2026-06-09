import React from 'react';
import type { AITool } from '@types-app/AITool';

interface HeatmapChartProps {
  tools: AITool[];
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({ tools }) => {
  if (tools.length === 0) return null;

  const metrics = [
    { key: 'overall_rating', label: 'Overall' },
    { key: 'enterprise_readiness_score', label: 'Readiness' },
    { key: 'latency_score', label: 'Latency' },
    { key: 'cost_efficiency_score', label: 'Cost' },
    { key: 'security_score', label: 'Security' },
    { key: 'scalability_score', label: 'Scale' },
  ];

  const getHeatmapColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-950 text-emerald-400 border border-emerald-500/30';
    if (score >= 75) return 'bg-teal-950 text-teal-400 border border-teal-500/25';
    if (score >= 50) return 'bg-amber-950 text-amber-400 border border-amber-500/20';
    return 'bg-rose-950 text-rose-450 border border-rose-500/20';
  };

  return (
    <div className="w-full bg-slate-900/40 rounded-xl p-5 border border-slate-800/60 overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Header Grid */}
        <div className="grid grid-cols-7 gap-2 pb-2 mb-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
          <div className="col-span-1 pl-2">Tool Name</div>
          {metrics.map((m) => (
            <div key={m.key} className="text-center">
              {m.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {tools.map((t) => (
            <div key={t.id} className="grid grid-cols-7 gap-2 items-center text-sm">
              <div className="col-span-1 pl-2 font-semibold text-white truncate">{t.name}</div>
              {metrics.map((m) => {
                const val = (t as any)[m.key] || 0;
                return (
                  <div
                    key={m.key}
                    className={`py-3 rounded-lg text-center font-bold text-xs ${getHeatmapColor(val)}`}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
