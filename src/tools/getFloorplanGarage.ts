import z from "zod";
import { floorplanGarageSchema, validateFloorplanGarage, ValidationResult } from "../schemas/store.schema";
import { useSessionStore } from "../store/zustandStore";


type Args = z.infer<typeof floorplanGarageSchema>;

export const handleGetFloorplanGarage = async (
  args: Args
): Promise<ValidationResult<Args>> => {

  const response = validateFloorplanGarage({
    garage_min: args.garage_min,
    garage_max: args.garage_max
  }, `User select number garages ${args.garage_min}, ${args.garage_max} `)

  const { garage_min, garage_max } = response.data;

  const store = useSessionStore.getState();

  store.setFloorplanGarage({
    min: garage_min,
    max: garage_max
  });

  return response
};
