/**
 * ExportService — Infrastructure Layer
 * Single Responsibility: Handle data exports (CSV, JSON)
 */
import Papa from 'papaparse';
import type { AITool } from '@types-app/AITool';
import dayjs from 'dayjs';

class ExportService {
  /**
   * Export tools to CSV and trigger download
   */
  exportToCSV(tools: AITool[], filename?: string): void {
    const csv = Papa.unparse(tools);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    this.download(blob, filename ?? `ai-tools-export-${dayjs().format('YYYY-MM-DD')}.csv`);
  }

  /**
   * Export tools to JSON and trigger download
   */
  exportToJSON(tools: AITool[], filename?: string): void {
    const json = JSON.stringify(tools, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    this.download(blob, filename ?? `ai-tools-export-${dayjs().format('YYYY-MM-DD')}.json`);
  }

  /**
   * Export comparison data as JSON
   */
  exportComparison(tools: AITool[]): void {
    const names = tools.map((t) => t.name).join('_vs_');
    this.exportToJSON(tools, `comparison-${names}.json`);
  }

  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();
