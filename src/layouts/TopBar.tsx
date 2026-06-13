import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useComparisonStore } from '@store/useComparisonStore';
import { useUIStore } from '@store/useUIStore';
import { GlobalSearch } from '@components/GlobalSearch';
import { DatasetUploadModal } from '@components/DatasetUploadModal';
import { Settings, RefreshCw, Database } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { selectedTools } = useComparisonStore();
  const { theme, setTheme } = useUIStore();
  const location = useLocation();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  const triggerRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('http://localhost:8000/api/refresh', { method: 'POST' });
      
      const poll = setInterval(async () => {
        try {
          const res = await fetch('http://localhost:8000/api/status');
          const data = await res.json();
          if (!data.is_refreshing) {
            clearInterval(poll);
            setIsRefreshing(false);
            if (data.last_refresh_time) {
              setLastRefreshed(new Date(data.last_refresh_time).toLocaleString());
            }
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 2000);
      
    } catch (e) {
      console.error(e);
      setIsRefreshing(false);
    }
  };

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
      <div className="flex items-center gap-3 shrink-0">
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

        {/* Dataset Upload Trigger */}
        <button
          onClick={() => setUploadOpen(true)}
          title="Upload Custom CSV Dataset"
          className="t-btn-secondary text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg cursor-pointer transition-all border hidden lg:block"
          style={{ borderColor: 'var(--border-color)' }}
        >
          📤 Upload
        </button>

        {/* Data Refresh Group */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
          {lastRefreshed && (
            <span className="text-[10px] text-gray-400 hidden lg:block">
              Refreshed: {lastRefreshed}
            </span>
          )}
          <button
            onClick={triggerRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh Data via AI Pipeline"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          <Link
            to="/staging"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            title="Staging Dashboard"
          >
            <Database className="w-4 h-4" />
          </Link>
          <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>

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

      <DatasetUploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </header>
  );
};

