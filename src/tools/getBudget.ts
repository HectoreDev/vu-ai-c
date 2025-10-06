import { success, z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import {
  priceRangeSchema,
  validatePriceRange,
  ValidationResult,
} from "../schemas/store.schema";

type Args = z.infer<typeof priceRangeSchema>;

export const handleGetBudget = async (
  args: Args
) => {
  // const parsed = validatePriceRange(args.priceMin, args.priceMax);

  // const store = useSessionStore();

  // const { priceMin, priceMax } = parsed.data;
  
  // store.setPriceMin(priceMin);
  // store.setPriceMax(priceMax);

  console.log('price', args);

  return {
    message: args.priceMax ? "" : "Pregunta al usuario por su presupuesto.",
    success: args.priceMax ? true : false,
    budget: args.priceMax
  };
};
