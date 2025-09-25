import { Range } from "../types/types";

export   const toRange = (
    min?: number | null,
    max?: number | null
  ): Range | undefined => {
    if (min == null || max == null) return undefined;
    return { min, max };
  }