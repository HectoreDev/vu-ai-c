// src/mcp/tools/searchCommunities.ts
import { z } from "zod";
import { sessionStore } from "../store/zustandStore";

import { searchAlgolia } from "../functions/searchAlgolia";
import { createErrorResponse, ValidationResult } from "../schemas/store.schema";



type Args = z.infer<typeof undefined>;

export const handleSearchCommunities = async (): Promise<ValidationResult<Args>> => {

  const {
    locations,
    priceMin,
    priceMax,
    sessionId,
    setCommunities
  } = sessionStore.getState();

  if(Array.isArray(locations) && locations.length === 0 || !locations){
    return createErrorResponse(new Error("Locations is empty"))
  }

  const response = await searchAlgolia({
    location: locations,
    priceMin,
    priceMax
  });

  setCommunities(response.data)

  return {
    success: true,
    code: 200,
    data: response.data,
    history: [],
    error: null,
    message: `Comunities search`,
    suggest: null
  }

};
