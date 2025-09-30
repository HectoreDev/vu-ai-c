// src/mcp/tools/interestedFindHome.ts
import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { validateSession } from "../utils/validateSession";

const InterestAsArray = z
  .union([z.array(z.string()), z.string()])
  .transform(v => (Array.isArray(v) ? v : [v]))
  .pipe(z.array(z.string().min(1)).min(1));

const ArgsSchema = z.object({
  sessionId: z.string().trim().min(1, "sessionId is required."),
  interest: InterestAsArray,
});

type Args = z.infer<typeof ArgsSchema>;

export const handleGetInterestFindHome = async (rawArgs: Args) => {

  const pre = validateSession(rawArgs);
  if (!pre.ok) return pre;

  const parsed = ArgsSchema.safeParse(rawArgs);

  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      sessionId: pre.sessionId,
      issues: parsed.error.issues,
      message: "Invalid interesed_find_home arguments.",
    };
  }

  const { sessionId, interest } = parsed.data;

  if (!interest.length) {
    return {
      ok: false,
      error: "NO_INTERESTS",
      sessionId,
      message: "No valid interests could be inferred from the provided input.",
    };
  }

  const store = useSessionStore.getState();

  store.setHomeInterest(interest);

  return {
    ok: true,
    sessionId,
    saved: { interest },
    // suggest: {
    //   nextTool: "get_location",
    //   reason: "Interests saved; proceed to capture locations.",
    // },
  };
};
