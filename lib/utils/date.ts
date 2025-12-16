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

const TIME_DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] =
  [
    { amount: 60, unit: 'seconds' },
    { amount: 60, unit: 'minutes' },
    { amount: 24, unit: 'hours' },
    { amount: 7, unit: 'days' },
    { amount: 4.34524, unit: 'weeks' },
    { amount: 12, unit: 'months' },
    { amount: Number.POSITIVE_INFINITY, unit: 'years' },
  ];

/**
 * Formats a date as relative time (e.g., "2 hours ago", "3 days ago").
 * Uses Intl.RelativeTimeFormat for proper localization support.
 */
export function formatTimeAgo(date: Date, locale = 'en'): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  let duration = (date.getTime() - Date.now()) / 1000;

  for (const division of TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return rtf.format(Math.round(duration), 'years');
}

/**
 * Converts a Date to LocalDateTime
 * Format: YYYY-MM-DDTHH:mm:ss
 */
export function toLocalDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
