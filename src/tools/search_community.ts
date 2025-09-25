// src/mcp/tools/searchCommunities.ts
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";

// ⚠️ Usa tu wrapper real (NO importa Algolia aquí)
import { queryCommunities } from "../../search/community.search";
// Se asume firma: queryCommunities({ markets: string[], budgetMin: number, budgetMax: number, limit?: number })
//   -> Promise<{ hits: Array<{ communityUID: string; name: string; market?: string; divisionUID?: string; price_min?: number; price_max?: number }> }>

const ArgsSchema = z.object({
  sessionId: z.string().trim().min(1, "sessionId is required."),
});

type HitOption = {
  value: string;
  name: string;
  divisionUID?: string;
  communityUID: string;
  price_min?: number;
  price_max?: number;
};

const parseNum = (v: unknown): number | undefined => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase().replace(/[, ]+/g, "");
    if (!s) return undefined;
    if (s.endsWith("k"))  { const n = parseFloat(s.slice(0, -1)); return Number.isFinite(n) ? n * 1_000 : undefined; }
    if (s.endsWith("m"))  { const n = parseFloat(s.slice(0, -1)); return Number.isFinite(n) ? n * 1_000_000 : undefined; }
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

export const handleSearchCommunities = async (
  rawArgs: unknown
) => {
  // 1) Validate args (sessionId only)
  const parsed = ArgsSchema.safeParse(rawArgs);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      message: "Invalid search_communities arguments.",
      issues: parsed.error.issues,
    };
  }
  const { sessionId } = parsed.data;


  const store = useSessionStore();

  const locations: string[] = Array.isArray(store.locations) ? store.locations.filter(Boolean) : [];
  if (!store.locations) {
    return {
      ok: false,
      sessionId,
      error: "MISSING_LOCATION",
      message: "No locations found in session. Ask the user to select locations.",
      suggest: { nextTool: "get_location", reason: "Collect locations to filter the search." },
    };
  }

  const tb = store.budget?.total_budget; 
  const min = tb ? parseNum((tb as any).price_min ?? (tb as any).min) : undefined;
  const max = tb ? parseNum((tb as any).price_max ?? (tb as any).max) : undefined;

  if (typeof min !== "number" || typeof max !== "number") {
    return {
      ok: false,
      sessionId,
      error: "MISSING_BUDGET",
      message: "No valid budget range found in session. Ask the user to provide budget.",
      suggest: { nextTool: "get_budget", reason: "Collect budget range to filter the search." },
    };
  }

  const LIMIT = 3;
  const { hits } = await queryCommunities({ locations, budgetMin: min, budgetMax: max, limit: LIMIT });

  const options: HitOption[] = (hits ?? []).map((h: any) => ({
    value: h.communityUID, 
    name: h.name,
    divisionUID: h.divisionUID,
    communityUID: h.communityUID,
    price_min: typeof h.price_min === "number" ? h.price_min : parseNum(h.price_min),
    price_max: typeof h.price_max === "number" ? h.price_max : parseNum(h.price_max),
  })).filter((h : any) => h.value);

  if (options.length === 0) {
    return {
      ok: true,
      sessionId,
      saved: undefined,
      suggest: {
        nextTool: "get_budget",
        reason: "No matches. Consider widening the budget or adding more locations.",
      },
      hits: options,
      applied: { locations, budget_min: min, budget_max: max },
    } as any;
  }

  return {
    ok: true,
    sessionId,
    hits: options,
    applied: { locations, budget_min: min, budget_max: max },
    suggest: {
      nextTool: "choose_community_render",
      reason: "Communities found. Present options to the user.",
    },
  } as any;
};
