import type { AITool } from '@types-app/AITool';
import { ScoringWeightKey } from '@store/useScoringStore';

/**
 * Calculates a dynamic overall rating for a tool based on custom weights.
 */
export const calculateWeightedRating = (
  tool: AITool,
  weights: Record<ScoringWeightKey, number>
): number => {
  let weightedSum = 0;
  let totalWeight = 0;

  Object.entries(weights).forEach(([key, weight]) => {
    const val = (tool as any)[key] || 0;
    weightedSum += val * weight;
    totalWeight += weight;
  });

  if (totalWeight === 0) return tool.overall_rating;
  return Math.max(0, Math.min(100, Math.round(weightedSum / totalWeight)));
};
