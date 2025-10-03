import z from "zod";
import { ValidationResult } from "../schemas/store.schema";
import { useSessionStore } from "../store/zustandStore";
import { floorplanSpecsMissing } from "../utils/floorplanSpecsMissing";

// type Args = z.infer<typeof >;

export const handleGetFloorplanGarage = async (
  args: any
): Promise<ValidationResult<any>> => {
  const parsed = args;
  // validateRange(args.garage_min, args.garage_max);

  const { garage_min, garage_max } = parsed.data;

  const store = useSessionStore.getState();

  const floorplanSpecs = {
    ...store.floorplanSpecs,
    garage: {
      min: garage_min,
      max: garage_max,
    },
  }

  const missing = floorplanSpecsMissing(floorplanSpecs)

  store.setFloorplanSpecs(floorplanSpecs);

  return {
    success: true,
    code: 200,
    data: {
      garage_min,
      garage_max,
    },
    error: null,
    history: [],
    message: `User select number garages ${garage_min}, ${garage_max} 
    ${missing.length > 0 && `estos son los floorplanSpecs que faltan preguntarlos ${missing.toString()}`}`,
  };
};
