import z from "zod";
import { floorplanBathSchema, validateFloorplanBath, ValidationResult } from "../schemas/store.schema";
import { sessionStore } from "../store/zustandStore";

type Args = z.infer<typeof floorplanBathSchema>;

export const handleGetFloorplanBath = async (
  args: Args
): Promise<ValidationResult<Args>> => {

  const response = validateFloorplanBath({
    min: args.bath_min,
    max: args.bath_max
  }, `User select number baths ${args.bath_min}, ${args.bath_max}`);

  const { bath_min, bath_max } = response.data;

  const store = sessionStore.getState();


  store.setFloorplanBath({
    max: bath_max,
    min: bath_min
  });

  return response;
};
