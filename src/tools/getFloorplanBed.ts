import z from "zod";
import { ValidationResult } from "../schemas/store.schema";
import { useSessionStore } from "../store/zustandStore";
import { floorplanSpecsMissing } from "../utils/floorplanSpecsMissing";

// type Args = z.infer<typeof >;

export const handleGetFloorplanBed = async (
  args: any
): Promise<ValidationResult<any>> => {
  const parsed = args;
  // validateRange(args.bed_min, args.bed_max);

  const { bed_min, bed_max } = parsed.data;

  const store = useSessionStore.getState();

  const floorplanSpecs = {
    //...store.floorplanSpecs,
    bed: {
      min: bed_min,
      max: bed_max,
    },
  }

  const missing = floorplanSpecsMissing(floorplanSpecs)

  //store.setFloorplanSpecs(floorplanSpecs);

  return {
    success: true,
    code: 200,
    data: {
      bed_min,
      bed_max,
    },
    error: null,
    history: [],
    message: `User select number beds ${bed_min}, ${bed_max} 
    ${missing.length > 0 && `estos son los floorplanSpecs que faltan preguntarlos ${missing.toString()}`}`,
  };
};
