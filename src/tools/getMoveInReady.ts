// src/mcp/tools/moveInReady.ts
import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { validateSession } from "../utils/validateSession";
import { ValidationResult } from "../schemas/store.schema";

// type Args = z.infer<typeof ArgsSchema>;

export const handleGetMoveInReady = async (
  args: any
): Promise<ValidationResult<any>> => {
  const parsed = args;
  // validateBoolean(args);

  const { moveInReady } = parsed.data;

  const store = useSessionStore();

  store.setMoveInReady(moveInReady);

  return {
    success: true,
    code: 200,
    data: {
      moveInReady,
    },
    error: null,
    history: [],
    message: `User select move in ready boolean ${moveInReady}`,
  };
};
