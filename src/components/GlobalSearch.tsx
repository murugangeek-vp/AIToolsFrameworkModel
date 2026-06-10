import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToolStore } from '@store/useToolStore';
import { useUIStore } from '@store/useUIStore';
import { CATEGORY_REGISTRY } from '@types-app/index';
import type { AITool, CategoryMeta } from '@types-app/index';

interface SearchResult {
  type: 'tool' | 'category';
  id: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  categoryId: string;
  icon: string;
  rawItem: AITool | CategoryMeta;
}

export const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const { tools, loadAll } = useToolStore();
  const { navigateToTool, navigateToCategory } = useUIStore();
  
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure all tools are loaded for global search capability
  useEffect(() => {
    if (tools.length === 0) {
      loadAll();
    }
  }, [tools.length, loadAll]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener (Ctrl+K or / to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement !== inputRef.current)) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools and categories based on search input
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const cleanQuery = query.toLowerCase().trim();

    // 1. Search categories
    const categoryHits: SearchResult[] = CATEGORY_REGISTRY.filter((cat) => {
      return (
        cat.label.toLowerCase().includes(cleanQuery) ||
        cat.description.toLowerCase().includes(cleanQuery)
      );
    }).map((cat) => ({
      type: 'category',
      id: cat.id,
      title: cat.label,
      subtitle: cat.description,
      categoryLabel: cat.label,
      categoryId: cat.id,
      icon: cat.icon || '📁',
      rawItem: cat,
    }));

    // 2. Search tools
    const toolHits: SearchResult[] = tools.filter((tool) => {
      return (
        tool.name.toLowerCase().includes(cleanQuery) ||
        tool.subcategory.toLowerCase().includes(cleanQuery) ||
        tool.vendor.toLowerCase().includes(cleanQuery) ||
        tool.description.toLowerCase().includes(cleanQuery) ||
        tool.tags.toLowerCase().includes(cleanQuery)
      );
    }).map((tool) => {
      const catMeta = CATEGORY_REGISTRY.find((c) => c.label === tool.category);
      return {
        type: 'tool',
        id: tool.id,
        title: tool.name,
        subtitle: `${tool.vendor} • ${tool.subcategory}`,
        categoryLabel: tool.category,
        categoryId: catMeta?.id || 'llm-models',
        icon: catMeta?.icon || '⚙️',
        rawItem: tool,
      };
    });

    // Combine results (limit to top 4 categories and top 6 tools to keep dropdown performant)
    setResults([...categoryHits.slice(0, 3), ...toolHits.slice(0, 6)]);
    setActiveIndex(-1);
  }, [query, tools]);

  const handleSelect = (item: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
    
    // Ensure we are on the Explorer route
    navigate('/');
    
    if (item.type === 'tool') {
      navigateToTool(item.categoryId, item.id, query);
    } else {
      navigateToCategory(item.categoryId, query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-4 z-50">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-sm t-text-muted">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tools, categories, frameworks (e.g. Ollama)..."
          className="w-full text-xs pl-9 pr-12 py-2 rounded-lg border t-input transition-smooth font-medium shadow-sm"
          style={{ height: '36px' }}
        />
        <kbd className="absolute right-3 hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold t-text-muted bg-[var(--surface-bg)] border border-[var(--border-subtle)] rounded shadow-sm">
          /
        </kbd>
      </div>

      {/* Dropdown list of matching results */}
      {isOpen && (query.trim() !== '') && (
        <div 
          className="absolute left-0 right-0 mt-2 rounded-xl glass shadow-card border overflow-hidden max-h-[420px] overflow-y-auto"
          style={{ borderColor: 'var(--border-color)', background: 'var(--glass-bg)' }}
        >
          {results.length === 0 ? (
            <div className="p-4 text-center text-xs t-text-secondary">
              No matching tools or categories found for &quot;<span className="font-semibold text-[var(--accent-indigo)]">{query}</span>&quot;
            </div>
          ) : (
            <div className="py-2">
              {/* Group Category results first if any */}
              {results.some(r => r.type === 'category') && (
                <div>
                  <div className="px-3 py-1 text-[9px] font-black uppercase tracking-wider t-label">
                    Categories & Domains
                  </div>
                  {results.filter(r => r.type === 'category').map((item) => {
                    const idx = results.indexOf(item);
                    const isSelected = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-colors ${
                          isSelected ? 'bg-[var(--surface-hover)]' : ''
                        }`}
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex-1 truncate">
                          <div className="text-xs font-bold t-text flex items-center gap-1.5">
                            {item.title}
                            <span className="text-[9px] px-1.5 py-0.2 rounded uppercase font-extrabold tracking-widest" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--selected-text)' }}>
                              Category
                            </span>
                          </div>
                          <div className="text-[10px] t-text-muted truncate mt-0.5">{item.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Group Tool results */}
              {results.some(r => r.type === 'tool') && (
                <div className="mt-2">
                  <div className="px-3 py-1 text-[9px] font-black uppercase tracking-wider t-label">
                    Tools & Frameworks
                  </div>
                  {results.filter(r => r.type === 'tool').map((item) => {
                    const idx = results.indexOf(item);
                    const isSelected = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-colors ${
                          isSelected ? 'bg-[var(--surface-hover)]' : ''
                        }`}
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                      >
                        <span className="text-base">{item.icon}</span>
                        <div className="flex-1 truncate">
                          <div className="text-xs font-bold t-text flex items-center gap-1.5">
                            {item.title}
                            <span className="text-[9px] px-1.5 py-0.2 rounded uppercase font-semibold" style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                              {item.categoryLabel}
                            </span>
                          </div>
                          <div className="text-[10px] t-text-secondary truncate mt-0.5">{item.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
