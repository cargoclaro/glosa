/**
 * For some reason, Langchain calls add in null bytes to the strings.
 * Postgresql does not support null bytes in text fields.
 * This function removes them.
 */
export function sanitizeObjectStrings<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return obj.replace(/\0/g, '') as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObjectStrings(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = sanitizeObjectStrings(obj[key]);
      }
    }
    return result as unknown as T;
  }
  
  return obj;
}
