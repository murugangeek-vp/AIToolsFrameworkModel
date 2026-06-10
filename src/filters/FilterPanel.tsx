import React from 'react';
import { useFilterStore } from '@store/useFilterStore';
import { BUILT_IN_PRESETS } from '@types-app/FilterState';

export const FilterPanel: React.FC = () => {
  const { filters, setFilter, resetFilters, applyPreset, activePresetId } = useFilterStore();

  return (
    <div className="glass rounded-xl p-5 space-y-6" style={{ border: '1px solid var(--border-color)' }}>
      {/* Header */}
      <div className="flex justify-between items-center pb-3" style={{ borderBottom: '1px solid var(--divider)' }}>
        <h4 className="font-bold t-text tracking-wide">Filters &amp; Presets</h4>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold cursor-pointer transition-colors"
          style={{ color: 'var(--accent-indigo)' }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.75')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Reset All
        </button>
      </div>

      {/* Presets */}
      <div>
        <label className="text-xs font-semibold t-label uppercase tracking-wider block mb-2.5">
          Quick Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {BUILT_IN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                activePresetId === preset.id ? 't-selected' : 't-unselected'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div>
        <label className="text-xs font-semibold t-label uppercase tracking-wider block mb-2">
          Search Name/Vendor
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="e.g. GPT-4o, LangChain..."
          className="t-input w-full rounded-lg px-3.5 py-2 text-sm outline-none transition-colors"
        />
      </div>

      {/* Flags / Toggles */}
      <div className="space-y-3.5">
        <label className="text-xs font-semibold t-label uppercase tracking-wider block mb-1">
          Flags
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'openSourceOnly', label: 'Open Source' },
            { key: 'paidOnly', label: 'Proprietary' },
            { key: 'enterpriseReadyOnly', label: 'Enterprise Ready' },
            { key: 'lowLatencyOnly', label: 'Low Latency' },
            { key: 'topRatedOnly', label: 'Top Rated (≥ 90)' },
            { key: 'budgetFriendlyOnly', label: 'Budget Friendly' },
            { key: 'highlyScalableOnly', label: 'Highly Scalable' },
            { key: 'secureOnly', label: 'High Security' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 text-sm t-text-secondary cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={filters[item.key as keyof typeof filters] as boolean}
                onChange={(e) => setFilter(item.key as any, e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: 'var(--accent-indigo)' }}
              />
              <span className="line-clamp-1">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Range Sliders */}
      <div className="space-y-4 pt-2">
        <label className="text-xs font-semibold t-label uppercase tracking-wider block">
          Score Thresholds
        </label>
        {[
          { key: 'minRating', label: 'Min Overall Rating' },
          { key: 'minEnterpriseScore', label: 'Min Enterprise Score' },
          { key: 'minLatencyScore', label: 'Min Latency Score' },
          { key: 'minCostEfficiency', label: 'Min Cost Efficiency' },
        ].map((slider) => (
          <div key={slider.key} className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="t-text-secondary">{slider.label}</span>
              <span className="font-bold" style={{ color: 'var(--accent-indigo)' }}>
                {filters[slider.key as keyof typeof filters] as number}+
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filters[slider.key as keyof typeof filters] as number}
              onChange={(e) => setFilter(slider.key as any, parseInt(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: 'var(--accent-indigo)', background: 'var(--border-color)' }}
            />
          </div>
        ))}
      </div>

      {/* Sorting */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div>
          <label className="text-xs font-semibold t-label uppercase tracking-wider block mb-1.5">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value as any)}
            className="t-select w-full rounded-lg px-2.5 py-2 text-xs outline-none cursor-pointer"
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
          <label className="text-xs font-semibold t-label uppercase tracking-wider block mb-1.5">
            Direction
          </label>
          <select
            value={filters.sortDirection}
            onChange={(e) => setFilter('sortDirection', e.target.value as any)}
            className="t-select w-full rounded-lg px-2.5 py-2 text-xs outline-none cursor-pointer"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};
