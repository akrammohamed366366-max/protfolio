/**
 * Deeply removes any key whose value is undefined (including inside nested objects and arrays),
 * and trims strings.
 * Preserves FieldValue (like serverTimestamp), Dates, primitive types, etc.
 */
export function removeUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj.trim() as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => removeUndefined(item)) as unknown as T;
  }

  // Handle plain objects (avoid messing with Date, Firestore FieldValue/serverTimestamp, etc.)
  if (typeof obj === 'object') {
    // If it's a special object type like Date or serverTimestamp token
    const prototype = Object.getPrototypeOf(obj);
    if (prototype !== Object.prototype && prototype !== null) {
      return obj;
    }

    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefined(value);
      }
    }
    return cleaned as T;
  }

  return obj;
}
