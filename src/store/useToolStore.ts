/**
 * useToolStore — Application Layer
 * Single Responsibility: Manage AI tool data loading and caching
 */
import { create } from 'zustand';
import { dataLoader } from '@services/DataLoader';
import type { AITool } from '@types-app/AITool';

interface ToolStoreState {
  // Data
  tools: AITool[];
  toolsById: Map<string, AITool>;
  
  // Loading state
  loading: boolean;
  loadingCategory: string | null;
  error: string | null;
  
  // Loaded tracking
  loadedCategories: Set<string>;
  
  // Actions
  loadAll: () => Promise<void>;
  loadCategory: (categoryId: string) => Promise<void>;
  getToolById: (id: string) => AITool | undefined;
  addCustomTools: (tools: AITool[]) => void;
  clearError: () => void;
}

export const useToolStore = create<ToolStoreState>((set, get) => ({
  tools: [],
  toolsById: new Map(),
  loading: false,
  loadingCategory: null,
  error: null,
  loadedCategories: new Set(),

  loadAll: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const tools = await dataLoader.loadAll();
      const toolsById = new Map(tools.map((t) => [t.id, t]));
      set({ tools, toolsById, loading: false });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'Failed to load data' });
    }
  },

  loadCategory: async (categoryId: string) => {
    const { loadedCategories } = get();
    if (loadedCategories.has(categoryId)) return;
    
    set({ loadingCategory: categoryId, error: null });
    try {
      const newTools = await dataLoader.loadCategory(categoryId);
      const { tools, toolsById } = get();
      
      // Merge without duplicates
      const merged = [...tools];
      const mergedById = new Map(toolsById);
      
      newTools.forEach((tool) => {
        if (!mergedById.has(tool.id)) {
          merged.push(tool);
          mergedById.set(tool.id, tool);
        }
      });
      
      const newLoaded = new Set(loadedCategories);
      newLoaded.add(categoryId);
      
      set({ tools: merged, toolsById: mergedById, loadingCategory: null, loadedCategories: newLoaded });
    } catch (err) {
      set({ loadingCategory: null, error: err instanceof Error ? err.message : 'Failed to load category' });
    }
  },

  getToolById: (id: string) => get().toolsById.get(id),

  addCustomTools: (newTools: AITool[]) => {
    const { tools, toolsById } = get();
    const merged = [...tools];
    const mergedById = new Map(toolsById);
    
    newTools.forEach((tool) => {
      if (!mergedById.has(tool.id)) {
        merged.push(tool);
        mergedById.set(tool.id, tool);
      }
    });
    
    set({ tools: merged, toolsById: mergedById });
  },

  clearError: () => set({ error: null }),
}));
