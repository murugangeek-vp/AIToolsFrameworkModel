import React from 'react';
import { useFilterStore } from '@store/useFilterStore';
import { BUILT_IN_PRESETS } from '@types-app/FilterState';

export const FilterPanel: React.FC = () => {
  const { filters, setFilter, resetFilters, applyPreset, activePresetId } = useFilterStore();

  return (
    <div className="glass rounded-xl p-5 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
        <h4 className="font-bold text-white tracking-wide">Filters & Presets</h4>
        <button
          onClick={resetFilters}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* Presets */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
          Quick Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {BUILT_IN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                activePresetId === preset.id
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                  : 'border-slate-850 bg-slate-900/40 text-slate-300 hover:border-slate-700'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Search Name/Vendor
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="e.g. GPT-4o, LangChain..."
          className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500/60 rounded-lg px-3.5 py-2 text-sm text-slate-200 outline-none transition-colors"
        />
      </div>

      {/* Toggle Filters */}
      <div className="space-y-3.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          Flags
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'openSourceOnly', label: 'Open Source' },
            { key: 'paidOnly', label: 'Proprietary' },
            { key: 'enterpriseReadyOnly', label: 'Enterprise Ready' },
            { key: 'lowLatencyOnly', label: 'Low Latency' },
            { key: 'topRatedOnly', label: 'Top Rated (>= 90)' },
            { key: 'budgetFriendlyOnly', label: 'Budget Friendly' },
            { key: 'highlyScalableOnly', label: 'Highly Scalable' },
            { key: 'secureOnly', label: 'High Security' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={filters[item.key as keyof typeof filters] as boolean}
                onChange={(e) => setFilter(item.key as any, e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20"
              />
              <span className="line-clamp-1">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Range Sliders */}
      <div className="space-y-4 pt-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Score Thresholds
        </label>
        {[
          { key: 'minRating', label: 'Min Overall Rating' },
          { key: 'minEnterpriseScore', label: 'Min Enterprise Score' },
          { key: 'minLatencyScore', label: 'Min Latency Score' },
          { key: 'minCostEfficiency', label: 'Min Cost Efficiency' },
        ].map((slider) => (
          <div key={slider.key} className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-slate-350">
              <span>{slider.label}</span>
              <span className="text-indigo-400 font-bold">
                {filters[slider.key as keyof typeof filters] as number}+
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filters[slider.key as keyof typeof filters] as number}
              onChange={(e) => setFilter(slider.key as any, parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-550"
            />
          </div>
        ))}
      </div>

      {/* Sorting */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value as any)}
            className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500/60 rounded-lg px-2.5 py-2 text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="default">Default</option>
            <option value="name">Name</option>
            <option value="overall_rating">Overall Rating</option>
            <option value="enterprise_readiness_score">Enterprise Score</option>
            <option value="latency_score">Latency Score</option>
            <option value="cost_efficiency_score">Cost Score</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Direction
          </label>
          <select
            value={filters.sortDirection}
            onChange={(e) => setFilter('sortDirection', e.target.value as any)}
            className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500/60 rounded-lg px-2.5 py-2 text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};
