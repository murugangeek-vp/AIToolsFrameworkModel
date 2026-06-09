import React from 'react';
import { useUIStore } from '@store/useUIStore';
import { CATEGORY_REGISTRY } from '@types-app/index';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, activeCategoryId, setActiveCategoryId, toggleSidebar } = useUIStore();

  return (
    <aside
      className={`glass border-r border-slate-800/80 min-h-screen flex flex-col justify-between transition-all duration-300 z-40 fixed md:static ${
        sidebarCollapsed ? 'w-18' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🧬</span>
            <div>
              <h1 className="font-black text-white text-base tracking-tight leading-none">AI STACK</h1>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5 block">Explorer 2026</span>
            </div>
          </div>
        ) : (
          <span className="text-xl mx-auto">🧬</span>
        )}
        <button
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50 cursor-pointer hidden md:block"
        >
          {sidebarCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {!sidebarCollapsed ? 'Categories' : 'CAT'}
        </div>
        
        {/* All Categories Option */}
        <button
          onClick={() => setActiveCategoryId(null)}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer font-medium ${
            activeCategoryId === null
              ? 'bg-indigo-600/15 text-indigo-350 border-l-2 border-indigo-550'
              : 'text-slate-350 hover:bg-slate-850/40 hover:text-white'
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
              activeCategoryId === cat.id
                ? 'bg-indigo-600/15 text-indigo-350 border-l-2 border-indigo-550'
                : 'text-slate-350 hover:bg-slate-850/40 hover:text-white'
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            {!sidebarCollapsed && (
              <div className="flex justify-between items-center w-full">
                <span className="truncate">{cat.label}</span>
                {cat.trending && (
                  <span className="bg-indigo-500/20 text-indigo-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                    Hot
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Footer Meta */}
      <div className="p-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
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
