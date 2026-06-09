import type { AITool } from './AITool';

// ─── Filter State ─────────────────────────────────────────────────────────────

export interface FilterState {
  search: string;
  categories: string[];
  openSourceOnly: boolean;
  paidOnly: boolean;
  enterpriseReadyOnly: boolean;
  lowLatencyOnly: boolean;
  topRatedOnly: boolean;
  budgetFriendlyOnly: boolean;
  highlyScalableOnly: boolean;
  secureOnly: boolean;

  // Range filters (0–100)
  minRating: number;
  maxRating: number;
  minEnterpriseScore: number;
  minLatencyScore: number;
  minCostEfficiency: number;

  // Sort
  sortBy: keyof AITool | 'default';
  sortDirection: 'asc' | 'desc';
}

export const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  categories: [],
  openSourceOnly: false,
  paidOnly: false,
  enterpriseReadyOnly: false,
  lowLatencyOnly: false,
  topRatedOnly: false,
  budgetFriendlyOnly: false,
  highlyScalableOnly: false,
  secureOnly: false,
  minRating: 0,
  maxRating: 100,
  minEnterpriseScore: 0,
  minLatencyScore: 0,
  minCostEfficiency: 0,
  sortBy: 'default',
  sortDirection: 'desc',
};

// ─── Filter Preset ────────────────────────────────────────────────────────────

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: Partial<FilterState>;
  createdAt: string;
  isBuiltIn?: boolean;
}

export const BUILT_IN_PRESETS: FilterPreset[] = [
  {
    id: 'enterprise-ready',
    name: 'Enterprise Ready',
    description: 'Top enterprise-grade tools with high governance & security',
    filters: {
      enterpriseReadyOnly: true,
      secureOnly: true,
      minEnterpriseScore: 75,
    },
    createdAt: new Date().toISOString(),
    isBuiltIn: true,
  },
  {
    id: 'open-source-gems',
    name: 'Open Source Gems',
    description: 'Best open-source AI tools by community & performance',
    filters: {
      openSourceOnly: true,
      minRating: 70,
    },
    createdAt: new Date().toISOString(),
    isBuiltIn: true,
  },
  {
    id: 'budget-friendly',
    name: 'Budget Friendly',
    description: 'High cost efficiency for startups and lean teams',
    filters: {
      budgetFriendlyOnly: true,
      minCostEfficiency: 70,
    },
    createdAt: new Date().toISOString(),
    isBuiltIn: true,
  },
  {
    id: 'low-latency',
    name: 'Low Latency',
    description: 'Fastest inference engines and APIs',
    filters: {
      lowLatencyOnly: true,
      minLatencyScore: 75,
    },
    createdAt: new Date().toISOString(),
    isBuiltIn: true,
  },
];
