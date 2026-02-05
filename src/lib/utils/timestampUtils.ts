import { Timestamp } from 'firebase/firestore';

/**
 * Safely converts a Firestore Timestamp to a JavaScript Date object
 * Handles all possible timestamp formats:
 * - Proper Firestore Timestamp with .toDate() method
 * - Plain object with seconds/nanoseconds (deserialized Timestamp)
 * - Already a Date object
 * - Milliseconds number
 * 
 * @param timestamp - Any timestamp format
 * @returns JavaScript Date object
 */
export function toDate(timestamp: any): Date {
  if (!timestamp) {
    return Timestamp.now().toDate();
  }

  // Case 1: It's a Firestore Timestamp with .toDate() method
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }

  // Case 2: It's a plain object with seconds (deserialized Timestamp)
  if (timestamp.seconds !== undefined) {
    return Timestamp.fromMillis(timestamp.seconds * 1000).toDate();
  }

  // Case 3: It's already a Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Case 4: It's a number (milliseconds)
  // Case 5: It's a string (ISO date string)
  if (['number', 'string'].includes(typeof timestamp)) {
    return new Date(timestamp);
  }


  // Fallback: return current date
  console.warn('[timestampUtils] Unknown timestamp format:', timestamp);
  return Timestamp.now().toDate();
}

/**
 * Format a timestamp to a readable string
 * 
 * @param timestamp - Any timestamp format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatTimestamp(
  timestamp: any,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
): string {
  const date = toDate(timestamp);
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get time ago string (e.g., "2 hours ago", "3 days ago")
 * 
 * @param timestamp - Any timestamp format
 * @returns Time ago string
 */
export function timeAgo(timestamp: any): string {
  const date = toDate(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);
  const diffMonths = Math.floor(diffMs / 2592000000);
  const diffYears = Math.floor(diffMs / 31536000000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
}

/**
 * Check if a timestamp has expired
 * 
 * @param expiryTimestamp - Expiry timestamp in any format
 * @returns true if expired, false otherwise
 */
export function isExpired(expiryTimestamp: any): boolean {
  console.log("expiryTImestmp",expiryTimestamp)
  const expiryDate = toDate(expiryTimestamp);
  const now = Timestamp.now().toDate();
  return expiryDate <= now;
}

/**
 * Check if a timestamp is in the future
 * 
 * @param timestamp - Timestamp in any format
 * @returns true if in future, false otherwise
 */
export function isFuture(timestamp: Timestamp): boolean {
  const date = toDate(timestamp);
  const now = Timestamp.now().toDate();
  return date > now;
}
