import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { BudgetType, Range } from "../types/types";

function parseNumberish(v?: unknown): number | undefined {
  if (v == null) return undefined;
  if (typeof v === "number" && Number.isFinite(v)) return v;

  const s = String(v).trim().toLowerCase();
  if (!s) return undefined;

  const raw = s.replace(/[, ]+/g, "");

  if (raw.endsWith("%")) {
    const n = parseFloat(raw.slice(0, -1));
    return Number.isFinite(n) ? n : undefined;
  }

  if (raw.endsWith("y")) {
    const n = parseFloat(raw.slice(0, -1));
    return Number.isFinite(n) ? n : undefined;
  }

  if (raw.endsWith("k")) {
    const n = parseFloat(raw.slice(0, -1));
    return Number.isFinite(n) ? n * 1_000 : undefined;
  }
  if (raw.endsWith("m")) {
    const n = parseFloat(raw.slice(0, -1));
    return Number.isFinite(n) ? n * 1_000_000 : undefined;
  }

  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : undefined;
}

const Numberish = z.union([z.number(), z.string()]).transform(parseNumberish);

const BudgetLoose = z
  .object({
    price: Numberish.optional(),
    price_min: Numberish.optional(),
    price_max: Numberish.optional(),
    down_payment: Numberish.optional(),
    interest_rate: Numberish.optional(),
    loan_duration: Numberish.optional(),
  })
  .partial();

const ArgsSchema = z.object({
  sessionId: z.string().trim().min(1, "sessionId is required."),
  price: Numberish.optional(),
  price_min: Numberish.optional(),
  price_max: Numberish.optional(),
  down_payment: Numberish.optional(),
  interest_rate: Numberish.optional(),
  loan_duration: Numberish.optional(),
  budget: BudgetLoose.optional(),
});

function normalizeAndValidate(input: z.infer<typeof ArgsSchema>):
  | {
      budgetPatch: BudgetType;
      missing: Array<
        "price" | "down_payment" | "interest_rate" | "loan_duration"
      >;
    }
  | { error: string; message: string } {
  const flat = {
    price: input.price ?? input.budget?.price,
    price_min: input.price_min ?? input.budget?.price_min,
    price_max: input.price_max ?? input.budget?.price_max,
    down_payment: input.down_payment ?? input.budget?.down_payment,
    interest_rate: input.interest_rate ?? input.budget?.interest_rate,
    loan_duration: input.loan_duration ?? input.budget?.loan_duration,
  };

  let priceMin = flat.price_min;
  let priceMax = flat.price_max;

  if (flat.price != null) {
    priceMin = flat.price;
    priceMax = flat.price;
  } else {
    if (priceMin != null && priceMax == null) priceMax = priceMin;
    if (priceMax != null && priceMin == null) priceMin = priceMax;
  }

  if (flat.down_payment != null) {
    if (flat.down_payment < 1 || flat.down_payment > 100) {
      return {
        error: "INVALID_DOWN_PAYMENT",
        message: "down_payment must be between 1 and 100.",
      };
    }
  }
  if (flat.interest_rate != null) {
    if (flat.interest_rate < 2.08 || flat.interest_rate > 10) {
      return {
        error: "INVALID_INTEREST_RATE",
        message: "interest_rate must be between 2.08 and 10.",
      };
    }
  }
  if (flat.loan_duration != null) {
    if (flat.loan_duration < 11 || flat.loan_duration > 60) {
      return {
        error: "INVALID_LOAN_DURATION",
        message: "loan_duration must be between 11 and 60.",
      };
    }
  }
  if (priceMin != null && priceMin <= 0) {
    return { error: "INVALID_PRICE_MIN", message: "price_min must be > 0." };
  }
  if (priceMax != null && priceMax <= 0) {
    return { error: "INVALID_PRICE_MAX", message: "price_max must be > 0." };
  }

  function toRange(
    min?: number | null,
    max?: number | null
  ): Range | undefined {
    if (min == null || max == null) return undefined;
    return { min, max };
  }

  priceMin = flat.price_min;
  priceMax = flat.price_max;

  if (flat.price != null) {
    priceMin = flat.price;
    priceMax = flat.price;
  } else {
    if (priceMin != null && priceMax == null) priceMax = priceMin;
    if (priceMax != null && priceMin == null) priceMin = priceMax;
  }

  const totalRange: Range | undefined = toRange(
    priceMin ?? null,
    priceMax ?? null
  );

  const budgetPatch: BudgetType = {
    total_budget: totalRange,
    down_payment: flat.down_payment,
    interest_rate: flat.interest_rate,
    loan_duration: flat.loan_duration,
  };

  const missing: Array<
    "price" | "down_payment" | "interest_rate" | "loan_duration"
  > = [];
  if (!totalRange) missing.push("price");
  if (!budgetPatch.down_payment) missing.push("down_payment");
  if (!budgetPatch.interest_rate) missing.push("interest_rate");
  if (!budgetPatch.loan_duration) missing.push("loan_duration");

  return { budgetPatch, missing };
}

type Args = z.infer<typeof ArgsSchema>;

export const handleSetBudget = async (rawArgs: Args) => {
  const pre = z
    .object({ sessionId: z.string().trim().min(1).optional() })
    .safeParse(rawArgs);
  if (!pre.success || !pre.data.sessionId) {
    return {
      ok: false,
      error: "MISSING_SESSION",
      message: "Missing sessionId. Ask for the user's name to start a session.",
      suggest: {
        nextTool: "get_name_render",
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
      message: "Invalid set_budget arguments.",
    };
  }

  const norm = normalizeAndValidate(parsed.data);
  if ("error" in norm) {
    return {
      ok: false,
      error: norm.error,
      sessionId: parsed.data.sessionId,
      message: norm.message,
    };
  }

  const { sessionId } = parsed.data;
  const { budgetPatch, missing } = norm;

  const store = useSessionStore();

  const current = store.budget ?? {};

  const merged = {
    total_budget: budgetPatch.total_budget ?? current.total_budget,
    down_payment: budgetPatch.down_payment ?? current.down_payment,
    interest_rate: budgetPatch.interest_rate ?? current.interest_rate,
    loan_duration: budgetPatch.loan_duration ?? current.loan_duration,
  };

  store.setBudget(merged);

  if (
    budgetPatch.total_budget ||
    budgetPatch.down_payment ||
    budgetPatch.interest_rate ||
    budgetPatch.loan_duration
  ) {
    store.setBudget(budgetPatch);
  }

  if (budgetPatch.total_budget) {
    store.setPriceMin(budgetPatch.total_budget.min);
    store.setPriceMax(budgetPatch.total_budget.max);
  }

  return {
    ok: true,
    sessionId,
    saved: {
      budget: { ...merged, missing },
    },
    suggest: missing.length && {
      nextTool: "budget_render",
      reason: `Budget partially set. Missing: ${missing.join(
        ", "
      )}. Ask the user for the remaining inputs until complete.`,
    },
    // : {
    //     nextTool: "floorplanSpecs_render",
    //     reason: "Budget is complete; proceed to floorplan preferences.",
    //   },
  };
};
