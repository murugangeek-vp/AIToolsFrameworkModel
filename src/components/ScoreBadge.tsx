import React from 'react';

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, label, size = 'md' }) => {
  let colorClass = 'score-poor score-bg-poor';
  if (score >= 90) {
    colorClass = 'score-excellent score-bg-excellent';
  } else if (score >= 75) {
    colorClass = 'score-good score-bg-good';
  } else if (score >= 50) {
    colorClass = 'score-fair score-bg-fair';
  }

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 rounded',
    md: 'text-sm px-2.5 py-1 rounded-md font-semibold',
    lg: 'text-base px-3.5 py-1.5 rounded-lg font-bold',
  };

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClasses[size]} ${colorClass}`}>
      <span>{score}</span>
      {label && <span className="opacity-70 text-[10px] uppercase tracking-wider ml-1">{label}</span>}
    </span>
  );
};
