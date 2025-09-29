// src/mcp/tools/setInterestingHome.ts
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { validateSession } from "../utils/validateSession";

const asStringOrArray = z.union([z.string(), z.array(z.string())]);

// Zod schema: flexible aliases + text forms
const ArgsSchema = z
  .object({
    sessionId: z.string().trim().min(1, "sessionId is required."),
    homeInterest: asStringOrArray.optional(),
    features_text: z.string().optional(),
  })
  .refine(
    (d) => {
      const anyArrOrStr = d.homeInterest || d.features_text;
      return !!anyArrOrStr;
    },
    { message: "Provide at least one feature field.", path: ["features"] }
  );

const toArray = (v?: string | string[]): string[] => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  // split by common separators
  return v
    .split(/[,;|]/g)
    .map((s) => s.trim())
    .filter(Boolean);
};

const collectFeatures = (data: z.infer<typeof ArgsSchema>): string[] => {
  const parts: string[] = [
    ...toArray(data.homeInterest),
    ...toArray(data.features_text),
  ];

  // sanitize: trim non-empty, max 80 chars per item, dedupe (case-insensitive)
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of parts) {
    const cleaned = item.replace(/\s+/g, " ").trim();
    if (!cleaned) continue;
    const limited = cleaned.slice(0, 80);
    const key = limited.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(limited);
    if (out.length >= 30) break; // hard cap
  }
  return out;
};

type Args = z.infer<typeof ArgsSchema>;

export const handleGetInterestedHome = async (rawArgs: Args) => {
  const pre = validateSession(rawArgs);
  if (!pre.ok) return pre;

  const parsed = ArgsSchema.safeParse(rawArgs);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      sessionId: pre.sessionId,
      issues: parsed.error.issues,
      message: "Invalid set_interesting_home arguments.",
    };
  }

  const { sessionId } = parsed.data;
  const features = collectFeatures(parsed.data);

  if (!features.length) {
    return {
      ok: false,
      error: "NO_FEATURES",
      sessionId,
      message:
        "No valid features were provided. Please ask the user for short must-have phrases.",
    };
  }

  const store = useSessionStore();

  store.setInterest(features);

  return {
    ok: true,
    sessionId,
    saved: { homeInterest: features },

    // suggest: {
    //   nextTool: "search_communities",
    //   reason: "Must-have features saved; proceed to find matching communities.",
    // },
  };
};
