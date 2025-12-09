/**
 * Returns a time-appropriate greeting based on the current hour.
 * - Morning: 00:00 - 11:59
 * - Afternoon: 12:00 - 17:59
 * - Evening: 18:00 - 23:59
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
