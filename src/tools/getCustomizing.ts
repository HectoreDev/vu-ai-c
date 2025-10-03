
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { ValidationResult } from "../schemas/store.schema";


// type Args = z.infer<typeof ArgsSchema>;

export const handleGetCustomizing = async (args: any): Promise<ValidationResult<any>>  => {
  const parsed = args
  // validateBoolean(args);

 const { customizing } = parsed.data;

  const store = useSessionStore();

  store.setCustomizing(customizing);

  return {
    success: true,
    code: 200,
    data: {
      customizing
    },
    error: null,
    history: [],
    message: `User select customizing boolean ${customizing}`,
  };
}
