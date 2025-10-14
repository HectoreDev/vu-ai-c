// src/mcp/tools/getInterestRate.ts
import { z } from "zod";
import { sessionStore } from "../store/zustandStore";
import { InterestRate } from "../types/types";
import { validateSession } from "../utils/validateSession";
import { interestRateSchema, validateInterestRate, ValidationResult } from "../schemas/store.schema";


type Args = z.infer<typeof interestRateSchema>;

export const getInterestRateType = async (args: Args): Promise<ValidationResult<Args>>  => {

  const response = validateInterestRate(args.interestRateType, `User select interest rate ${args.interestRateType}`)

  const { interestRateType } = response.data

  const store = sessionStore.getState();

  store.setInterestRateType(interestRateType);

  return response;
}
