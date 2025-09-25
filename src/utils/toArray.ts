

export const toArray = (v?: string | string[]): string[] => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return [v];
}