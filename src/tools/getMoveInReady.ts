// src/mcp/tools/moveInReady.ts
import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { validateSession } from "../utils/validateSession";

const ArgsSchema = z.object({
  sessionId: z.string().trim().min(1, "sessionId is required."),
  moveInReady: z.boolean().optional(),
  answer: z.string().optional(),
  label: z.string().optional(),
}).refine(d => d.moveInReady !== undefined || !!d.answer || !!d.label, {
  message: "Provide either 'moveInReady' boolean or a free-text 'answer/label'.",
  path: ["moveInReady"],
});

function normalizeMoveInReady(input?: { moveInReady?: boolean; answer?: string; label?: string }): boolean | undefined {
  if (typeof input?.moveInReady === "boolean") return input.moveInReady;

  const raw = String(input?.answer ?? input?.label ?? "").trim().toLowerCase();
  if (!raw) return undefined;

  const YES = [
    "yes","y","true","include","show","feature","quick move-in","quick move in","ready now",
    "inventory home","spec home","include qmi","yes, include"
  ];
  const NO = [
    "no","n","false","not now","not this time","exclude","don't include","do not include","skip","remove"
  ];

  if (YES.some(k => raw.includes(k))) return true;
  if (NO.some(k => raw.includes(k))) return false;

  if (/\b(yes|true|include|quick|ready|incluye|incluir|mudanza)/.test(raw)) return true;
  if (/\b(no|false|exclude|skip|remove|no\s+incluir|no\s+ahora)/.test(raw)) return false;

  return undefined;
}

type Args = z.infer<typeof ArgsSchema>;

export const handleGetMoveInReady = async (rawArgs: Args) => {

   const pre = validateSession(rawArgs);
    if (!pre.ok) return pre;

  const parsed = ArgsSchema.safeParse(rawArgs);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      sessionId: pre.sessionId,
      issues: parsed.error.issues,
      message: "Invalid move_in_ready arguments.",
    };
  }

  const { sessionId, moveInReady, answer, label } = parsed.data;
  const normalized = normalizeMoveInReady({ moveInReady, answer, label });

  if (typeof normalized === "undefined") {
    return {
      ok: false,
      error: "UNRECOGNIZED_SELECTION",
      sessionId,
      message: "Could not infer a boolean answer for quick move-in. Please ask a clear yes/no.",
    };
  }

  const store = useSessionStore();

 store.setMoveInReady(normalized);

  return {
    ok: true,
    sessionId,
    saved: { moveInReady: normalized },
    suggest: {
      nextTool: "renting_render",
      reason: "Quick move-in preference saved; proceed to renting preference.",
    },
  };
}
