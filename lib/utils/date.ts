/**
 * Formats a date for display (e.g., "January 15, 2026").
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns a date N months from now.
 * @param months - Number of months to add (default: 1)
 */
export function getDateFromNow(months = 1): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}
