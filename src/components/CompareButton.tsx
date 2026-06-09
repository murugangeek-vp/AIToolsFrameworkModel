import React from 'react';
import { useComparisonStore } from '@store/useComparisonStore';

export const CompareButton: React.FC = () => {
  const { selectedTools, clearAll, setComparing } = useComparisonStore();

  if (selectedTools.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 glass rounded-xl p-4 shadow-glow flex items-center gap-4 animate-float">
      <div className="text-sm">
        <span className="font-bold text-indigo-400">{selectedTools.length}</span> tools selected
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            setComparing(true);
            // Navigate to comparison tab or view
            window.location.hash = '#/compare';
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Compare Side-by-Side
        </button>
        <button
          onClick={clearAll}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
