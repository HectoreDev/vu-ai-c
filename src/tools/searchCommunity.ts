// src/mcp/tools/searchCommunities.ts
import { z } from "zod";
import { sessionStore } from "../store/zustandStore";

import { searchAlgolia } from "../functions/searchAlgolia";
import { createErrorResponse, ValidationResult } from "../schemas/store.schema";
import { getCommunitiesPrices } from "../search/getCommunitiesPrices";

type Args = z.infer<typeof undefined>;

export const searchCommunities = async (): Promise<
  ValidationResult<Args>
> => {
  const { locations, setCommunities, communities } = sessionStore.getState();

  if ((Array.isArray(locations) && locations.length === 0) || !locations) {
    return createErrorResponse(new Error("Locations is empty"));
  }

  console.log("Searching communities for locations:", locations);

  const response = await getCommunitiesPrices(locations);

  const comunityMerge = Array.isArray(communities) ? communities : [];

  if (response) {
    setCommunities(Array.from(new Set([...response, ...comunityMerge])));
  }

  return {
    success: true,
    code: 200,
    data: response,
    history: [],
    error: null,
    message: `Comunities search`,
    suggest: null,
  };
};
