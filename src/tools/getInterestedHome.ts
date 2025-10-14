// src/mcp/tools/setInterestingHome.ts
import { z } from "zod";
import { sessionStore } from "./../store/zustandStore";
import { interestingHomeSchema, validateInterestingHome, ValidationResult } from "../schemas/store.schema";

type Args = z.infer<typeof interestingHomeSchema>;

export const handleGetInterestedHome = async (
  args: Args
): Promise<ValidationResult<Args>> => {
 
  const response = validateInterestingHome(args.interestedHome, ` User select home interest ${args.interestedHome}`);


  const store = sessionStore.getState();

  const { homeInterest } = response.data;

  store.setHomeInterest(homeInterest);

  return response;
};
