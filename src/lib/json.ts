/**
 * JSON-as-string helpers.
 * SQLite has no native JSON column, so we store JSON values as serialized
 * text and parse/stringify at the edges.
 */
export function toJson(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === 'string') return value; // already a string
  return JSON.stringify(value);
}

export function fromJson<T = unknown>(value: unknown): T | null {
  if (value == null) return null;
  if (typeof value !== 'string') return value as T; // already parsed
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
