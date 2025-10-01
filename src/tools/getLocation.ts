import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { toArray } from "../utils/toArray";
import { locationsSchema, validateLocations } from "../schemas/store.schema";
import { ToolResponse } from "../types/types";

type Args = z.infer<typeof locationsSchema>;

export const handleGetLocation = async (
  rawArgs: Args
): Promise<ToolResponse> => {
  const parsed = validateLocations(rawArgs.locations);

  const { locations } = parsed.data;
  const locs = toArray(locations);

  const store = useSessionStore.getState();

  store.setlocations(locs);

  return {
    success: true,
    text: JSON.stringify(locs),
    options: {
      saved: {
        locs,
      },
    },
  };
};
