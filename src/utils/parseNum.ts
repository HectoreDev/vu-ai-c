export const parseNum = (v: unknown): number | undefined => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase().replace(/[, ]+/g, "");
    if (!s) return undefined;
    if (s.endsWith("k")) {
      const n = parseFloat(s.slice(0, -1));
      return Number.isFinite(n) ? n * 1_000 : undefined;
    }
    if (s.endsWith("m")) {
      const n = parseFloat(s.slice(0, -1));
      return Number.isFinite(n) ? n * 1_000_000 : undefined;
    }
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};
