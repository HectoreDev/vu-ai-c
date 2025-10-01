import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import {
  priceRangeSchema,
  validatePriceRange,
  ValidationResult,
} from "../schemas/store.schema";

type Args = z.infer<typeof priceRangeSchema>;

export const handleGetBudget = async (
  args: Args
): Promise<ValidationResult<Args>> => {
  const parsed = validatePriceRange(args.priceMin, args.priceMax);

  const store = useSessionStore();

  const { priceMin, priceMax } = parsed.data;
  
  store.setPriceMin(priceMin);
  store.setPriceMax(priceMax);

  return {
    success: true,
    code: 200,
    data: {
      priceMin,
      priceMax
    },
    error: null,
    history: [],
    message: `Price min ${priceMin}, price max ${priceMax}`,
  };
};
