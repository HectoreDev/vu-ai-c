// src/mcp/tools/moveInReady.ts
import { z } from "zod";
import { useSessionStore } from "../store/zustandStore";
import { validateSession } from "../utils/validateSession";
import {
  moveInReadySchema,
  validateMoveInReady,
  ValidationResult,
} from "../schemas/store.schema";

type Args = z.infer<typeof moveInReadySchema>;

export const handleGetMoveInReady = async (
  args: Args
): Promise<ValidationResult<Args>> => {
  const response = validateMoveInReady(
    args.moveInReady,
    `User select move in ready boolean ${args.moveInReady}`
  );

  const { moveInReady } = response.data;

  const store = useSessionStore();

  store.setMoveInReady(moveInReady);

  return response;
};
