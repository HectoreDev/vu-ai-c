import z from "zod";
import { floorplanSqftSchema, validateFloorplanSqft, ValidationResult } from "../schemas/store.schema";
import { useSessionStore } from "../store/zustandStore";


type Args = z.infer<typeof floorplanSqftSchema>;

export const handleGetFloorplanSqft = async (
  args: Args
): Promise<ValidationResult<Args>> => {
  const response = validateFloorplanSqft({
    sqft_min: args.sqft_min,
    sqft_max: args.sqft_max
  }, `User select number sqft ${args.sqft_min}, ${args.sqft_max}`)

  const { sqft_min, sqft_max } = response.data;

  const store = useSessionStore.getState();

  store.setFloorplanSqft({
    min: sqft_min,
    max: sqft_max
  });

  return response
};
