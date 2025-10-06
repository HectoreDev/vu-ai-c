import z from "zod"
import { amenitiesSchema, validateAmenities, ValidationResult } from "../schemas/store.schema"
import { useSessionStore } from "../store/zustandStore"


type Args = z.infer<typeof amenitiesSchema>

export const handleGetAmenities = async (
  args: Args
): Promise<ValidationResult<Args>> => {

  const parsed = validateAmenities(args.amenities, "Mensaje")

  const { amenities } = parsed.data;

  const store = useSessionStore.getState();

  store.setAmenities(amenities);

  return {
    success: true,
    code: 200,
    data: {
      amenities,
    },
    error: null,
    history: [],
    message: `User select amenities ${amenities}`,
  }

}