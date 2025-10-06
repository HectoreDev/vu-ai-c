// src/mcp/tools/getInterestRate.ts
import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { InterestRate } from "../types/types";
import { validateSession } from "../utils/validateSession";
import { interestRateSchema, validateInterestRate, ValidationResult } from "../schemas/store.schema";


type Args = z.infer<typeof interestRateSchema>;

export const getInterestRateType = async (args: Args): Promise<ValidationResult<Args>>  => {

  const response = validateInterestRate(args.interestRate, `User select interest rate ${args.interestRate}`)

  const { interestRate } = response.data

  const store = useSessionStore();

  store.setInterestRate(interestRate);

  return response;
}
