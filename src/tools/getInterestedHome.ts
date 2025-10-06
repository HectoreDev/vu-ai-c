// src/mcp/tools/setInterestingHome.ts
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { interestingHomeSchema, validateInterestingHome, ValidationResult } from "../schemas/store.schema";

const asStringOrArray = z.union([z.string(), z.array(z.string())]);

type Args = z.infer<typeof interestingHomeSchema>;

export const handleGetInterestedHome = async (
  args: Args
): Promise<ValidationResult<Args>> => {
  const response = validateInterestingHome(args.interestingHome,` User select home interest ${args.interestingHome.toString()}`);

  const store = useSessionStore();

  const { homeInterest } = response.data;

  store.setHomeInterest(homeInterest);

  return response;
};
