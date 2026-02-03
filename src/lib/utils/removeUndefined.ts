/**
 * Utility function to remove undefined values from objects
 * Firestore does not accept undefined values
 */

/**
 * Recursively removes undefined values from an object
 * @param obj - The object to clean
 * @returns A new object without undefined values
 */
export function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => 
      typeof item === 'object' ? removeUndefined(item) : item
    ) as any;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const cleaned: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Skip undefined values
      if (value === undefined) {
        continue;
      }

      // Recursively clean nested objects
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        cleaned[key] = removeUndefined(value);
      } 
      // Clean arrays
      else if (Array.isArray(value)) {
        cleaned[key] = value.map(item =>
          typeof item === 'object' && item !== null ? removeUndefined(item) : item
        );
      }
      // Keep primitive values
      else {
        cleaned[key] = value;
      }
    }
  }

  return cleaned;
}

/**
 * Alias for backward compatibility
 */
export const unde_fined = removeUndefined;

/**
 * Remove undefined values from an object (shallow)
 * Only removes undefined at the top level
 */
export function removeUndefinedShallow<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: any = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  
  return cleaned;
}
