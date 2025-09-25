// src/mcp/tools/customizing.ts
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";

const ArgsSchema = z.object({
  sessionId: z.string().trim().min(1, "sessionId is required."),
  customizing: z.boolean().optional(),
  answer: z.string().optional(),
  label: z.string().optional(),
}).refine(d => d.customizing !== undefined || !!d.answer || !!d.label, {
  message: "Provide either 'customizing' boolean or a free-text 'answer/label'.",
  path: ["customizing"],
});

// normaliza yes/no desde answer/label
function normalizeBoolean(input?: { customizing?: boolean; answer?: string; label?: string }): boolean | undefined {
  if (typeof input?.customizing === "boolean") return input.customizing;

  const raw = String(input?.answer ?? input?.label ?? "").trim().toLowerCase();
  if (!raw) return undefined;

  const YES = [
    "yes", "y", "true", "sure", "definitely", "of course", "interested",
    "yes, interested in customizing"
  ];
  const NO = [
    "no", "n", "false", "not today", "not now", "nope", "nah", "skip",
    "no, not today"
  ];

  if (YES.some(k => raw.includes(k))) return true;
  if (NO.some(k => raw.includes(k))) return false;

  if (/\b(yes|true|interes|customiz)/.test(raw)) return true;
  if (/\b(no|false|not\s+(today|now)|skip)/.test(raw)) return false;

  return undefined;
}

type Args = z.infer<typeof ArgsSchema>;

export const handleCustomizing = (rawArgs: unknown) => {

  const pre = z.object({ sessionId: z.string().trim().min(1).optional() }).safeParse(rawArgs);
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

  const parsed = ArgsSchema.safeParse(rawArgs);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR",
      sessionId: pre.data.sessionId,
      issues: parsed.error.issues,
      message: "Invalid customizing arguments.",
    };
    }

  const { sessionId, customizing, answer, label } = parsed.data;
  const normalized = normalizeBoolean({ customizing, answer, label });

  if (typeof normalized === "undefined") {
    return {
      ok: false,
      error: "UNRECOGNIZED_SELECTION",
      sessionId,
      message: "Could not infer a boolean answer for customizing. Please ask the user a clear yes/no.",
    };
  }

  const store = useSessionStore();

  store.setCustomizing(normalized);

  return {
    ok: true,
    sessionId,
    saved: { customizing: normalized },
    suggest: {
      nextTool: "move_ins_render",
      reason: normalized
        ? "User is interested in customizing; continue with quick move-in preference."
        : "User is not interested in customizing; still proceed to quick move-in preference.",
    },
  };
}
