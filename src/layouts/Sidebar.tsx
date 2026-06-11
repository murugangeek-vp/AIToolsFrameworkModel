import React, { useState } from 'react';
import { useUIStore } from '@store/useUIStore';
import { CATEGORY_REGISTRY } from '@types-app/index';

interface GroupedCategory {
  title: string;
  icon: string;
  categoryIds: string[];
}

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, activeCategoryId, setActiveCategoryId, toggleSidebar } = useUIStore();
  
  // Track open state for headers when collapsed is false
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Core Models & RAG': true,
    'Data Science & ML': true,
    'Data Analytics': true,
    'AI Platform & Infra': true,
    'MLOps & SDLC': true,
    'Governance & Safety': true,
  });

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupTitle]: !prev[groupTitle] }));
  };

  const groups: GroupedCategory[] = [
    {
      title: 'Core Models & RAG',
      icon: '🧠',
      categoryIds: ['llm-models', 'embedding-models', 'multimodal-models', 'agent-frameworks', 'rag-frameworks', 'vector-databases'],
    },
    {
      title: 'Data Science & ML',
      icon: '📐',
      categoryIds: [
        'data-science-tools',
        'experiment-tracking',
        'visualization-libraries',
        'ml-frameworks',
        'ml-algorithms',
        'recommendation-systems',
        'time-series-tools',
        'feature-stores',
        'feature-engineering',
      ],
    },
    {
      title: 'Data Analytics',
      icon: '📈',
      categoryIds: ['bi-tools', 'dashboard-platforms', 'sql-engines', 'data-pipelines', 'workflow-orchestration'],
    },
    {
      title: 'AI Platform & Infra',
      icon: '☁️',
      categoryIds: ['cloud-ai-platforms', 'inference-engines', 'gpu-platforms', 'distributed-ai', 'deployment-tools', 'streaming-platforms', 'ai-apis'],
    },
    {
      title: 'MLOps & SDLC',
      icon: '🔄',
      categoryIds: ['llmops', 'agentops', 'observability', 'ai-ide-tools', 'ai-sdlc-tools', 'model-registry'],
    },
    {
      title: 'Governance & Safety',
      icon: '🛡️',
      categoryIds: ['ai-security', 'ai-governance', 'ai-evaluation-tools', 'ai-safety-tools', 'lineage-tools', 'compliance-tools'],
    },
  ];

  return (
    <aside
      className={`t-sidebar min-h-screen flex flex-col justify-between transition-all duration-300 z-40 fixed md:static ${
        sidebarCollapsed ? 'w-18' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2.5 animate-[fade-in-up_0.15s_ease-out]">
            <span className="text-xl">🧬</span>
            <div>
              <h1 className="font-black t-text text-base tracking-tight leading-none">AI STACK V2</h1>
              <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5 block" style={{ color: 'var(--accent-indigo)' }}>
                Enterprise Intelligence
              </span>
            </div>
          </div>
        ) : (
          <span className="text-xl mx-auto cursor-pointer" onClick={toggleSidebar}>🧬</span>
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

      {/* Grouped Categories List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {/* All Categories Option */}
        <div>
          <button
            onClick={() => setActiveCategoryId(null)}
            className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs transition-all cursor-pointer font-bold uppercase tracking-wider ${
              activeCategoryId === null ? 't-nav-item-active' : 't-nav-item'
            }`}
          >
            <span className="text-base">🌐</span>
            {!sidebarCollapsed && <span>All Platforms</span>}
          </button>
        </div>

        {/* Dynamic Accordion Groups */}
        {groups.map((group) => {
          const isOpen = openGroups[group.title];
          const hasActiveChild = group.categoryIds.includes(activeCategoryId || '');

          return (
            <div key={group.title} className="space-y-1">
              {/* Group Header Button */}
              {!sidebarCollapsed ? (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-black uppercase tracking-wider t-label hover:t-text transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <span>{group.icon}</span>
                    <span>{group.title}</span>
                  </span>
                  <span className="text-[8px] transition-transform duration-200" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                    ▶
                  </span>
                </button>
              ) : (
                <div
                  className={`text-center py-1.5 text-base rounded-md ${
                    hasActiveChild ? 'bg-[var(--selected-bg)] text-[var(--accent-indigo)]' : 't-text-muted'
                  }`}
                  title={group.title}
                >
                  {group.icon}
                </div>
              )}

              {/* Group Child Items */}
              {(!sidebarCollapsed ? isOpen : true) && (
                <div className="space-y-0.5 pl-1.5 md:pl-2.5 transition-all">
                  {group.categoryIds.map((id) => {
                    const cat = CATEGORY_REGISTRY.find((c) => c.id === id);
                    if (!cat) return null;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategoryId(cat.id)}
                        className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer font-medium ${
                          activeCategoryId === cat.id ? 't-nav-item-active' : 't-nav-item'
                        }`}
                        title={cat.description}
                      >
                        <span className="text-sm shrink-0">{cat.icon}</span>
                        {!sidebarCollapsed && (
                          <div className="flex justify-between items-center w-full truncate">
                            <span className="truncate">{cat.label}</span>
                            {cat.trending && (
                              <span
                                className="text-[7px] font-black px-1 py-0.2 rounded uppercase tracking-wider text-white"
                                style={{ background: 'var(--accent-indigo)' }}
                              >
                                Hot
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Meta */}
      <div
        className="p-4 text-center text-xs t-text-muted"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        {!sidebarCollapsed ? (
          <div>
            <p className="font-semibold">AI Stack Explorer</p>
            <p className="text-[10px] mt-0.5">Enterprise Edition v2.0</p>
          </div>
        ) : (
          <span>v2</span>
        )}
      </div>
    </aside>
  );
};
