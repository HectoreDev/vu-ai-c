import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { toArray } from "../utils/toArray";
import { validateSession } from "../utils/validateSession";

const ArgsSchema = z
  .object({
    sessionId: z.string().trim().min(1, "sessionId is required."),
    locations: z.union([z.array(z.string()), z.string()]),
  })
  .refine(
    (d) => {
      const hasLoc =
        typeof d.locations === "string"
          ? d.locations.trim().length > 0
          : Array.isArray(d.locations) && d.locations.length > 0;

      return hasLoc;
    },
    { message: "Provide at least one location.", path: ["locations"] }
  );

type Args = z.infer<typeof ArgsSchema>;

export const handleSetLocation = async (rawArgs: Args) => {
  const pre = validateSession(rawArgs);
  if (!pre.ok) return pre;

  const parsed = ArgsSchema.safeParse(rawArgs);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      sessionId: pre.sessionId,
      issues: parsed.error.issues,
      message: "Invalid get_location arguments.",
    };
  }

  const { locations, sessionId } = parsed.data;
  const locs = toArray(locations);

  const store = useSessionStore.getState();

  store.setlocations(locs);

  return {
    ok: true,
    sessionId,
    saved: { locs },
    // suggest: {
    //   nextTool: "budget_product_render",
    //   reason: "Locations saved; proceed to financing product selection.",
    // },
  };
};
