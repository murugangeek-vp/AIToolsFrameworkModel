import React from 'react';
import { motion } from 'framer-motion';
import type { AITool } from '@types-app/AITool';
import { ScoreBadge } from './ScoreBadge';
import { useComparisonStore } from '@store/useComparisonStore';
import { useBookmarkStore } from '@store/useBookmarkStore';
import { useUIStore } from '@store/useUIStore';

interface ToolCardProps {
  tool: AITool;
  onSelect: (tool: AITool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const { addTool, removeTool, isSelected } = useComparisonStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const { pinnedToolId } = useUIStore();

  const selected = isSelected(tool.id);
  const bookmarked = isBookmarked(tool.id);
  const isPinned = pinnedToolId === tool.id;

  const toggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected) removeTool(tool.id);
    else addTool(tool);
  };

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked) removeBookmark(tool.id);
    else addBookmark(tool);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect(tool)}
      className={`glass rounded-xl p-5 flex flex-col justify-between h-[280px] cursor-pointer border-animated transition-all ${
        isPinned ? 'glow-brand' : ''
      }`}
      style={{
        borderColor: isPinned ? 'var(--accent-indigo)' : 'var(--glass-border)',
        borderWidth: isPinned ? '2px' : '1px',
      }}
    >
      <div>
        <div className="flex justify-between items-start gap-2">
          <div className="flex gap-3 items-center">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.25)',
                color: 'var(--selected-text)',
              }}
            >
              {tool.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold tracking-tight line-clamp-1 t-text flex items-center gap-1.5">
                {isPinned && <span className="text-sm">📌</span>}
                {tool.name}
              </h4>
              <span
                className="text-xs font-medium tracking-wide uppercase"
                style={{ color: 'var(--accent-indigo)' }}
              >
                {tool.subcategory}
              </span>
            </div>
          </div>
          <button
            onClick={toggleBookmark}
            className="text-lg p-1 transition-colors cursor-pointer"
            style={{ color: bookmarked ? '#f59e0b' : 'var(--text-muted)' }}
          >
            ★
          </button>
        </div>

        <p className="text-sm mt-4 line-clamp-3 leading-relaxed t-text-secondary">
          {tool.description}
        </p>
      </div>

      <div
        className="mt-4 pt-3 flex justify-between items-center"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="flex gap-2">
          <ScoreBadge score={tool.overall_rating} label="Rating" size="sm" />
          <ScoreBadge score={tool.enterprise_readiness_score} label="Readiness" size="sm" />
        </div>
        <button
          onClick={toggleCompare}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            selected ? '' : 't-unselected'
          }`}
          style={
            selected
              ? {
                  background: 'var(--accent-indigo)',
                  border: '1px solid var(--accent-indigo)',
                  color: '#fff',
                }
              : {}
          }
        >
          {selected ? 'Added to Compare' : '+ Compare'}
        </button>
      </div>
    </motion.div>
  );
};
