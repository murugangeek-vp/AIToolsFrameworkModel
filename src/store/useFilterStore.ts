/**
 * useFilterStore — Application Layer
 * Single Responsibility: Manage filter state and presets
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_FILTER_STATE, BUILT_IN_PRESETS } from '@types-app/FilterState';
import type { FilterState, FilterPreset } from '@types-app/FilterState';

interface FilterStoreState {
  filters: FilterState;
  presets: FilterPreset[];
  activePresetId: string | null;
  
  // Actions
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  setFilters: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;
  applyPreset: (presetId: string) => void;
  savePreset: (name: string, description: string) => void;
  deletePreset: (presetId: string) => void;
  
  // Computed
  activeFilterCount: () => number;
}

export const useFilterStore = create<FilterStoreState>()(
  persist(
    (set, get) => ({
      filters: DEFAULT_FILTER_STATE,
      presets: BUILT_IN_PRESETS,
      activePresetId: null,

      setFilter: (key, value) => {
        set((s) => ({
          filters: { ...s.filters, [key]: value },
          activePresetId: null,
        }));
      },

      setFilters: (partial) => {
        set((s) => ({
          filters: { ...s.filters, ...partial },
          activePresetId: null,
        }));
      },

      resetFilters: () => {
        set({ filters: DEFAULT_FILTER_STATE, activePresetId: null });
      },

      applyPreset: (presetId: string) => {
        const preset = get().presets.find((p) => p.id === presetId);
        if (!preset) return;
        set({
          filters: { ...DEFAULT_FILTER_STATE, ...preset.filters },
          activePresetId: presetId,
        });
      },

      savePreset: (name: string, description: string) => {
        const preset: FilterPreset = {
          id: `custom-${Date.now()}`,
          name,
          description,
          filters: { ...get().filters },
          createdAt: new Date().toISOString(),
          isBuiltIn: false,
        };
        set((s) => ({ presets: [...s.presets, preset], activePresetId: preset.id }));
      },

      deletePreset: (presetId: string) => {
        set((s) => ({
          presets: s.presets.filter((p) => p.id !== presetId && !p.isBuiltIn),
          activePresetId: s.activePresetId === presetId ? null : s.activePresetId,
        }));
      },

      activeFilterCount: () => {
        const f = get().filters;
        let count = 0;
        if (f.search) count++;
        if (f.categories.length) count++;
        if (f.openSourceOnly) count++;
        if (f.paidOnly) count++;
        if (f.enterpriseReadyOnly) count++;
        if (f.lowLatencyOnly) count++;
        if (f.topRatedOnly) count++;
        if (f.budgetFriendlyOnly) count++;
        if (f.highlyScalableOnly) count++;
        if (f.secureOnly) count++;
        if (f.minRating > 0) count++;
        if (f.minEnterpriseScore > 0) count++;
        if (f.minLatencyScore > 0) count++;
        if (f.minCostEfficiency > 0) count++;
        return count;
      },
    }),
    {
      name: 'ai-explorer-filters',
      partialize: (state) => ({ presets: state.presets.filter((p) => !p.isBuiltIn) }),
    }
  )
);
