// src/mcp/tools/getName.ts
import * as crypto from "node:crypto";
import { z } from "zod";
import { useSessionStore } from "./../store/zustandStore";
import { dataFakeCommunities } from "../db/db.testhouse";

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

  const store = useSessionStore.getState();

  store.setName(name);
  store.setSessionId(sessionId);

  const hits = dataFakeCommunities;

  const listOfHouse: { type: 'text', text: string }[] = hits.map((lot:any) => {

    const specs = JSON.stringify(lot.amenities);

    return {
      type: "text",
      text: `Encontramos en las siguiente comunidades ${lot._origin.community.name}, con el UID ${lot._origin.community.uid}, en la ciudad de ${lot._origin.division.name}, con las siguientes amenidades: ${specs}`,
    }
  })

  console.log("store2", store.name, store.sessionId);

  return listOfHouse
};
