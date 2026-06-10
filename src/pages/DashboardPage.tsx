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

  useEffect(() => { loadAll(); }, [loadAll]);

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
        <h2 className="text-2xl font-black t-text tracking-tight">Executive Dashboards</h2>
        <p className="t-text-secondary text-sm mt-0.5">High-level analytics and benchmark aggregations across the stack.</p>
      </div>

      {/* Dashboard Sub-nav tabs */}
      <div className="flex flex-wrap gap-2 pb-3" style={{ borderBottom: '1px solid var(--divider)' }}>
        {dashTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveDashboard(tab.id as any)}
            className={`text-xs px-4 py-2.5 rounded-lg transition-all cursor-pointer font-bold uppercase tracking-wider ${
              activeDashboard === tab.id ? 'shadow-glow' : 't-unselected'
            }`}
            style={
              activeDashboard === tab.id
                ? {
                    background: 'var(--accent-indigo)',
                    border: '1px solid var(--accent-indigo)',
                    color: '#fff',
                  }
                : {}
            }
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
