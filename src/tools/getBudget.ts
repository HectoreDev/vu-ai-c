import { z } from "zod";
import { sessionStore } from "./../store/zustandStore";
import {
  priceRangeSchema,
  validatePriceRange,
  ValidationResult,
} from "../schemas/store.schema";
import { searchAlgolia } from "../functions/searchAlgolia";

type Args = z.infer<typeof priceRangeSchema>;

export const handleGetBudget = async (
  args: Args
): Promise<ValidationResult<Args>> => {
  console.log('Args', args);

  const priceMax = parseInt(args.priceMax.toString());
  const priceMin = parseInt(args.priceMin.toString());

  const response = validatePriceRange(priceMin, priceMax, `El rango de presupuesto es entre 300000 y 3500000`);

  const store = useSessionStore.getState();

  const { success, data } = response;

  console.log('Response budget', response);

  if (success) {

    // const { priceMin, priceMax } = data;

    store.setPriceMin(data.priceMin);
    store.setPriceMax(data.priceMax);

    const result = await searchAlgolia({
      location: ['Phoenix'],
      priceMin,
      priceMax
    });

    console.log('Amenities from prices', result);

    return result;

  } else {
    return response;
  }
};
