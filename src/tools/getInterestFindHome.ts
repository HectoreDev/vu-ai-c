// src/mcp/tools/interestedFindHome.ts
import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { validateSession } from "../utils/validateSession";
import { ValidationResult } from "../schemas/store.schema";



// type Args = z.infer<typeof ArgsSchema>;

export const handleGetInterestFindHome = async (args: any): Promise<ValidationResult<any>> => {

 const parsed = args

  const {  interests } = parsed.data;

  const store = useSessionStore.getState();

  store.setInterest(interests);

  return {
    success: true,
    code: 200,
    data: {
      interests
    },
    error: null,
    history: [],
    message: `User select interest to find home, ${interests.toString()}`,
  };
};
