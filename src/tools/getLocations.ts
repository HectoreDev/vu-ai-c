import { z } from "zod";
import { sessionStore } from "../store/zustandStore";
import { toArray } from "../utils/toArray";
import {
  locationsSchema,
  validateLocation,
  validateLocations,
  ValidationResult,
} from "../schemas/store.schema";

type Args = z.infer<typeof locationsSchema>;

export const handleGetLocations = async (args: Args): Promise<ValidationResult<Args>> => {
  console.log('Args',args);
  const response = validateLocations(args.locations, `User select locations ${args}`);

  const { locations } = response.data;

  const store = sessionStore.getState();

  store.setlocations(locations);

  return response;
};
