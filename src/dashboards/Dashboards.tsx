import React from 'react';
import type { AITool } from '@types-app/AITool';
import { BarChart } from '@charts/BarChart';
import { HeatmapChart } from '@charts/HeatmapChart';
import { TrendChart } from '@charts/TrendChart';
import { KPICard } from '@components/KPICard';

interface DashboardProps {
  tools: AITool[];
}

export const TrendsDashboard: React.FC<DashboardProps> = ({ tools }) => {
  const avgRating = Math.round(tools.reduce((acc, t) => acc + t.overall_rating, 0) / (tools.length || 1));
  const openSourceCount = tools.filter((t) => t.open_source).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard title="Total Analyzed Tools" value={tools.length} icon="🛠️" />
        <KPICard title="Average Overall Rating" value={`${avgRating}/100`} icon="⭐" />
        <KPICard title="Open Source Options" value={openSourceCount} icon="📖" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={tools} title="Rating vs Enterprise Adoption over time" />
        <BarChart data={tools} metric="overall_rating" title="Top Rated Tools Benchmarks" />
      </div>
    </div>
  );
};

export const EnterpriseReadinessDashboard: React.FC<DashboardProps> = ({ tools }) => {
  const readyTools = tools.filter((t) => t.enterprise_readiness_score >= 85);
  const avgReadiness = Math.round(tools.reduce((acc, t) => acc + t.enterprise_readiness_score, 0) / (tools.length || 1));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard title="Highly Enterprise Ready" value={readyTools.length} icon="🏢" description="Score >= 85" />
        <KPICard title="Average Readiness Score" value={`${avgReadiness}/100`} icon="🛡️" />
        <KPICard title="SLA Support Available" value={tools.filter(t => t.sla_support).length} icon="🤝" />
      </div>
      <div className="glass rounded-xl p-5 border border-slate-800">
        <h4 className="text-base font-bold text-white mb-4">Readiness Matrix Heatmap</h4>
        <HeatmapChart tools={tools.slice(0, 8)} />
      </div>
    </div>
  );
};

export const CostOptimizationDashboard: React.FC<DashboardProps> = ({ tools }) => {
  const avgCostEff = Math.round(tools.reduce((acc, t) => acc + t.cost_efficiency_score, 0) / (tools.length || 1));
  const freeTools = tools.filter((t) => t.pricing_model?.toLowerCase().includes('free') || t.open_source).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard title="Average Cost Efficiency" value={`${avgCostEff}/100`} icon="💰" />
        <KPICard title="No-Licensing Cost Tools" value={freeTools} icon="🆓" />
        <KPICard title="Proprietary Pay-per-use" value={tools.filter(t => t.pricing_model === 'Pay-per-use').length} icon="💳" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart data={tools} metric="cost_efficiency_score" title="Cost-Efficiency Leaders" />
        <div className="glass rounded-xl p-5 border border-slate-800 flex flex-col justify-center">
          <h4 className="text-base font-bold text-white mb-2">Cost Optimization Strategy</h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            Prioritize open-weight models like Llama or DeepSeek for bulk off-line batch processing to eliminate token cost scaling. Use frontier cloud-hosted APIs (GPT-4o, Claude) selectively for complex reasoning pipelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export const LatencyDashboard: React.FC<DashboardProps> = ({ tools }) => {
  const fastTools = tools.filter((t) => t.latency_score >= 85);
  const avgLatency = Math.round(tools.reduce((acc, t) => acc + t.latency_score, 0) / (tools.length || 1));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard title="Low Latency Leaders" value={fastTools.length} icon="⚡" description="Score >= 85" />
        <KPICard title="Average Speed Index" value={`${avgLatency}/100`} icon="⏱️" />
        <KPICard title="Streaming Support" value={tools.filter(t => t.streaming_support).length} icon="📡" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart data={tools} metric="latency_score" title="Latency Score Benchmark" />
        <div className="glass rounded-xl p-5 border border-slate-800 flex flex-col justify-center">
          <h5 className="text-sm font-bold text-white mb-2">Latency Optimizations</h5>
          <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
            <li>Enable streaming support to minimize Time-to-First-Token (TTFT).</li>
            <li>Deploy self-hosted options via TensorRT-LLM or vLLM to achieve maximum performance.</li>
            <li>Leverage Edge platforms for sub-10ms response times.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const SecurityDashboard: React.FC<DashboardProps> = ({ tools }) => {
  const secureTools = tools.filter((t) => t.security_score >= 85);
  const soc2Tools = tools.filter((t) => t.compliance?.includes('SOC2')).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard title="High Security Class" value={secureTools.length} icon="🔒" description="Score >= 85" />
        <KPICard title="SOC2 Compliant Tools" value={soc2Tools} icon="📋" />
        <KPICard title="Self Hosting (On-prem)" value={tools.filter(t => t.self_hosting_support).length} icon="🏠" />
      </div>
      <div className="glass rounded-xl p-5 border border-slate-800">
        <h4 className="text-base font-bold text-white mb-4">Security Benchmarking Heatmap</h4>
        <HeatmapChart tools={tools.slice(0, 6)} />
      </div>
    </div>
  );
};

export const EcosystemDashboard: React.FC<DashboardProps> = ({ tools }) => {
  const avgEco = Math.round(tools.reduce((acc, t) => acc + t.ecosystem_maturity_score, 0) / (tools.length || 1));
  const multiCloud = tools.filter((t) => t.supported_clouds?.split(' ').length >= 2).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard title="Ecosystem Maturity" value={`${avgEco}/100`} icon="🌐" />
        <KPICard title="Multi-Cloud Compatible" value={multiCloud} icon="☁️" />
        <KPICard title="Active Community Support" value={tools.filter(t => t.community_score >= 80).length} icon="👥" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={tools} title="Community Score & Adoption Over Time" />
        <div className="glass rounded-xl p-5 border border-slate-800 flex flex-col justify-center">
          <h4 className="text-base font-bold text-white mb-2">Ecosystem Analysis</h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            Frontier architectures rely heavily on integrations with third-party providers. Selecting components with high ecosystem maturity scores ensures extensive documentation, libraries, and direct plugins are available for standard enterprise tech stacks.
          </p>
        </div>
      </div>
    </div>
  );
};
