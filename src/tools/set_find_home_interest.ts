// src/mcp/tools/interestedFindHome.ts
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";

const InterestAsArray = z
  .union([z.array(z.string()), z.string()])
  .transform(v => (Array.isArray(v) ? v : [v]))
  .pipe(z.array(z.string().min(1)).min(1));

const ArgsSchema = z.object({
  sessionId: z.string().trim().min(1, "sessionId is required."),
  interest: InterestAsArray,
});

type Args = z.infer<typeof ArgsSchema>;

export const handleInterestedFindHome = async (rawArgs: Args) => {

  const pre = z
    .object({ sessionId: z.string().trim().min(1).optional() })
    .safeParse(rawArgs);
  if (!pre.success || !pre.data.sessionId) {
    return {
      ok: false,
      error: "MISSING_SESSION",
      message: "Missing sessionId. Ask for the user's name to start a session.",
      suggest: {
        nextTool: "get_name",
        reason: "Capture the user's name to create or resume a session.",
      },
    };
  }

  const parsed = ArgsSchema.safeParse(rawArgs);

  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      sessionId: pre.data.sessionId,
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

  const store = useSessionStore();

  store.setInterestHome(interest);

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
