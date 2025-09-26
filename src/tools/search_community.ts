// src/mcp/tools/searchCommunities.ts
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";

// ⚠️ Usa tu wrapper real (NO importa Algolia aquí)
import { queryCommunities } from "../../search/community.search";
import { parseNum } from "../utils/parseNum";
import { validateSession } from "../utils/validateSession";
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

type Args = z.infer<typeof ArgsSchema>;

export const handleSearchCommunities = async (rawArgs: Args) => {
  const pre = validateSession(rawArgs);
  if (!pre.ok) return pre;

  const { sessionId } = pre;

  const store = useSessionStore();

  const locations: string[] = Array.isArray(store.locations)
    ? store.locations.filter(Boolean)
    : [];
  if (!store.locations) {
    return {
      ok: false,
      sessionId,
      error: "MISSING_LOCATION",
      message:
        "No locations found in session. Ask the user to select locations.",
      suggest: {
        nextTool: "get_location",
        reason: "Collect locations to filter the search.",
      },
    };
  }

  const tb = store.budget?.total_budget;
  const min = tb
    ? parseNum((tb as any).price_min ?? (tb as any).min)
    : undefined;
  const max = tb
    ? parseNum((tb as any).price_max ?? (tb as any).max)
    : undefined;

  if (typeof min !== "number" || typeof max !== "number") {
    return {
      ok: false,
      sessionId,
      error: "MISSING_BUDGET",
      message:
        "No valid budget range found in session. Ask the user to provide budget.",
      suggest: {
        nextTool: "get_budget",
        reason: "Collect budget range to filter the search.",
      },
    };
  }

  const LIMIT = 3;
  const { hits } = await queryCommunities({
    locations,
    priceMin: min,
    priceMax: max,
    limit: LIMIT,
  });

  const options: HitOption[] = (hits ?? [])
    .map((h: any) => ({
      value: h.communityUID,
      name: h.name,
      divisionUID: h.divisionUID,
      communityUID: h.communityUID,
      price_min:
        typeof h.price_min === "number" ? h.price_min : parseNum(h.price_min),
      price_max:
        typeof h.price_max === "number" ? h.price_max : parseNum(h.price_max),
    }))
    .filter((h: any) => h.value);

  if (options.length === 0) {
    return {
      ok: true,
      sessionId,
      saved: undefined,
      suggest: {
        nextTool: "get_budget",
        reason:
          "No matches. Consider widening the budget or adding more locations.",
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
