import React, { useEffect } from 'react';
import { useToolStore } from '@store/useToolStore';
import { useUIStore } from '@store/useUIStore';
import { LoadingSkeleton } from '@components/LoadingSkeleton';
import {
  TrendsDashboard,
  EnterpriseReadinessDashboard,
  CostOptimizationDashboard,
  LatencyDashboard,
  SecurityDashboard,
  EcosystemDashboard,
} from '@dashboards/Dashboards';

export const DashboardPage: React.FC = () => {
  const { tools, loading, loadAll } = useToolStore();
  const { activeDashboard, setActiveDashboard } = useUIStore();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const dashTabs = [
    { id: 'trends', label: 'AI Trends', component: TrendsDashboard },
    { id: 'enterprise', label: 'Enterprise Readiness', component: EnterpriseReadinessDashboard },
    { id: 'cost', label: 'Cost Optimization', component: CostOptimizationDashboard },
    { id: 'latency', label: 'Latency', component: LatencyDashboard },
    { id: 'security', label: 'AI Security', component: SecurityDashboard },
    { id: 'ecosystem', label: 'Ecosystem Maturity', component: EcosystemDashboard },
  ];

  const currentTab = dashTabs.find((t) => t.id === activeDashboard) || dashTabs[0];
  const ComponentToRender = currentTab.component;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Executive Dashboards</h2>
        <p className="text-slate-400 text-sm mt-0.5">High-level analytics and benchmark aggregations across the stack.</p>
      </div>

      {/* Dashboard Sub-nav tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
        {dashTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveDashboard(tab.id as any)}
            className={`text-xs px-4 py-2.5 rounded-lg border transition-all cursor-pointer font-bold uppercase tracking-wider ${
              activeDashboard === tab.id
                ? 'bg-indigo-600 border-indigo-650 text-white shadow-glow'
                : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Dashboard Render */}
      <div className="pt-2">
        {loading ? (
          <LoadingSkeleton type="detail" />
        ) : (
          <ComponentToRender tools={tools} />
        )}
      </div>
    </div>
  );
};
