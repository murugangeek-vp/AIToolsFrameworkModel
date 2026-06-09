import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { AITool } from '@types-app/AITool';

interface TrendChartProps {
  data: AITool[];
  title?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, title }) => {
  const chartData = data
    .filter((t) => t.release_year)
    .sort((a, b) => a.release_year - b.release_year)
    .map((t) => ({
      year: t.release_year,
      score: t.overall_rating,
      adoption: t.enterprise_adoption_score,
      name: t.name,
    }));

  return (
    <div className="w-full h-80 bg-slate-900/40 rounded-xl p-4 border border-slate-800/60">
      {title && <h5 className="text-sm font-bold text-slate-350 mb-3 uppercase tracking-wider">{title}</h5>}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            name="Rating"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#colorScore)"
          />
          <Area
            type="monotone"
            dataKey="adoption"
            name="Adoption"
            stroke="#ec4899"
            fillOpacity={1}
            fill="url(#colorAdoption)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
