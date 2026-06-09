/**
 * useComparisonStore — Application Layer
 * Single Responsibility: Manage tool comparison selection (max 5)
 */
import { create } from 'zustand';
import type { AITool } from '@types-app/AITool';

const MAX_COMPARE = 5;

interface ComparisonStoreState {
  selectedTools: AITool[];
  isComparing: boolean;
  
  addTool: (tool: AITool) => boolean; // returns false if max reached
  removeTool: (toolId: string) => void;
  clearAll: () => void;
  isSelected: (toolId: string) => boolean;
  canAdd: () => boolean;
  setComparing: (value: boolean) => void;
}

export const useComparisonStore = create<ComparisonStoreState>((set, get) => ({
  selectedTools: [],
  isComparing: false,

  addTool: (tool: AITool) => {
    const { selectedTools } = get();
    if (selectedTools.length >= MAX_COMPARE) return false;
    if (selectedTools.some((t) => t.id === tool.id)) return true;
    set({ selectedTools: [...selectedTools, tool] });
    return true;
  },

  removeTool: (toolId: string) => {
    set((s) => ({ selectedTools: s.selectedTools.filter((t) => t.id !== toolId) }));
  },

  clearAll: () => set({ selectedTools: [], isComparing: false }),

  isSelected: (toolId: string) => get().selectedTools.some((t) => t.id === toolId),

  canAdd: () => get().selectedTools.length < MAX_COMPARE,

  setComparing: (value: boolean) => set({ isComparing: value }),
}));
