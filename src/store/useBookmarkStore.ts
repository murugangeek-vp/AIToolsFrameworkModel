/**
 * useBookmarkStore — Application Layer
 * Persists favorites, bookmarks, and recently viewed to localStorage
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AITool } from '@types-app/AITool';

interface BookmarkEntry {
  id: string;
  name: string;
  category: string;
  vendor: string;
  overall_rating: number;
  bookmarkedAt: string;
}

interface BookmarkStoreState {
  favorites: BookmarkEntry[];
  bookmarks: BookmarkEntry[];
  recentlyViewed: BookmarkEntry[];
  
  addFavorite: (tool: AITool) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  
  addBookmark: (tool: AITool) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  
  addRecentlyViewed: (tool: AITool) => void;
  clearRecents: () => void;
}

function toEntry(tool: AITool): BookmarkEntry {
  return {
    id: tool.id,
    name: tool.name,
    category: tool.category,
    vendor: tool.vendor,
    overall_rating: tool.overall_rating,
    bookmarkedAt: new Date().toISOString(),
  };
}

export const useBookmarkStore = create<BookmarkStoreState>()(
  persist(
    (set, get) => ({
      favorites: [],
      bookmarks: [],
      recentlyViewed: [],

      addFavorite: (tool) => {
        if (get().isFavorite(tool.id)) return;
        set((s) => ({ favorites: [toEntry(tool), ...s.favorites].slice(0, 50) }));
      },
      removeFavorite: (id) => set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) })),
      isFavorite: (id) => get().favorites.some((f) => f.id === id),

      addBookmark: (tool) => {
        if (get().isBookmarked(tool.id)) return;
        set((s) => ({ bookmarks: [toEntry(tool), ...s.bookmarks].slice(0, 100) }));
      },
      removeBookmark: (id) => set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
      isBookmarked: (id) => get().bookmarks.some((b) => b.id === id),

      addRecentlyViewed: (tool) => {
        set((s) => {
          const filtered = s.recentlyViewed.filter((r) => r.id !== tool.id);
          return { recentlyViewed: [toEntry(tool), ...filtered].slice(0, 20) };
        });
      },
      clearRecents: () => set({ recentlyViewed: [] }),
    }),
    { name: 'ai-explorer-bookmarks' }
  )
);
