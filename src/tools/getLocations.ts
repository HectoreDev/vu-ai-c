import { z } from "zod";
import { sessionStore } from "../store/zustandStore";

import {
  locationsSchema,
  validateLocation,
  validateLocations,
  ValidationResult,
} from "../schemas/store.schema";
import { searchCommunities } from "./searchCommunity";

type Args = z.infer<typeof locationsSchema>;

export const handleGetLocations = async (args: Args): Promise<ValidationResult<Args>> => {

  const response = validateLocations(args.locations, `User select locations ${args}`);

  if (response.error && !response.success) {
    throw new Error(response.error);
  }

  const { locations } = response.data;

  const store = sessionStore.getState();

  store.setlocations(locations);

  await searchCommunities();

  return response;
};
