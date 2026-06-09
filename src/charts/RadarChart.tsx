import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { AITool } from '@types-app/AITool';

interface RadarChartProps {
  tools: AITool[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ tools }) => {
  if (tools.length === 0) return null;

  // Prepare radar metrics
  const metrics = [
    { key: 'overall_rating', name: 'Overall Rating' },
    { key: 'enterprise_readiness_score', name: 'Enterprise Readiness' },
    { key: 'latency_score', name: 'Latency Score' },
    { key: 'cost_efficiency_score', name: 'Cost Efficiency' },
    { key: 'security_score', name: 'Security Score' },
    { key: 'scalability_score', name: 'Scalability Score' },
  ];

  const data = metrics.map((m) => {
    const point: any = { subject: m.name };
    tools.forEach((t) => {
      point[t.name] = (t as any)[m.key] || 0;
    });
    return point;
  });

  const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

  return (
    <div className="w-full h-80 bg-slate-900/40 rounded-xl p-4 border border-slate-800/60">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} />
          {tools.map((t, idx) => (
            <Radar
              key={t.id}
              name={t.name}
              dataKey={t.name}
              stroke={colors[idx % colors.length]}
              fill={colors[idx % colors.length]}
              fillOpacity={0.25}
            />
          ))}
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};
