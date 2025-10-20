// src/mcp/tools/interestedFindHome.ts
import { z } from "zod";
import { sessionStore } from "../store/zustandStore";
import { validateSession } from "../utils/validateSession";
import {
  interestFindHomeSchema,
  validateInterestedFindHome,
  ValidationResult,
} from "../schemas/store.schema";

type Args = z.infer<typeof interestFindHomeSchema>;

export const handleGetInterestFindHome = async (
  args: Args
): Promise<ValidationResult<Args>> => {


  const response = validateInterestedFindHome(
    args.interestFindHome,
    `User select interest to find home, ${args.interestFindHome}`
  );

  const { interestFindHome } = response.data;

  const store = sessionStore.getState();

  store.setInterestFindHome(interestFindHome);

  return response;
};
