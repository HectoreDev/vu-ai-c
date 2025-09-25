// src/mcp/tools/getName.ts
import crypto from "node:crypto";
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";


const ArgsSchema = z.object({
  sessionId: z.string().trim().min(1).optional(),
  name: z.string().transform((s) => s?.trim() ?? ""),
});

function genSessionId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

type Args = z.infer<typeof ArgsSchema>;

export const handleSetName = async (args: Args) => {
  const parsed = ArgsSchema.safeParse(args);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      issues: parsed.error.flatten(),
    };
  }

  let { sessionId, name } = parsed.data;

  if (!sessionId) sessionId = genSessionId();

  const store = useSessionStore();

  store.setName(name);

  return {
    ok: true,
    sessionId,
    state: store,
    saved: {
      name,
    },
    // suggest: {
    //   nextTool: "interest_home_render",
    //   reason: "Name captured; proceed to ask for motivations/interests.",
    // },
  };
};
