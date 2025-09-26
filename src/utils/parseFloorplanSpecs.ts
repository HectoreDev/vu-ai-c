import z from "zod";
import { BudgetType, Range } from "../types/types";
import { toRange } from "./toRange";

const parseNumberish = (v?: unknown): number | undefined => {
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

export const ArgsFloorplanSpecsSchema = z.object({
  sessionId: z.string().trim().min(1, "sessionId is required."),
  price: Numberish.optional(),
  price_min: Numberish.optional(),
  price_max: Numberish.optional(),
  down_payment: Numberish.optional(),
  interest_rate: Numberish.optional(),
  loan_duration: Numberish.optional(),
  budget: BudgetLoose.optional(),
});

export const parseFloorplanSpecs = (input: z.infer<typeof ArgsFloorplanSpecsSchema>):
  | {
      budgetPatch: BudgetType;
      missing: Array<
        "price" | "down_payment" | "interest_rate" | "loan_duration"
      >;
    }
  | { error: string; message: string } => {
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

