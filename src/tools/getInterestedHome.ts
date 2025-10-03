// src/mcp/tools/setInterestingHome.ts
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { ValidationResult } from "../schemas/store.schema";

const asStringOrArray = z.union([z.string(), z.array(z.string())]);

// type Args = z.infer<typeof ArgsSchema>;

export const handleGetInterestedHome = async (
  args: any
): Promise<ValidationResult<any>> => {
  const parsed = args;

  const store = useSessionStore();

  const { homeInterest } = parsed;

  store.setHomeInterest(homeInterest);

  return {
    success: true,
    code: 200,
    data: {
      homeInterest,
    },
    error: null,
    history: [],
    message: `User select home interest ${homeInterest.toString()}`,
  };
};
