import z from "zod";
import { validateFloorplanGarage, ValidationResult } from "../schemas/store.schema";
import { sessionStore } from "../store/zustandStore";
import { floorplanSpecsMissing } from "../utils/floorplanSpecsMissing";

// type Args = z.infer<typeof >;

export const handleGetFloorplanGarage = async (
  args: any
): Promise<ValidationResult<any>> => {

  const { garage_min, garage_max } = args.data;

  const response = validateFloorplanGarage({
    garage_min,
    garage_max,
  },
    `User select number garages ${garage_min}, ${garage_max}`
  );

  const store = sessionStore.getState();

  store.setFloorplanGarage({
    min: response.data.garage_min,
    max: response.data.garage_max,
  });

  return response;

};
