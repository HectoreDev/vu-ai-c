import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { BudgetType, Range } from "../types/types";
import { toRange } from "../utils/toRange";
import {
  ArgsFloorplanSpecsSchema,
  parseFloorplanSpecs,
} from "../utils/parseFloorplanSpecs";
import { validateSession } from "../utils/validateSession";

type Args = z.infer<typeof ArgsFloorplanSpecsSchema>;

export const handleGetBudget = async (rawArgs: Args) => {
  const pre = validateSession(rawArgs);
  if (!pre.ok) return pre;

  const parsed = ArgsFloorplanSpecsSchema.safeParse(rawArgs);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      sessionId: pre.sessionId,
      issues: parsed.error.issues,
      message: "Invalid set_budget arguments.",
    };
  }

  const norm = parseFloorplanSpecs(parsed.data);
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
