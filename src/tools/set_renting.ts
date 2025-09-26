
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { validateSession } from "../utils/validateSession";

const ArgsSchema = z.object({
  sessionId: z.string().trim().min(1, "sessionId is required."),
  renting: z.boolean().optional(),
  answer:  z.string().optional(),
  label:   z.string().optional(),
}).refine(d => d.renting !== undefined || !!d.answer || !!d.label, {
  message: "Provide either 'renting' boolean or a free-text 'answer/label'.",
  path: ["renting"],
});

const normalizeRenting = (
  input?: { renting?: boolean; answer?: string; label?: string }
): boolean | undefined => {
  if (typeof input?.renting === "boolean") return input.renting;

  const raw = String(input?.answer ?? input?.label ?? "").trim().toLowerCase();
  if (!raw) return undefined;

  const YES = [
    "yes","y","true","include","show","feature","rent","rentals","for rent"
  ];

  const NO = [
    "no","n","false","not now","not this time","exclude","don't include","do not include","skip","remove"
  ];

  if (YES.some(k => raw.includes(k))) return true;
  if (NO.some(k => raw.includes(k)))  return false;


  if (/\b(yes|true|include|rent|renta|alquiler)/.test(raw)) return true;
  if (/\b(no|false|exclude|skip|remove|no\s+incluir|no\s+ahora)/.test(raw))  return false;

  return undefined;
};

type Args = z.infer<typeof ArgsSchema>;

export const handleSetRenting = async (rawArgs: Args) => {

   const pre = validateSession(rawArgs);
    if (!pre.ok) return pre;

  const parsed = ArgsSchema.safeParse(rawArgs);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      sessionId: pre.sessionId,
      issues: parsed.error.issues,
      message: "Invalid set_renting arguments.",
    };
  }

  const { sessionId, renting, answer, label } = parsed.data;
  const normalized = normalizeRenting({ renting, answer, label });

  if (typeof normalized === "undefined") {
    return {
      ok: false,
      error: "UNRECOGNIZED_SELECTION",
      sessionId,
      message: "Could not infer a boolean answer for renting. Please ask a clear yes/no.",
    };
  }

  const store = useSessionStore();

  store.setRenting(normalized);

  return {
    ok: true,
    sessionId,
    saved: { renting: normalized },
    // suggest: {
    //   nextTool: "floorplanSpecs_render",
    //   reason: "Renting preference saved; proceed to floorplan preferences.",
    // },
  };
};
