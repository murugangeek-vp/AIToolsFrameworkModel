import React from 'react';
import type { AITool } from '@types-app/AITool';
import { KPICard } from '@components/KPICard';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  AreaChart,
  Area,
} from 'recharts';
import { ScoreBadge } from '@components/ScoreBadge';

interface DashboardProps {
  tools: AITool[];
}

// ─── 1. ENTERPRISE ADOPTION DASHBOARD ───────────────────────────────────────
export const EnterpriseAdoptionDashboard: React.FC<DashboardProps> = ({ tools }) => {
  const avgAdoption = Math.round(tools.reduce((acc, t) => acc + t.enterprise_adoption_score, 0) / (tools.length || 1));
  const highlyAdopted = tools.filter((t) => t.enterprise_adoption_score >= 85).length;
  
  // Aggregate adoption by category
  const catMap: Record<string, { name: string; sum: number; count: number }> = {};
  tools.forEach((t) => {
    if (!catMap[t.category]) catMap[t.category] = { name: t.category, sum: 0, count: 0 };
    catMap[t.category].sum += t.enterprise_adoption_score;
    catMap[t.category].count += 1;
  });
  const data = Object.values(catMap).map((c) => ({
    category: c.name.slice(0, 15),
    Adoption: Math.round(c.sum / c.count),
  })).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <KPICard title="Mean Enterprise Adoption" value={`${avgAdoption}/100`} icon="🏢" description="Global benchmark rating" />
        <KPICard title="Top Penetrated Systems" value={highlyAdopted} icon="📈" description="Adoption score >= 85" />
      </div>

      <div className="glass rounded-xl p-5 border border-[var(--border-color)]">
        <h4 className="text-xs font-black uppercase tracking-wider t-label mb-4">Adoption Velocity by Domain</h4>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--surface-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }} />
              <Bar dataKey="Adoption" fill="var(--accent-indigo)" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ─── 2. GOVERNANCE & RISK DASHBOARD ──────────────────────────────────────────
export const GovernanceDashboard: React.FC<DashboardProps> = ({ tools }) => {
  const avgGov = Math.round(tools.reduce((acc, t) => acc + t.governance_score, 0) / (tools.length || 1));
  const avgTrust = Math.round(tools.reduce((acc, t) => acc + t.ai_trust_score, 0) / (tools.length || 1));
  const soc2Rate = Math.round((tools.filter((t) => t.compliance?.includes('SOC2')).length / (tools.length || 1)) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard title="Mean Governance Score" value={`${avgGov}/100`} icon="⚖️" description="Audit compliance level" />
        <KPICard title="Mean AI Trust Score" value={`${avgTrust}/100`} icon="🛡️" description="Alignment and guardrails index" />
        <KPICard title="SOC2 Coverage Rate" value={`${soc2Rate}%`} icon="📋" description="Proportion of verified systems" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Table */}
        <div className="glass rounded-xl p-5 border border-[var(--border-color)]">
          <h4 className="text-xs font-black uppercase tracking-wider t-label mb-3">Enterprise Regulatory Audits</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] pb-2 text-slate-400">
                  <th className="pb-2">Framework Component</th>
                  <th className="pb-2 text-center">Trust Index</th>
                  <th className="pb-2 text-center">Governance</th>
                  <th className="pb-2">Compliance Tags</th>
                </tr>
              </thead>
              <tbody>
                {tools.slice(0, 5).map((t) => (
                  <tr key={t.id} className="border-b border-[var(--border-subtle)]">
                    <td className="py-2.5 font-semibold t-text">{t.name}</td>
                    <td className="py-2.5 text-center"><ScoreBadge score={t.ai_trust_score} size="sm" /></td>
                    <td className="py-2.5 text-center"><ScoreBadge score={t.governance_score} size="sm" /></td>
                    <td className="py-2.5 t-text-secondary truncate max-w-[120px]">{t.compliance || 'None declared'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Governance note */}
        <div className="glass rounded-xl p-5 border border-[var(--border-color)] flex flex-col justify-center space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider t-label">V2 Policy Framework Guidance</h4>
          <p className="text-xs t-text-secondary leading-relaxed">
            Ensure components integrated with sensitive data flows have an **AI Trust Score** greater than **80**. In multi-agent loops, select tools reporting active **lineage tracking** to comply with the European AI Act guidelines.
          </p>
          <div className="flex gap-2">
            <span className="badge badge-success">Trust Guard enabled</span>
            <span className="badge badge-brand">EU AI Act Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 3. OPEN SOURCE VS COMMERCIAL DASHBOARD ─────────────────────────────────
export const OSVsCommercialDashboard: React.FC<DashboardProps> = ({ tools }) => {
  const osCount = tools.filter((t) => t.open_source).length;
  const paidCount = tools.length - osCount;
  const osAvgCost = Math.round(tools.filter(t => t.open_source).reduce((acc, t) => acc + t.cost_efficiency_score, 0) / (osCount || 1));
  const paidAvgCost = Math.round(tools.filter(t => !t.open_source).reduce((acc, t) => acc + t.cost_efficiency_score, 0) / (paidCount || 1));

  const data = [
    { name: 'Open Weights / OS', Count: osCount, 'Avg Cost Efficiency': osAvgCost },
    { name: 'Commercial SaaS', Count: paidCount, 'Avg Cost Efficiency': paidAvgCost },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard title="Open Weights Systems" value={osCount} icon="📖" description="No-licensing utility" />
        <KPICard title="Commercial / Paid APIs" value={paidCount} icon="💳" description="SLA-backed systems" />
        <KPICard title="OS Cost Savings Index" value={`${osAvgCost - paidAvgCost} pts`} icon="💰" description="Relative cost efficiency edge" />
      </div>

      <div className="glass rounded-xl p-5 border border-[var(--border-color)]">
        <h4 className="text-xs font-black uppercase tracking-wider t-label mb-4">Cost-Efficiency comparison</h4>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--surface-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }} />
              <Legend />
              <Bar dataKey="Count" fill="var(--accent-indigo)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Avg Cost Efficiency" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ─── 4. VENDOR LANDSCAPE DASHBOARD ───────────────────────────────────────────
export const VendorLandscapeDashboard: React.FC<DashboardProps> = ({ tools }) => {
  const uniqueVendors = new Set(tools.map((t) => t.vendor)).size;
  const topVendor = tools.reduce((acc, t) => {
    acc[t.vendor] = (acc[t.vendor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const leaderVendor = Object.entries(topVendor).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Vendor coordinates for scatter plot: Ecosystem Maturity vs Overall Rating
  const scatterData = tools.slice(0, 15).map((t) => ({
    name: t.name,
    Ecosystem: t.ecosystem_maturity_score,
    Rating: t.overall_rating,
    stars: t.github_stars || 100,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <KPICard title="Total Unique Vendors" value={uniqueVendors} icon="🤝" description="Provider diversification index" />
        <KPICard title="Dominant Stack Partner" value={leaderVendor} icon="🏢" description="Highest component frequency" />
      </div>

      <div className="glass rounded-xl p-5 border border-[var(--border-color)]">
        <h4 className="text-xs font-black uppercase tracking-wider t-label mb-4">Ecosystem Maturity vs Technical Rating</h4>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid stroke="var(--border-subtle)" />
              <XAxis type="number" dataKey="Ecosystem" name="Ecosystem Maturity" unit=" pts" label={{ value: 'Ecosystem Maturity', position: 'insideBottom', offset: -10, fill: 'var(--text-muted)', fontSize: 10 }} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
              <YAxis type="number" dataKey="Rating" name="Overall Rating" unit=" pts" label={{ value: 'Overall Rating', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 10 }} tick={{ fill: 'var(--text-muted)', fontSize: 9 }} />
              <ZAxis type="number" dataKey="stars" range={[60, 400]} name="Popularity Indicator" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'var(--surface-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }} />
              <Scatter name="AI Systems" data={scatterData} fill="var(--accent-indigo)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ─── 5. AI ECOSYSTEM GROWTH DASHBOARD ────────────────────────────────────────
export const EcosystemGrowthDashboard: React.FC<DashboardProps> = ({ tools }) => {
  const totalStars = tools.reduce((acc, t) => acc + (t.github_stars || 0), 0);
  const formattedStars = totalStars > 1000000 ? `${(totalStars / 1000000).toFixed(1)}M` : totalStars > 1000 ? `${(totalStars / 1000).toFixed(0)}K` : totalStars;
  
  // Group stars by release year
  const yearStarsMap: Record<number, number> = {};
  tools.forEach((t) => {
    const y = t.release_year || 2022;
    yearStarsMap[y] = (yearStarsMap[y] || 0) + (t.github_stars || 0);
  });
  const growthData = Object.entries(yearStarsMap).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(([year, stars]) => ({
    Year: year,
    'Cumulative Stars Added': stars,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <KPICard title="Aggregated Community Stars" value={formattedStars} icon="⭐" description="GitHub star repository backing" />
        <KPICard title="Mean Maintenance Index" value={`${Math.round(tools.reduce((acc, t) => acc + t.maintenance_score, 0) / (tools.length || 1))}/100`} icon="🛠️" description="Repo health & commit index" />
      </div>

      <div className="glass rounded-xl p-5 border border-[var(--border-color)]">
        <h4 className="text-xs font-black uppercase tracking-wider t-label mb-4">Open Source Engagement Curve</h4>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="Year" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--surface-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }} />
              <Area type="monotone" dataKey="Cumulative Stars Added" stroke="var(--accent-indigo)" fill="var(--selected-bg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
