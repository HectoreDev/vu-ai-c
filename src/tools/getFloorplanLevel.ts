import z from "zod";
import { floorplanLevelSchema, validateFloorplanLevel, ValidationResult } from "../schemas/store.schema";
import { sessionStore } from "../store/zustandStore";
import { floorplanSpecsMissing } from "../utils/floorplanSpecsMissing";

type Args = z.infer<typeof floorplanLevelSchema>;

export const handleGetFloorplanLevel = async (
  args: Args
): Promise<ValidationResult<Args>> => {
  const response = validateFloorplanLevel({
    level_min: args.level_min,
    level_max: args.level_max
  }, `User select number level ${args.level_min}, ${args.level_max}`)

  const { level_min, level_max } = response.data;

  const store = sessionStore.getState();

  store.setFloorplanLevel({
    min: level_min,
    max: level_max
  });

  return response
};
