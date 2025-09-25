// src/mcp/tools/getInterestRate.ts
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { InterestRate } from "../types/types";


const ArgsSchema = z.object({
  sessionId: z.string().trim().min(1, "sessionId is required."),
  product: z.string().optional(), 
  label: z.string().optional(),   
  answer: z.string().optional(),  
  none: z.boolean().optional(),  
})
.refine((d) => !!(d.product || d.label || d.answer || d.none === true), {
  message: "Provide at least one selector: product, label, answer, or none:true.",
  path: ["product"],
});


function normalizeProduct(input?: {
  product?: string;
  label?: string;
  answer?: string;
  none?: boolean;
}): InterestRate | null {
  if (input?.none === true) return null;

  const canon = (s?: string) => (s ? s.toLowerCase().trim() : "");

  const p = canon(input?.product);
  if (p === "fha_30") return "fha_30";
  if (p === "conventional_30") return "conventional_30";
  if (p === "null") return null;

  const raw = canon(input?.label) || canon(input?.answer);
  if (!raw) return null;

  if (
    raw.includes("fha") ||
    raw.includes("fha 30") ||
    raw.includes("fha-30") ||
    raw.includes("fha_30") ||
    raw.includes("fha 30-year")
  ) return "fha_30";

  if (
    raw.includes("conventional") ||
    raw.includes("conv 30") ||
    raw.includes("conventional 30") ||
    raw.includes("conventional 30-year")
  ) return "conventional_30";

  if (["no", "none", "skip", "not now", "nope", "nah", "decline"].some(k => raw.includes(k)))
    return null;

  return null;
}

type Args = z.infer<typeof ArgsSchema>;

export const handleGetInterestRate =  async (rawArgs: Args) => {
  // Fast check for session
  const pre = z.object({ sessionId: z.string().trim().min(1).optional() }).safeParse(rawArgs);
  if (!pre.success || !pre.data.sessionId) {
    return {
      ok: false,
      error: "MISSING_SESSION",
      message: "Missing sessionId. Ask for the user's name to start a session.",
      suggest: {
        nextTool: "get_name",
        reason: "Capture the user's name to create or resume a session.",
      },
    };
  }

  const parsed = ArgsSchema.safeParse(rawArgs);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      sessionId: pre.data.sessionId,
      issues: parsed.error.issues,
      message: "Invalid get_interest_rate arguments.",
    };
  }

  const { sessionId, product, label, answer, none } = parsed.data;

  const normalized = normalizeProduct({ product, label, answer, none });

  const store = useSessionStore();

   store.setInterestRate(normalized);

  return {
    ok: true,
    sessionId,
    saved: { interestRate: normalized }
  };
}
