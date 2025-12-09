/**
 * TIME UTILITIES
 *
 * Helper functions for working with time in a human-friendly way.
 */

/**
 * Convert a timestamp to relative time (e.g., "5m ago", "2h ago", "3d ago")
 * This makes time feel more natural and less precise/pressuring.
 */
export function getRelativeTime(timestamp) {
  const now = new Date();
  const posted = new Date(timestamp);
  const diffInSeconds = Math.floor((now - posted) / 1000);

  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now';
  }

  // Minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  // Hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  // Days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // Weeks
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  // Months (approximate)
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  // Years
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}
