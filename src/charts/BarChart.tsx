import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { AITool } from '@types-app/AITool';

interface BarChartProps {
  data: AITool[];
  metric: 'overall_rating' | 'enterprise_readiness_score' | 'latency_score' | 'cost_efficiency_score';
  title?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, metric, title }) => {
  const chartData = data.slice(0, 10).map((t) => ({
    name: t.name,
    score: (t as any)[metric] || 0,
  }));

  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308'];

  return (
    <div className="w-full h-80 bg-slate-900/40 rounded-xl p-4 border border-slate-800/60">
      {title && <h5 className="text-sm font-bold text-slate-350 mb-3 uppercase tracking-wider">{title}</h5>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={80} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
          />
          <Bar dataKey="score" fill="#6366f1" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
