import z from "zod";
import {
  amenitiesSchema,
  validateAmenities,
  ValidationResult,
} from "../schemas/store.schema";
import { sessionStore } from "../store/zustandStore";

type Args = z.infer<typeof amenitiesSchema>;

export const handleGetAmenities = async (
  args: Args
): Promise<ValidationResult<Args>> => {
  console.log('AMENITIES',args.amenities);

  const response = validateAmenities(
    args.amenities,
    `User select amenities ${args.amenities}`
  );

  const { amenities } = response.data;

  const store = sessionStore.getState();

  store.setAmenities(amenities);

  return response;
};
