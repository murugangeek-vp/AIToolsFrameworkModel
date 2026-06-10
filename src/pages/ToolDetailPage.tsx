import React from 'react';
import type { AITool } from '@types-app/AITool';
import { ScoreBadge } from '@components/ScoreBadge';

interface ToolDetailPageProps {
  tool: AITool;
  onClose: () => void;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ tool, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end t-modal-overlay backdrop-blur-sm">
      <div
        className="t-modal w-full max-w-2xl h-full shadow-2xl flex flex-col justify-between animate-slide-in-right"
        style={{ animation: 'slide-in-right 0.3s ease forwards' }}
      >
        {/* Header */}
        <div className="p-6 t-modal-header flex justify-between items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-indigo)' }}>
              {tool.category}
            </span>
            <h3 className="text-xl font-black t-text mt-1">{tool.name}</h3>
            <p className="t-text-muted text-xs mt-0.5">By {tool.vendor}</p>
          </div>
          <button
            onClick={onClose}
            className="t-text-secondary hover:t-text text-xl p-2 rounded-lg cursor-pointer transition-all"
            style={{ transition: 'all 0.15s' }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--surface-hover)';
              e.currentTarget.style.color = 'var(--text-color)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold t-label uppercase tracking-widest mb-2">Description</h4>
            <p
              className="text-sm t-text-secondary leading-relaxed rounded-lg p-3"
              style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-subtle)' }}
            >
              {tool.description}
            </p>
          </div>

          {/* Benchmark Scores */}
          <div>
            <h4 className="text-xs font-bold t-label uppercase tracking-widest mb-3">Benchmark Scores</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Overall Rating', val: tool.overall_rating },
                { label: 'Readiness', val: tool.enterprise_readiness_score },
                { label: 'Latency', val: tool.latency_score },
                { label: 'Cost Efficiency', val: tool.cost_efficiency_score },
                { label: 'Security', val: tool.security_score },
                { label: 'Scalability', val: tool.scalability_score },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-lg p-3 flex justify-between items-center"
                  style={{
                    background: 'var(--surface-bg)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span className="text-xs font-medium t-text-muted">{m.label}</span>
                  <ScoreBadge score={m.val} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h4 className="text-xs font-bold t-label uppercase tracking-widest mb-3">Specifications</h4>
            <div
              className="rounded-lg overflow-hidden text-sm"
              style={{ border: '1px solid var(--border-subtle)' }}
            >
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
              ].map((item, idx) => (
                <div
                  key={item.label}
                  className="flex justify-between p-3.5"
                  style={{
                    borderBottom: idx < 8 ? '1px solid var(--border-subtle)' : 'none',
                    background: idx % 2 === 0 ? 'var(--surface-bg)' : 'transparent',
                  }}
                >
                  <span className="t-text-muted font-medium">{item.label}</span>
                  <span className="t-text font-semibold">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Notes */}
          {tool.pricing_notes && (
            <div>
              <h4 className="text-xs font-bold t-label uppercase tracking-widest mb-2">Pricing & Licensing Notes</h4>
              <p
                className="text-xs t-text-secondary leading-relaxed p-3 rounded-lg"
                style={{
                  background: 'rgba(99,102,241,0.07)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                {tool.pricing_notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 t-modal-footer flex justify-end gap-3">
          {tool.website && (
            <a
              href={tool.website}
              target="_blank"
              rel="noreferrer"
              className="t-btn-secondary px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            >
              Official Website
            </a>
          )}
          {tool.documentation && (
            <a
              href={tool.documentation}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
              style={{ background: 'var(--accent-indigo)' }}
            >
              Documentation
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
