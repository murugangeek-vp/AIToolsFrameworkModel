import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useComparisonStore } from '@store/useComparisonStore';

export const TopBar: React.FC = () => {
  const { selectedTools } = useComparisonStore();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Explorer' },
    { path: '/dashboards', label: 'Dashboards' },
    { path: '/recommend', label: 'Recommendation Wizard' },
  ];

  return (
    <header className="glass border-b border-slate-800/80 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
              location.pathname === item.path
                ? 'bg-slate-800/80 text-white border border-slate-700/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        {selectedTools.length > 0 && (
          <Link
            to="/compare"
            className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
          >
            <span>⚖️ Compare</span>
            <span className="bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
              {selectedTools.length}
            </span>
          </Link>
        )}
        <div className="text-xs text-slate-500 hidden sm:block">
          Enterprise Cloud Instance
        </div>
      </div>
    </header>
  );
};
