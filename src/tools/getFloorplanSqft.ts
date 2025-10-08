import { validateFloorplanSqft, ValidationResult } from "../schemas/store.schema";
import { sessionStore } from "../store/zustandStore";

export const handleGetFloorplanSqft = async (
  args: any
): Promise<ValidationResult<any>> => {

  const { sqft_min, sqft_max } = args.data;

  const response = validateFloorplanSqft({
    sqft_min: sqft_min,
    sqft_max: sqft_max,
  },
    `User select number sqft ${sqft_min}, ${sqft_max}`
  );

  const store = sessionStore.getState();

  store.setFloorplanSqft({
    min: response.data.sqft_min,
    max: response.data.sqft_max,
  });

  return response;
};
