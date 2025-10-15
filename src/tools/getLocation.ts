import { z } from "zod";
import { sessionStore } from "../store/zustandStore";

import {
  locationsSchema,
  validateLocations,
  ValidationResult,
} from "../schemas/store.schema";

type Args = z.infer<typeof locationsSchema>;

export const handleGetLocation = async (args: Args): Promise<ValidationResult<Args>> => {
  const response = validateLocations(args.locations, `User select locations ${args.locations}`);

  const { locations } = response.data;

  const store = sessionStore.getState();

  store.setlocations(locations);

  return response;
};
