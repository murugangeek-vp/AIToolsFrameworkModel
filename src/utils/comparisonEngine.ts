/**
 * comparisonEngine — Domain Layer
 * Single Responsibility: Normalize and transform tool scores for comparison views
 */
import type { AITool } from '@types-app/AITool';
import type { RadarDataPoint, HeatmapCell, ComparisonMetric } from '@types-app/ComparisonState';
import { RADAR_METRICS, COMPARISON_METRICS } from '@types-app/ComparisonState';

class ComparisonEngine {
  /**
   * Generate radar chart data from selected tools
   */
  buildRadarData(tools: AITool[]): RadarDataPoint[] {
    return RADAR_METRICS.map((metric) => {
      const point: RadarDataPoint = { metric: metric.label, fullMark: 100 };
      tools.forEach((tool) => {
        point[tool.name] = Math.round(tool[metric.key] as number);
      });
      return point;
    });
  }

  /**
   * Generate heatmap cells from all comparison metrics
   */
  buildHeatmapData(tools: AITool[]): HeatmapCell[] {
    const cells: HeatmapCell[] = [];
    COMPARISON_METRICS.forEach((metric) => {
      const values = tools.map((t) => t[metric.key] as number);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min || 1;

      tools.forEach((tool) => {
        const value = tool[metric.key] as number;
        cells.push({
          toolId: tool.id,
          toolName: tool.name,
          metric: metric.label,
          value: Math.round(value),
          normalized: (value - min) / range,
        });
      });
    });
    return cells;
  }

  /**
   * Calculate composite score for ranking
   */
  compositeScore(tool: AITool): number {
    const weights: Record<keyof Pick<AITool,
      'enterprise_readiness_score' | 'performance_score' | 'scalability_score' |
      'security_score' | 'governance_score' | 'observability_score' |
      'cost_efficiency_score' | 'ecosystem_maturity_score' | 'community_score'
    >, number> = {
      enterprise_readiness_score: 0.18,
      performance_score: 0.15,
      scalability_score: 0.13,
      security_score: 0.13,
      governance_score: 0.10,
      observability_score: 0.09,
      cost_efficiency_score: 0.08,
      ecosystem_maturity_score: 0.08,
      community_score: 0.06,
    };

    return Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + (tool[key as keyof AITool] as number) * weight;
    }, 0);
  }

  /**
   * Rank tools by composite score
   */
  rankTools(tools: AITool[]): AITool[] {
    return [...tools].sort((a, b) => this.compositeScore(b) - this.compositeScore(a));
  }

  /**
   * Build bar chart data for a single metric across tools
   */
  buildBarData(tools: AITool[], metric: ComparisonMetric): Array<{ name: string; value: number; fill: string }> {
    const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#22c55e'];
    return tools.map((tool, idx) => ({
      name: tool.name,
      value: Math.round(tool[metric.key] as number),
      fill: COLORS[idx % COLORS.length],
    }));
  }

  /**
   * Winner analysis: best tool per metric
   */
  getWinners(tools: AITool[]): Record<string, string> {
    const winners: Record<string, string> = {};
    COMPARISON_METRICS.forEach((metric) => {
      const best = tools.reduce((a, b) => {
        const aVal = a[metric.key] as number;
        const bVal = b[metric.key] as number;
        return metric.higherIsBetter ? (aVal > bVal ? a : b) : (aVal < bVal ? a : b);
      });
      winners[metric.label] = best.name;
    });
    return winners;
  }
}

export const comparisonEngine = new ComparisonEngine();
