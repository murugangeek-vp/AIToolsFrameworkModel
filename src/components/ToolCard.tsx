import React from 'react';
import { motion } from 'framer-motion';
import type { AITool } from '@types-app/AITool';
import { ScoreBadge } from './ScoreBadge';
import { useComparisonStore } from '@store/useComparisonStore';
import { useBookmarkStore } from '@store/useBookmarkStore';

interface ToolCardProps {
  tool: AITool;
  onSelect: (tool: AITool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const { addTool, removeTool, isSelected } = useComparisonStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();

  const selected = isSelected(tool.id);
  const bookmarked = isBookmarked(tool.id);

  const toggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected) {
      removeTool(tool.id);
    } else {
      addTool(tool);
    }
  };

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(tool.id);
    } else {
      addBookmark(tool);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect(tool)}
      className="glass rounded-xl p-5 flex flex-col justify-between h-[280px] cursor-pointer hover:border-indigo-500/30 transition-all border-animated"
    >
      <div>
        <div className="flex justify-between items-start gap-2">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center font-bold text-lg text-indigo-400">
              {tool.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-white tracking-tight line-clamp-1">{tool.name}</h4>
              <span className="text-xs text-indigo-300 font-medium tracking-wide uppercase">{tool.subcategory}</span>
            </div>
          </div>
          <button
            onClick={toggleBookmark}
            className={`text-lg p-1 hover:text-amber-400 transition-colors cursor-pointer ${
              bookmarked ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            ★
          </button>
        </div>

        <p className="text-sm text-slate-300 mt-4 line-clamp-3 leading-relaxed">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center">
        <div className="flex gap-2">
          <ScoreBadge score={tool.overall_rating} label="Rating" size="sm" />
          <ScoreBadge score={tool.enterprise_readiness_score} label="Readiness" size="sm" />
        </div>
        <button
          onClick={toggleCompare}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            selected
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-slate-700 hover:border-indigo-500 text-slate-350 hover:text-indigo-400'
          }`}
        >
          {selected ? 'Added to Compare' : '+ Compare'}
        </button>
      </div>
    </motion.div>
  );
};
