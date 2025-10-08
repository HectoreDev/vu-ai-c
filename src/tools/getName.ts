// src/mcp/tools/getName.ts

import { z } from "zod";
import { sessionStore } from "../store/zustandStore";
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
console.log('Args', args);

  let { sessionId } = args;

  const response = validateName(args.name, `User name ${args.name}`);

  const { name } = response.data;

  const store = sessionStore.getState();

  if (!sessionId) {
    sessionId = createSessionId();
    store.setSessionId(sessionId);
  }

  console.log('Current Store SessionId', store.sessionId);

  store.setName(name);

  return response;
};
