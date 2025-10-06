// src/mcp/tools/getName.ts

import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { createSessionId } from "../utils/createSessionId";
import {
  nameSchema,
  sessionIdSchema,
  validateName,
  ValidationResult,
} from "../schemas/store.schema";

export const argsSchema = sessionIdSchema.merge(nameSchema);

type Args = z.infer<typeof argsSchema>;

export const handleGetName = async (args: Args): Promise<ValidationResult<Args>> => {

  let { sessionId } = args;

  const parsed = validateName(args.name, "Mensaje");

  const { name } = parsed.data;

  const store = useSessionStore.getState();

  if (!sessionId) {
    sessionId = createSessionId();
    store.setSessionId(sessionId);
  }

  store.setName(name);

  return parsed;
};
};
