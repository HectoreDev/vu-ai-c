import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { toArray } from "../utils/toArray";
import {
  locationsSchema,
  validateLocation,
  validateLocations,
  ValidationResult,
} from "../schemas/store.schema";
import { ToolResponse } from "../types/types";

type Args = z.infer<typeof locationsSchema>;

export const handleGetLocation = async (
  args: Args
) => {
  // const parsed = validateLocations(args.locations);

  // const { locations } = parsed.data;
  // const locs = toArray(locations);
  console.log('args', args);

  // @ts-ignore
  const locs = args.location;

  const store = useSessionStore.getState();

  store.setlocations(locs);

  return {
    message: locs ? "" : "Pregunta al usuario por la ubicación u obicaciones donde quiera encontrar casa.",
    success: locs ? true : false,
    locations: locs
  };
};
