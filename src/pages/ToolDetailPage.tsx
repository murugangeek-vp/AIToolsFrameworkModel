import React from 'react';
import type { AITool } from '@types-app/AITool';
import { ScoreBadge } from '@components/ScoreBadge';

interface ToolDetailPageProps {
  tool: AITool;
  onClose: () => void;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ tool, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-full bg-[#0a0a0f] border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/40">
          <div>
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{tool.category}</span>
            <h3 className="text-xl font-black text-white mt-1">{tool.name}</h3>
            <p className="text-slate-400 text-xs mt-0.5">By {tool.vendor}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl p-2 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/30 rounded-lg p-3 border border-slate-850">
              {tool.description}
            </p>
          </div>

          {/* Core Metrics Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Benchmark Scores</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Overall Rating', val: tool.overall_rating },
                { label: 'Readiness', val: tool.enterprise_readiness_score },
                { label: 'Latency', val: tool.latency_score },
                { label: 'Cost Efficiency', val: tool.cost_efficiency_score },
                { label: 'Security', val: tool.security_score },
                { label: 'Scalability', val: tool.scalability_score },
              ].map((m) => (
                <div key={m.label} className="bg-slate-900/60 border border-slate-850 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">{m.label}</span>
                  <ScoreBadge score={m.val} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Details & Specs */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Specifications</h4>
            <div className="divide-y divide-slate-850 bg-slate-900/30 border border-slate-850 rounded-lg overflow-hidden text-sm">
              {[
                { label: 'Pricing Model', val: tool.pricing_model },
                { label: 'License', val: tool.license || 'N/A' },
                { label: 'Open Source', val: tool.open_source ? 'Yes' : 'No' },
                { label: 'Supported Clouds', val: tool.supported_clouds || 'Any' },
                { label: 'Self Hosting', val: tool.self_hosting_support ? 'Supported' : 'Not Supported' },
                { label: 'SLA Support', val: tool.sla_support ? 'Supported' : 'Not Supported' },
                { label: 'Compliance Standards', val: tool.compliance || 'Standard' },
                { label: 'Release Year', val: tool.release_year },
                { label: 'Latest Version', val: tool.latest_version },
              ].map((item) => (
                <div key={item.label} className="flex justify-between p-3.5">
                  <span className="text-slate-400 font-medium">{item.label}</span>
                  <span className="text-white font-semibold">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing notes */}
          {tool.pricing_notes && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pricing & Licensing Notes</h4>
              <p className="text-xs text-slate-350 bg-indigo-950/10 border border-indigo-950/60 p-3 rounded-lg leading-relaxed">
                {tool.pricing_notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex justify-end gap-3">
          {tool.website && (
            <a
              href={tool.website}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Official Website
            </a>
          )}
          {tool.documentation && (
            <a
              href={tool.documentation}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-550 rounded-lg text-xs font-semibold text-white transition-colors"
            >
              Documentation
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
