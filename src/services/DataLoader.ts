/**
 * DataLoader — Infrastructure Layer
 * Single Responsibility: Orchestrate loading CSV data by category
 * Open/Closed: New categories added via CATEGORY_REGISTRY without modifying loader
 */
import { csvService } from './CSVService';
import { CATEGORY_REGISTRY } from '@types-app/index';
import type { AITool, CategoryMeta } from '@types-app/index';

class DataLoader {
  private readonly basePath = '/data';
  private loadedFiles = new Set<string>();

  /**
   * Get the CSV URL for a specific CSV filename
   */
  getCSVUrl(filename: string): string {
    return `${this.basePath}/${filename}`;
  }

  /**
   * Load all tools for a specific category by its ID
   */
  async loadCategory(categoryId: string): Promise<AITool[]> {
    const meta = CATEGORY_REGISTRY.find((c) => c.id === categoryId);
    if (!meta) throw new Error(`Unknown category: ${categoryId}`);
    return this.loadCSVFile(meta.csvFile);
  }

  /**
   * Load a specific CSV file (deduplicates by filename)
   */
  async loadCSVFile(filename: string): Promise<AITool[]> {
    const url = this.getCSVUrl(filename);
    return csvService.fetchCSV(url);
  }

  /**
   * Load ALL categories at once (for the overview/home page)
   */
  async loadAll(): Promise<AITool[]> {
    // Deduplicate CSV files (multiple categories can share one CSV)
    const uniqueFiles = [...new Set(CATEGORY_REGISTRY.map((c) => c.csvFile))];
    
    const results = await Promise.allSettled(
      uniqueFiles.map((file) => this.loadCSVFile(file))
    );

    const allTools: AITool[] = [];
    const seen = new Set<string>();

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        result.value.forEach((tool) => {
          if (!seen.has(tool.id)) {
            seen.add(tool.id);
            allTools.push(tool);
          }
        });
      }
    });

    return allTools;
  }

  /**
   * Get category metadata by ID
   */
  getCategoryMeta(categoryId: string): CategoryMeta | undefined {
    return CATEGORY_REGISTRY.find((c) => c.id === categoryId);
  }

  /**
   * Load tools for multiple categories at once
   */
  async loadCategories(categoryIds: string[]): Promise<AITool[]> {
    const filenames = [...new Set(
      categoryIds
        .map((id) => CATEGORY_REGISTRY.find((c) => c.id === id)?.csvFile)
        .filter(Boolean) as string[]
    )];

    const results = await Promise.allSettled(
      filenames.map((file) => this.loadCSVFile(file))
    );

    const allTools: AITool[] = [];
    const seen = new Set<string>();

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        result.value.forEach((tool) => {
          if (!seen.has(tool.id)) {
            seen.add(tool.id);
            allTools.push(tool);
          }
        });
      }
    });

    return allTools;
  }

  markLoaded(filename: string): void {
    this.loadedFiles.add(filename);
  }

  isLoaded(filename: string): boolean {
    return this.loadedFiles.has(filename);
  }
}

export const dataLoader = new DataLoader();
