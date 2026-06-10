import React, { useEffect, useState } from 'react';
import { useToolStore } from '@store/useToolStore';
import { useFilterStore } from '@store/useFilterStore';
import { useUIStore } from '@store/useUIStore';
import { applyFilters } from '@utils/filterEngine';
import { ToolCard } from '@components/ToolCard';
import { ToolTable } from '@components/ToolTable';
import { FilterPanel } from '@filters/FilterPanel';
import { LoadingSkeleton } from '@components/LoadingSkeleton';
import { ToolDetailPage } from './ToolDetailPage';
import type { AITool } from '@types-app/AITool';
import { CATEGORY_REGISTRY } from '@types-app/index';

export const ExplorerPage: React.FC = () => {
  const { tools, loading, loadAll, loadCategory, loadingCategory } = useToolStore();
  const { filters } = useFilterStore();
  const { activeCategoryId, viewMode, setViewMode, pinnedToolId, pinnedFromQuery, clearPinned } = useUIStore();
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    if (activeCategoryId) {
      const cat = CATEGORY_REGISTRY.find((c) => c.id === activeCategoryId);
      if (cat) loadCategory(activeCategoryId);
    }
  }, [activeCategoryId, loadCategory]);

  // Apply filters
  let baseFilteredTools = tools.filter((t) => {
    if (!activeCategoryId) return true;
    const meta = CATEGORY_REGISTRY.find((c) => c.id === activeCategoryId);
    return meta ? t.category === meta.label : true;
  });

  let filteredTools = applyFilters(baseFilteredTools, filters);

  // If a tool is pinned, bubble it to the top of the filtered list
  const pinnedTool = pinnedToolId ? tools.find((t) => t.id === pinnedToolId) : null;
  if (pinnedTool) {
    const withoutPinned = filteredTools.filter((t) => t.id !== pinnedTool.id);
    
    // Check if the pinned tool aligns with the selected category filter
    const activeCategoryMeta = CATEGORY_REGISTRY.find((c) => c.id === activeCategoryId);
    const categoryMatches = !activeCategoryId || (activeCategoryMeta && pinnedTool.category === activeCategoryMeta.label);

    if (categoryMatches) {
      // Prepend the pinned tool at the top of the list
      filteredTools = [pinnedTool, ...withoutPinned];
    }
  }

  const activeCategoryMeta = CATEGORY_REGISTRY.find((c) => c.id === activeCategoryId);

  return (
    <div className="space-y-6">
      {/* Pinned tool search match banner */}
      {pinnedTool && (
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border glass animate-[fade-in-up_0.3s_ease-out] gap-4"
          style={{ borderColor: 'var(--accent-indigo)', background: 'var(--glass-bg)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl animate-bounce">📌</span>
            <div>
              <p className="text-xs font-bold t-text">
                Showing <span style={{ color: 'var(--accent-indigo)' }}>{pinnedTool.name}</span> at the top of the list
              </p>
              <p className="text-[10px] t-text-muted mt-0.5">
                Matched search query: &quot;<span className="italic font-medium">{pinnedFromQuery}</span>&quot; under Category: <span className="font-semibold">{pinnedTool.category}</span>.
              </p>
            </div>
          </div>
          <button
            onClick={clearPinned}
            className="text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg cursor-pointer transition-all shrink-0 shadow-sm"
            style={{ background: 'var(--accent-indigo)', color: '#fff' }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Clear Highlight
          </button>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black t-text tracking-tight">
            {activeCategoryMeta ? activeCategoryMeta.label : 'AI Stack Explorer'}
          </h2>
          <p className="t-text-secondary text-sm mt-1">
            {activeCategoryMeta
              ? activeCategoryMeta.description
              : 'Benchmark and find enterprise-grade tools across the AI stack.'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="t-view-toggle rounded-lg p-1 flex">
          {[
            { mode: 'grid', label: '⊞ Grid Card' },
            { mode: 'table', label: '☰ Table View' },
          ].map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as 'grid' | 'table')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                viewMode === mode ? '' : 't-theme-btn-inactive'
              }`}
              style={
                viewMode === mode
                  ? { background: 'var(--accent-indigo)', color: '#fff' }
                  : {}
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterPanel />
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {loading || (activeCategoryId && loadingCategory === activeCategoryId) ? (
            <LoadingSkeleton type={viewMode === 'grid' ? 'card' : 'table'} count={6} />
          ) : filteredTools.length === 0 ? (
            <div
              className="glass rounded-xl p-12 text-center"
              style={{ border: '1px dashed var(--border-color)' }}
            >
              <span className="text-3xl block mb-2">🔍</span>
              <p className="font-semibold t-text">No tools match active criteria</p>
              <p className="text-xs t-text-muted mt-1">Try resetting filters or changing categories.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onSelect={setSelectedTool} />
              ))}
            </div>
          ) : (
            <ToolTable data={filteredTools} onSelect={setSelectedTool} />
          )}
        </div>
      </div>

      {selectedTool && (
        <ToolDetailPage tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </div>
  );
};
