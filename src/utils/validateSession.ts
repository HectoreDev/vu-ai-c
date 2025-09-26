
import { z } from "zod";

export type MissingSessionError = {
  ok: false;
  error: "MISSING_SESSION";
  message: string;
  suggest: {
    nextTool: string;
    reason: string;
  };
};

export type SessionOk = {
  ok: true;
  sessionId: string;
};

export type SessionGuard = SessionOk | MissingSessionError;

export const sessionIdOptionalSchema = z.object({
  sessionId: z.string().trim().min(1).optional(),
});


export const validateSession = (rawArgs: unknown): SessionGuard => {
  const pre = sessionIdOptionalSchema.safeParse(rawArgs);

  if (!pre.success || !pre.data.sessionId) {
    return {
      ok: false,
      error: "MISSING_SESSION",
      message: "Missing sessionId. Ask for the user's name to start a session.",
      suggest: {
        nextTool: "get_name_render",
        reason: "Capture the user's name to create or resume a session.",
      },
    };
  }

  return { ok: true, sessionId: pre.data.sessionId };
};
