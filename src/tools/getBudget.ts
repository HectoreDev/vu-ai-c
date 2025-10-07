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
) : Promise<ValidationResult<Args>> => {
  console.log('Args', args);
  const response = validatePriceRange(args.priceMin, args.priceMax, `User Select range to price ${args.priceMin} - ${args.priceMax}`);

  const store = useSessionStore();

  const { priceMin, priceMax } = response.data;
  
  store.setPriceMin(priceMin);
  store.setPriceMax(priceMax);

  return response;
};
