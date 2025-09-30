// src/mcp/tools/getName.ts

import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { dataFakeCommunities } from "../db/db.testhouse";
//import { ArgsName } from "../utils/validations";
import { ToolResponse } from "../types/types";
import { createSessionId } from "../utils/createSessionId";
import { validateName } from "../schemas/store.schema";

//type Args = z.infer<typeof ArgsName>;

export const handleGetName = async (args: string): Promise<ToolResponse> => {
  const parsed = validateName(args);

  let { sessionId, name } = parsed.data;

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
