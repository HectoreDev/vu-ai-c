import z from "zod";
import { ValidationResult } from "../schemas/store.schema";
import { useSessionStore } from "../store/zustandStore";
import { floorplanSpecsMissing } from "../utils/floorplanSpecsMissing";

// type Args = z.infer<typeof >;

export const handleGetFloorplanBath = async (
  args: any
): Promise<ValidationResult<any>> => {
  const parsed = args;
  // validateRange(args.bath_min, args.bath_max);

  const { bath_min, bath_max } = parsed.data;

  const store = useSessionStore.getState();

  const floorplanSpecs = {
    // ...store.floorplanSpecs,
    bath: {
      min: bath_min,
      max: bath_max,
    },
  };

  const missing = floorplanSpecsMissing(floorplanSpecs);

  //store.setFloorplanSpecs(floorplanSpecs);

  return {
    success: true,
    code: 200,
    data: {
      bath_min,
      bath_max,
    },
    error: null,
    history: [],
    message: `User select number baths ${bath_min}, ${bath_max} 
    ${missing.length > 0 &&
      `estos son los floorplanSpecs que faltan preguntarlos ${missing.toString()}`
      }`,
  };
};
