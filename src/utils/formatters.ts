/**
 * formatters — Domain utilities
 * Pure formatting functions with no side effects
 */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatScore(score: number): string {
  return Math.round(score).toString();
}

export function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 65) return '#84cc16';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

export function scoreLabel(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

export function scoreGradient(score: number): string {
  if (score >= 80) return 'from-green-500 to-emerald-400';
  if (score >= 65) return 'from-lime-500 to-green-400';
  if (score >= 50) return 'from-amber-500 to-yellow-400';
  return 'from-red-500 to-rose-400';
}

export function formatStars(stars: number): string {
  if (stars >= 1_000_000) return `${(stars / 1_000_000).toFixed(1)}M`;
  if (stars >= 1_000) return `${(stars / 1_000).toFixed(1)}k`;
  return stars.toString();
}

export function formatDate(date: string): string {
  return dayjs(date).format('MMM D, YYYY');
}

export function timeAgo(date: string): string {
  return dayjs(date).fromNow();
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '…';
}

export function tagsArray(tags: string): string[] {
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export function cloudsArray(clouds: string): string[] {
  return clouds
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
}

export function pricingBadgeColor(model: string): string {
  switch (model) {
    case 'Free':
    case 'Open Source':
      return 'badge-success';
    case 'Freemium':
      return 'badge-brand';
    case 'Pay-per-use':
    case 'Subscription':
      return 'badge-warning';
    case 'Enterprise':
    case 'Custom':
      return 'badge-danger';
    default:
      return 'badge-brand';
  }
}

export function scoreBarWidth(score: number): string {
  return `${Math.min(100, Math.max(0, score))}%`;
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function heatmapColor(normalized: number): string {
  // 0 = red, 0.5 = amber, 1 = green
  const r = Math.round(255 * (1 - normalized));
  const g = Math.round(200 * normalized);
  return `rgb(${r}, ${g}, 60)`;
}
