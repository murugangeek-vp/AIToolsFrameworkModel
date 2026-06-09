import React from 'react';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: string;
  description?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  description,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-xl p-6 relative overflow-hidden flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">{title}</p>
          <h3 className="text-3xl font-bold mt-2 tracking-tight text-white">{value}</h3>
        </div>
        {icon && (
          <span className="text-2xl p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
            {icon}
          </span>
        )}
      </div>
      {(change || description) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {change && (
            <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {change}
            </span>
          )}
          {description && <span className="text-slate-400">{description}</span>}
        </div>
      )}
    </motion.div>
  );
};
