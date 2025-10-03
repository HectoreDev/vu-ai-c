import z from "zod";
import { ValidationResult } from "../schemas/store.schema";
import { useSessionStore } from "../store/zustandStore";
import { floorplanSpecsMissing } from "../utils/floorplanSpecsMissing";

// type Args = z.infer<typeof >;

export const handleGetFloorplanLevel = async (
  args: any
): Promise<ValidationResult<any>> => {
  const parsed = args;
  // validateRange(args.level_min, args.level_max);

  const { level_min, level_max } = parsed.data;

  const store = useSessionStore.getState();

  const floorplanSpecs = {
    ...store.floorplanSpecs,
    level: {
      min: level_min,
      max: level_max,
    },
  }

  const missing = floorplanSpecsMissing(floorplanSpecs)

  store.setFloorplanSpecs(floorplanSpecs);

  return {
    success: true,
    code: 200,
    data: {
      level_min,
      level_max,
    },
    error: null,
    history: [],
    message: `User select number levels ${level_min}, ${level_max} 
    ${missing.length > 0 && `estos son los floorplanSpecs que faltan preguntarlos ${missing.toString()}`}`,
  };
};
