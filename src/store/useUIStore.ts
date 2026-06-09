/**
 * useUIStore — Application Layer
 * Single Responsibility: Manage UI state (sidebar, view mode, active page)
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
  
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  setViewMode: (v: ViewMode) => void;
  setActiveDashboard: (v: ActiveDashboard) => void;
  setActiveCategoryId: (v: string | null) => void;
  setSearchOpen: (v: boolean) => void;
  setFilterPanelOpen: (v: boolean) => void;
  toggleFilterPanel: () => void;
  setCompareBarVisible: (v: boolean) => void;
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

      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setViewMode: (v) => set({ viewMode: v }),
      setActiveDashboard: (v) => set({ activeDashboard: v }),
      setActiveCategoryId: (v) => set({ activeCategoryId: v }),
      setSearchOpen: (v) => set({ searchOpen: v }),
      setFilterPanelOpen: (v) => set({ filterPanelOpen: v }),
      toggleFilterPanel: () => set((s) => ({ filterPanelOpen: !s.filterPanelOpen })),
      setCompareBarVisible: (v) => set({ compareBarVisible: v }),
    }),
    {
      name: 'ai-explorer-ui',
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed, viewMode: s.viewMode }),
    }
  )
);
