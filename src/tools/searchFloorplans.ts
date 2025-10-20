// src/mcp/tools/searchCommunities.ts
import { z } from "zod";
import { sessionStore } from "../store/zustandStore";

import { searchAlgolia } from "../functions/searchAlgolia";
import { createErrorResponse, ValidationResult } from "../schemas/store.schema";
import { getFloorplans } from "../search/getFloorplans";

type Args = z.infer<typeof undefined>;

export const searchCommunities = async (): Promise<
  ValidationResult<Args>
> => {
  const { locations, setFloorplanBath, setFloorplanBed, setFloorplanGarage, setFloorplanLevel, setFloorplanSqft } = sessionStore.getState();

  if ((Array.isArray(locations) && locations.length === 0) || !locations) {
    return createErrorResponse(new Error("Locations is empty"));
  }

  console.log("Searching communities for locations:", locations);

  const response = await getFloorplans(locations);

  //validar la informacion y guardar en el store


  return {
    success: true,
    code: 200,
    data: response,
    history: [],
    error: null,
    message: `Floorplans search`,
    suggest: null,
  };
};
