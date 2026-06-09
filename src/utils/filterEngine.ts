/**
 * filterEngine — Domain Layer
 * Strategy Pattern: Each filter is an independent strategy
 * Open/Closed: New filters added without modifying existing ones
 */
import type { AITool } from '@types-app/AITool';
import type { FilterState } from '@types-app/FilterState';

// ─── Filter Strategy Interface ────────────────────────────────────────────────

interface IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[];
}

// ─── Concrete Strategies ──────────────────────────────────────────────────────

class SearchStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.search.trim()) return tools;
    const q = filters.search.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.vendor.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }
}

class CategoryStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.categories.length) return tools;
    return tools.filter((t) => filters.categories.includes(t.category));
  }
}

class OpenSourceStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.openSourceOnly) return tools;
    return tools.filter((t) => t.open_source);
  }
}

class PaidStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.paidOnly) return tools;
    return tools.filter((t) => !t.open_source);
  }
}

class EnterpriseReadyStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.enterpriseReadyOnly) return tools;
    return tools.filter((t) => t.enterprise_readiness_score >= 70);
  }
}

class LowLatencyStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.lowLatencyOnly) return tools;
    return tools.filter((t) => t.latency_score >= 75);
  }
}

class TopRatedStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.topRatedOnly) return tools;
    return tools.filter((t) => t.overall_rating >= 80);
  }
}

class BudgetFriendlyStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.budgetFriendlyOnly) return tools;
    return tools.filter((t) => t.cost_efficiency_score >= 70 || t.open_source);
  }
}

class HighlyScalableStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.highlyScalableOnly) return tools;
    return tools.filter((t) => t.scalability_score >= 75);
  }
}

class SecureStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.secureOnly) return tools;
    return tools.filter((t) => t.security_score >= 75);
  }
}

class RatingRangeStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    return tools.filter(
      (t) => t.overall_rating >= filters.minRating && t.overall_rating <= filters.maxRating
    );
  }
}

class MinEnterpriseScoreStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.minEnterpriseScore) return tools;
    return tools.filter((t) => t.enterprise_readiness_score >= filters.minEnterpriseScore);
  }
}

class MinLatencyScoreStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.minLatencyScore) return tools;
    return tools.filter((t) => t.latency_score >= filters.minLatencyScore);
  }
}

class MinCostEfficiencyStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (!filters.minCostEfficiency) return tools;
    return tools.filter((t) => t.cost_efficiency_score >= filters.minCostEfficiency);
  }
}

class SortStrategy implements IFilterStrategy {
  apply(tools: AITool[], filters: FilterState): AITool[] {
    if (filters.sortBy === 'default') return tools;
    return [...tools].sort((a, b) => {
      const aVal = a[filters.sortBy as keyof AITool];
      const bVal = b[filters.sortBy as keyof AITool];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return filters.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return filters.sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }
}

// ─── Filter Pipeline (Composite Pattern) ─────────────────────────────────────

class FilterEngine {
  private strategies: IFilterStrategy[] = [
    new SearchStrategy(),
    new CategoryStrategy(),
    new OpenSourceStrategy(),
    new PaidStrategy(),
    new EnterpriseReadyStrategy(),
    new LowLatencyStrategy(),
    new TopRatedStrategy(),
    new BudgetFriendlyStrategy(),
    new HighlyScalableStrategy(),
    new SecureStrategy(),
    new RatingRangeStrategy(),
    new MinEnterpriseScoreStrategy(),
    new MinLatencyScoreStrategy(),
    new MinCostEfficiencyStrategy(),
    new SortStrategy(),
  ];

  apply(tools: AITool[], filters: FilterState): AITool[] {
    return this.strategies.reduce((acc, strategy) => strategy.apply(acc, filters), tools);
  }
}

export const filterEngine = new FilterEngine();

// ─── Convenience function ─────────────────────────────────────────────────────

export function applyFilters(tools: AITool[], filters: FilterState): AITool[] {
  return filterEngine.apply(tools, filters);
}
