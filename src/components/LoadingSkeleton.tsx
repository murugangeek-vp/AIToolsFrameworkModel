import React from 'react';

interface LoadingSkeletonProps {
  type: 'card' | 'table' | 'detail';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, count = 3 }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-6 h-64 flex flex-col justify-between animate-pulse">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-lg bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-850 rounded w-2/3" />
                <div className="h-3 bg-slate-850 rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-2 my-4">
              <div className="h-3 bg-slate-850 rounded w-full" />
              <div className="h-3 bg-slate-850 rounded w-5/6" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <div className="h-4 bg-slate-850 rounded w-1/4" />
              <div className="h-6 bg-slate-850 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="glass rounded-xl overflow-hidden w-full animate-pulse">
        <div className="h-12 bg-slate-800 border-b border-slate-700/60 flex items-center px-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-slate-850 rounded flex-1" />
          ))}
        </div>
        <div className="divide-y divide-slate-800/50">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 flex items-center px-6 gap-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="h-3 bg-slate-850 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="h-32 bg-slate-800 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-96 bg-slate-800 rounded-xl md:col-span-2" />
        <div className="h-96 bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
};
