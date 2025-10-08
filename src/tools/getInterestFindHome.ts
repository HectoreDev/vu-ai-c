// src/mcp/tools/interestedFindHome.ts
import { z } from "zod";
import { sessionStore } from "../store/zustandStore";
import { validateSession } from "../utils/validateSession";
import { interestedFindHomeSchema, validateInterestedFindHome, ValidationResult } from "../schemas/store.schema";



type Args = z.infer<typeof interestedFindHomeSchema>;

export const handleGetInterestFindHome = async (args: Args): Promise<ValidationResult<Args>> => {

 const response = validateInterestedFindHome(args.interestedFindHome, `User select interest to find home, ${args.interestedFindHome.toString()}`); 

  const { interests } = response.data;

  const store = sessionStore.getState();

  store.setInterest(interests);

  return response
};
