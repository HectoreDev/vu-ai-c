import z from "zod"
import { amenitiesSchema, validateAmenities, ValidationResult } from "../schemas/store.schema"
import { useSessionStore } from "../store/zustandStore"


type Args = z.infer<typeof amenitiesSchema>

export const handleGetAmenities = async (
  args: Args
): Promise<ValidationResult<Args>> => {

  const response = validateAmenities(args.amenities, `User select amenities ${args.amenities}`)

  const { amenities } = response.data;

  const store = useSessionStore.getState();

  store.setAmenities(amenities);

  return response;

}