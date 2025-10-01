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
): Promise<ValidationResult<Args>> => {
  const parsed = validateLocations(args.locations);

  const { locations } = parsed.data;
  const locs = toArray(locations);

  const store = useSessionStore.getState();

  store.setlocations(locs);

  return {
    success: true,
    code: 200,
    data: {
      locs,
    },
    error: null,
    history: [],
    message: `User select locations ${locs}`,
  };
};
