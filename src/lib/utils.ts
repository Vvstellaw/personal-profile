/**
 * Merge class names, filtering out falsy values.
 * Simple replacement for clsx + tailwind-merge.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Generate a short unique ID.
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Format a "YYYY-MM" string to "Month Year" display.
 */
export function formatDate(ym: string): string {
  const [year, month] = ym.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const m = months[parseInt(month, 10) - 1] || month;
  return `${m} ${year}`;
}

/**
 * Estimate base64 size in KB.
 */
export function base64SizeKB(base64: string): number {
  // Base64: 4 chars ≈ 3 bytes
  return Math.round((base64.length * 0.75) / 1024);
}
