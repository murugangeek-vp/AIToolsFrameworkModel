/**
 * useUIStore — Application Layer
 * Single Responsibility: Manage UI state (sidebar, view mode, active page, global search)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewMode = 'grid' | 'table';
type ActiveDashboard = 'trends' | 'enterprise' | 'cost' | 'latency' | 'security' | 'ecosystem';

interface UIStoreState {
  sidebarCollapsed: boolean;
  viewMode: ViewMode;
  activeDashboard: ActiveDashboard;
  activeCategoryId: string | null;
  searchOpen: boolean;
  filterPanelOpen: boolean;
  compareBarVisible: boolean;
  theme: 'dark' | 'light' | 'classic';

  /** Global search — the ID of the tool to pin at top of Explorer results */
  pinnedToolId: string | null;
  /** The query text that triggered the navigation (used for banner display) */
  pinnedFromQuery: string;

  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  setViewMode: (v: ViewMode) => void;
  setActiveDashboard: (v: ActiveDashboard) => void;
  setActiveCategoryId: (v: string | null) => void;
  setSearchOpen: (v: boolean) => void;
  setFilterPanelOpen: (v: boolean) => void;
  toggleFilterPanel: () => void;
  setCompareBarVisible: (v: boolean) => void;
  setTheme: (theme: 'dark' | 'light' | 'classic') => void;

  /** Navigate to a category and pin a specific tool at the top */
  navigateToTool: (categoryId: string | null, toolId: string, query: string) => void;
  /** Navigate to a category (from a category search hit) with no single pinned tool */
  navigateToCategory: (categoryId: string, query: string) => void;
  /** Clear pinned tool state */
  clearPinned: () => void;
}

export const useUIStore = create<UIStoreState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      viewMode: 'grid',
      activeDashboard: 'trends',
      activeCategoryId: null,
      searchOpen: false,
      filterPanelOpen: false,
      compareBarVisible: false,
      theme: 'dark',
      pinnedToolId: null,
      pinnedFromQuery: '',

      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setViewMode: (v) => set({ viewMode: v }),
      setActiveDashboard: (v) => set({ activeDashboard: v }),
      setActiveCategoryId: (v) => set({ activeCategoryId: v, pinnedToolId: null, pinnedFromQuery: '' }),
      setSearchOpen: (v) => set({ searchOpen: v }),
      setFilterPanelOpen: (v) => set({ filterPanelOpen: v }),
      toggleFilterPanel: () => set((s) => ({ filterPanelOpen: !s.filterPanelOpen })),
      setCompareBarVisible: (v) => set({ compareBarVisible: v }),
      setTheme: (theme) => set({ theme }),

      navigateToTool: (categoryId, toolId, query) =>
        set({ activeCategoryId: categoryId, pinnedToolId: toolId, pinnedFromQuery: query }),

      navigateToCategory: (categoryId, query) =>
        set({ activeCategoryId: categoryId, pinnedToolId: null, pinnedFromQuery: query }),

      clearPinned: () => set({ pinnedToolId: null, pinnedFromQuery: '' }),
    }),
    {
      name: 'ai-explorer-ui',
      partialize: (s) => ({
        sidebarCollapsed: s.sidebarCollapsed,
        viewMode: s.viewMode,
        theme: s.theme,
      }),
    }
  )
);
