import { z } from "zod";
import { sessionStore } from "./../store/zustandStore";
import { validateSession } from "../utils/validateSession";
import {
  rentingSchema,
  validateRenting,
  ValidationResult,
} from "../schemas/store.schema";

type Args = z.infer<typeof rentingSchema>;

export const handleGetRenting = async (
  args: Args
): Promise<ValidationResult<Args>> => {
  const response = validateRenting(
    args.renting,
    `User select interest to rent house boolean ${args.renting}`
  );

  const { renting } = response.data;

  const store = sessionStore.getState();

  store.setRenting(renting);

  return response;
};
