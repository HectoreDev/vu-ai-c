// src/mcp/tools/getName.ts

import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { dataFakeCommunities } from "../db/db.testhouse";
//import { ArgsName } from "../utils/validations";
import { ToolResponse } from "../types/types";
import { createSessionId } from "../utils/createSessionId";
import { validateName } from "../schemas/store.schema";

//type Args = z.infer<typeof ArgsName>;

export const handleGetName = async (args: { name: string }): Promise<ToolResponse> => {
  console.log('args', args);
  const parsed = validateName(args.name);
  console.log('parsed', parsed);
  let { sessionId, name } = parsed.data;
  console.log('sessionId', sessionId);
  console.log('name', name);
  const store = useSessionStore.getState();
  console.log('store', store);
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
