
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { validateSession } from "../utils/validateSession";
import { ValidationResult } from "../schemas/store.schema";


// type Args = z.infer<typeof ArgsSchema>;

export const handleGetRenting = async (args: any): Promise<ValidationResult<any>>  => {

 const parsed = args
  // validateBoolean(args);

 const { renting } = parsed.data;

  const store = useSessionStore();

  store.setRenting(renting);

  return {
success: true,
    code: 200,
    data: {
      renting
    },
    error: null,
    history: [],
    message: `User select interest to rent house boolean ${renting}`,
  };
};
