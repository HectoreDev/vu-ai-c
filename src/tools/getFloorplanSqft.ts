import z from "zod";
import { ValidationResult } from "../schemas/store.schema";
import { useSessionStore } from "../store/zustandStore";
import { floorplanSpecsMissing } from "../utils/floorplanSpecsMissing";

// type Args = z.infer<typeof >;

export const handleGetFloorplanSqft = async (
  args: any
): Promise<ValidationResult<any>> => {
  const parsed = args;
  // validateRange(args.sqft_min, args.sqft_max);

  const { sqft_min, sqft_max } = parsed.data;

  const store = useSessionStore.getState();

  const floorplanSpecs = {
    //...store.floorplanSpecs,
    sqft: {
      min: sqft_min,
      max: sqft_max,
    },
  };

  const missing = floorplanSpecsMissing(floorplanSpecs);

  //store.setFloorplanSpecs(floorplanSpecs);

  return {
    success: true,
    code: 200,
    data: {
      sqft_min,
      sqft_max,
    },
    error: null,
    history: [],
    message: `User select number sqft ${sqft_min}, ${sqft_max} 
    ${missing.length > 0 &&
      `estos son los floorplanSpecs que faltan preguntarlos ${missing.toString()}`
      }`,
  };
};
