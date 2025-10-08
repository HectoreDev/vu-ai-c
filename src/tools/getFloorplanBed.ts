import z from "zod";
import { validateFloorplanBed, ValidationResult } from "../schemas/store.schema";
import { sessionStore } from "../store/zustandStore";
import { floorplanSpecsMissing } from "../utils/floorplanSpecsMissing";

// type Args = z.infer<typeof >;

export const handleGetFloorplanBed = async (
  args: any
): Promise<ValidationResult<any>> => {

  const { bed_min, bed_max } = args.data;

  const response = validateFloorplanBed({
    bed_min,
    bed_max,
  },
    `User select bed ${bed_min}, ${bed_max}`
  );

  const store = sessionStore.getState();

  store.setFloorplanBed({
    min: response.data.bed_min,
    max: response.data.bed_max,
  });

  return response;
};
