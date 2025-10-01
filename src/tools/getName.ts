// src/mcp/tools/getName.ts

import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { ToolResponse } from "../types/types";
import { createSessionId } from "../utils/createSessionId";
import {
  nameSchema,
  sessionIdSchema,
  validateName,
} from "../schemas/store.schema";

export const argsSchema = sessionIdSchema.merge(nameSchema);

type Args = z.infer<typeof argsSchema>;

export const handleGetName = async (args: Args): Promise<ToolResponse> => {
  
  let { sessionId } = args;

  const parsed = validateName(args.name);

  const { name } = parsed.data;

  const store = useSessionStore.getState();

  if (!sessionId) {
    sessionId = createSessionId();
    store.setSessionId(sessionId);
  }

  store.setName(name);

  return {
    success: true,
    text: name,
    options: {
      saved: {
        name,
        sessionId,
      },
    },
  };
};
