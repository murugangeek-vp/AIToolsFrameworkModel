import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useComparisonStore } from '@store/useComparisonStore';
import { useUIStore } from '@store/useUIStore';
import { GlobalSearch } from '@components/GlobalSearch';

export const TopBar: React.FC = () => {
  const { selectedTools } = useComparisonStore();
  const { theme, setTheme } = useUIStore();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Explorer' },
    { path: '/dashboards', label: 'Dashboards' },
    { path: '/recommend', label: 'Recommendation Wizard' },
  ];

  return (
    <header className="t-header backdrop-blur-md h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 shrink-0">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-sm px-4 py-2 rounded-lg font-medium transition-all ${
              location.pathname === item.path
                ? 't-nav-item-active'
                : 't-nav-item'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Global Search Component */}
      <GlobalSearch />

      {/* Global Actions */}
      <div className="flex items-center gap-4 shrink-0">
        {selectedTools.length > 0 && (
          <Link
            to="/compare"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.35)',
              color: 'var(--selected-text)',
            }}
          >
            <span>⚖️ Compare</span>
            <span
              className="rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold"
              style={{ background: 'var(--accent-indigo)', color: '#fff' }}
            >
              {selectedTools.length}
            </span>
          </Link>
        )}

        {/* Theme Switcher */}
        <div className="t-theme-switcher flex">
          {[
            { id: 'dark', label: '🌑 Onyx', title: 'Dark Onyx Theme' },
            { id: 'light', label: '☀️ Paper', title: 'Light Paper Theme' },
            { id: 'classic', label: '💻 Dev', title: 'Classic Dev Theme' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as 'dark' | 'light' | 'classic')}
              title={t.title}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                theme === t.id
                  ? 'bg-[var(--accent-indigo)] text-white'
                  : 't-theme-btn-inactive'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="text-xs t-text-muted hidden lg:block">
          Enterprise Cloud Instance
        </div>
      </div>
    </header>
  );
};

