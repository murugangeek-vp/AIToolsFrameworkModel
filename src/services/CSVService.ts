/**
 * CSVService — Infrastructure Layer
 * Single Responsibility: Parse CSV data using PapaParse
 * Open/Closed: Extendable via generic type parameter
 */
import Papa from 'papaparse';
import type { AITool } from '@types-app/AITool';

export interface CSVParseResult<T> {
  data: T[];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

// ─── CSV Field Parser ─────────────────────────────────────────────────────────

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  return ['true', 'yes', '1'].includes(value.toLowerCase().trim());
}

function parseNumber(value: string | undefined, fallback = 0): number {
  if (!value) return fallback;
  const parsed = parseFloat(value.trim());
  return isNaN(parsed) ? fallback : parsed;
}

function parseInteger(value: string | undefined, fallback = 0): number {
  if (!value) return fallback;
  const parsed = parseInt(value.trim(), 10);
  return isNaN(parsed) ? fallback : parsed;
}

// ─── Raw CSV Row to AITool mapper ─────────────────────────────────────────────

function mapRowToAITool(row: Record<string, string>): AITool {
  return {
    id: row.id?.trim() || crypto.randomUUID(),
    name: row.name?.trim() || 'Unknown',
    category: row.category?.trim() || '',
    subcategory: row.subcategory?.trim() || '',
    vendor: row.vendor?.trim() || '',
    website: row.website?.trim() || '',
    documentation: row.documentation?.trim() || '',
    github_url: row.github_url?.trim() || '',
    logo: row.logo?.trim() || '',
    description: row.description?.trim() || '',
    open_source: parseBoolean(row.open_source),
    license: (row.license?.trim() as AITool['license']) || 'Proprietary',
    pricing_model: (row.pricing_model?.trim() as AITool['pricing_model']) || 'Custom',
    release_year: parseInteger(row.release_year, 2020),
    latest_version: row.latest_version?.trim() || '1.0',
    github_stars: parseInteger(row.github_stars),
    community_score: parseNumber(row.community_score),
    enterprise_adoption_score: parseNumber(row.enterprise_adoption_score),
    enterprise_readiness_score: parseNumber(row.enterprise_readiness_score),
    latency_score: parseNumber(row.latency_score),
    performance_score: parseNumber(row.performance_score),
    scalability_score: parseNumber(row.scalability_score),
    security_score: parseNumber(row.security_score),
    governance_score: parseNumber(row.governance_score),
    observability_score: parseNumber(row.observability_score),
    cost_efficiency_score: parseNumber(row.cost_efficiency_score),
    developer_experience_score: parseNumber(row.developer_experience_score),
    deployment_complexity_score: parseNumber(row.deployment_complexity_score),
    ecosystem_maturity_score: parseNumber(row.ecosystem_maturity_score),
    integration_score: parseNumber(row.integration_score),
    maintenance_score: parseNumber(row.maintenance_score),
    benchmark_score: parseNumber(row.benchmark_score),
    overall_rating: parseNumber(row.overall_rating),
    best_for: row.best_for?.trim() || '',
    supported_clouds: row.supported_clouds?.trim() || '',
    gpu_requirement: row.gpu_requirement?.trim() || 'None',
    multi_modal_support: parseBoolean(row.multi_modal_support),
    rag_support: parseBoolean(row.rag_support),
    agent_support: parseBoolean(row.agent_support),
    fine_tuning_support: parseBoolean(row.fine_tuning_support),
    api_available: parseBoolean(row.api_available),
    self_hosting_support: parseBoolean(row.self_hosting_support),
    vector_search_support: parseBoolean(row.vector_search_support),
    streaming_support: parseBoolean(row.streaming_support),
    compliance: row.compliance?.trim() || '',
    sla_support: parseBoolean(row.sla_support),
    pricing_notes: row.pricing_notes?.trim() || '',
    enterprise_clients: row.enterprise_clients?.trim() || '',
    top_competitors: row.top_competitors?.trim() || '',
    tags: row.tags?.trim() || '',
    last_updated: row.last_updated?.trim() || new Date().toISOString().split('T')[0],
  };
}

// ─── CSVService Class ─────────────────────────────────────────────────────────

class CSVService {
  private cache = new Map<string, AITool[]>();

  /**
   * Parse a CSV string into AITool objects
   */
  parseCSVString(csvText: string): CSVParseResult<AITool> {
    const result = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
    });

    const data = result.data
      .filter((row) => row.id || row.name)
      .map(mapRowToAITool);

    return {
      data,
      errors: result.errors,
      meta: result.meta,
    };
  }

  /**
   * Fetch and parse a CSV file from a URL
   */
  async fetchCSV(url: string): Promise<AITool[]> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${url} (${response.status})`);
    }
    const text = await response.text();
    const result = this.parseCSVString(text);
    this.cache.set(url, result.data);
    return result.data;
  }

  /**
   * Parse an uploaded File object
   */
  async parseFile(file: File): Promise<CSVParseResult<AITool>> {
    return new Promise((resolve, reject) => {
      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
        complete: (result) => {
          const data = result.data
            .filter((row) => row.id || row.name)
            .map(mapRowToAITool);
          resolve({ data, errors: result.errors, meta: result.meta });
        },
        error: reject,
      });
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton export
export const csvService = new CSVService();
