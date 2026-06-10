import React from 'react';
import { useUIStore } from '@store/useUIStore';
import { CATEGORY_REGISTRY } from '@types-app/index';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, activeCategoryId, setActiveCategoryId, toggleSidebar } = useUIStore();

  return (
    <aside
      className={`t-sidebar min-h-screen flex flex-col justify-between transition-all duration-300 z-40 fixed md:static ${
        sidebarCollapsed ? 'w-18' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🧬</span>
            <div>
              <h1 className="font-black t-text text-base tracking-tight leading-none">AI STACK</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5 block" style={{ color: 'var(--accent-indigo)' }}>
                Explorer 2026
              </span>
            </div>
          </div>
        ) : (
          <span className="text-xl mx-auto">🧬</span>
        )}
        <button
          onClick={toggleSidebar}
          className="t-text-muted p-1.5 rounded-lg cursor-pointer hidden md:block transition-all hover:t-text"
          style={{ transition: 'all 0.15s' }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          {sidebarCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest t-label">
          {!sidebarCollapsed ? 'Categories' : 'CAT'}
        </div>

        {/* All Categories Option */}
        <button
          onClick={() => setActiveCategoryId(null)}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer font-medium ${
            activeCategoryId === null ? 't-nav-item-active' : 't-nav-item'
          }`}
        >
          <span className="text-base">🌐</span>
          {!sidebarCollapsed && <span>All Platforms</span>}
        </button>

        {CATEGORY_REGISTRY.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer font-medium ${
              activeCategoryId === cat.id ? 't-nav-item-active' : 't-nav-item'
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            {!sidebarCollapsed && (
              <div className="flex justify-between items-center w-full">
                <span className="truncate">{cat.label}</span>
                {cat.trending && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{
                      background: 'rgba(99,102,241,0.18)',
                      color: 'var(--selected-text)',
                    }}
                  >
                    Hot
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Footer Meta */}
      <div
        className="p-4 text-center text-xs t-text-muted"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        {!sidebarCollapsed ? (
          <div>
            <p className="font-semibold">AI Stack Explorer</p>
            <p className="text-[10px] mt-0.5">Production v1.0.0</p>
          </div>
        ) : (
          <span>v1</span>
        )}
      </div>
    </aside>
  );
};
