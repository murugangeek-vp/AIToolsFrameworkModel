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
  const { activeCategoryId, viewMode, setViewMode } = useUIStore();
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);

  // Initial Load
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Load category specifically when active category changes
  useEffect(() => {
    if (activeCategoryId) {
      const cat = CATEGORY_REGISTRY.find((c) => c.id === activeCategoryId);
      if (cat) {
        loadCategory(activeCategoryId);
      }
    }
  }, [activeCategoryId, loadCategory]);

  const filteredTools = applyFilters(
    tools.filter((t) => {
      if (!activeCategoryId) return true;
      const meta = CATEGORY_REGISTRY.find((c) => c.id === activeCategoryId);
      return meta ? t.category === meta.label : true;
    }),
    filters
  );

  const activeCategoryMeta = CATEGORY_REGISTRY.find((c) => c.id === activeCategoryId);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {activeCategoryMeta ? activeCategoryMeta.label : 'AI Stack Explorer'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {activeCategoryMeta
              ? activeCategoryMeta.description
              : 'Benchmark and find enterprise-grade tools across the AI stack.'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Grid Card
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
              viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Table view
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filters column */}
        <div className="lg:col-span-1">
          <FilterPanel />
        </div>

        {/* Right content list */}
        <div className="lg:col-span-3 space-y-4">
          {(loading || (activeCategoryId && loadingCategory === activeCategoryId)) ? (
            <LoadingSkeleton type={viewMode === 'grid' ? 'card' : 'table'} count={6} />
          ) : filteredTools.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center text-slate-450 border border-dashed border-slate-800">
              <span className="text-3xl block mb-2">🔍</span>
              <p className="font-semibold text-white">No tools match active criteria</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting filters or changing categories.</p>
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

      {/* Slide Drawer/Modal details */}
      {selectedTool && (
        <ToolDetailPage tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </div>
  );
};
