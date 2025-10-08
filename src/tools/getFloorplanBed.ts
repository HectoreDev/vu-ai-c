import z from "zod";
import { floorplanBedSchema, validateFloorplanBed, ValidationResult } from "../schemas/store.schema";
import { sessionStore } from "../store/zustandStore";

type Args = z.infer<typeof floorplanBedSchema>;

export const handleGetFloorplanBed = async (
  args: Args
): Promise<ValidationResult<Args>> => {

  const response = validateFloorplanBed({
    bed_max: args.bed_max,
    bed_min: args.bed_min
  }, `User select number beds ${args.bed_min}, ${args.bed_max} `);

  const { bed_min, bed_max } = response.data;

  const store = sessionStore.getState();

  store.setFloorplanBed({
    min: bed_min,
    max: bed_max
  });

  return response;
};
