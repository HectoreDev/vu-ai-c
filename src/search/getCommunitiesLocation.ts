import z from "zod";
import { createErrorResponse, ValidationResult } from "../schemas/store.schema";
import { sessionStore } from "../store/zustandStore";
import { IFTypeCommunity } from "../types/communityTypes";
import { IFLocation } from "../types/types";
import { queryDocument } from "./search";


type Args = z.infer<typeof undefined>;

export const getCommunitiesLocation = async (): Promise<
  ValidationResult<Args>
> => {
  const { latitude, longitude } = sessionStore.getState();

  // Validar que tengamos las coordenadas
  if (typeof latitude !== "number" || typeof longitude !== "number" || isNaN(latitude) || isNaN(longitude)) {
    throw new Error("Latitude and longitude are required for geolocation search");
  }

  const searchParams = {
    aroundLatLng: `${latitude}, ${longitude}`,
    aroundRadius: 100000
  };

  console.log('Search params', searchParams);

  const result = await queryDocument({
    query: '',
    facetType: 'objectType:community',
    filters: '',
    numericFilters: [],
    searchParams: searchParams
  });

  console.log('Result from communities location query', result);

  return {
    success: true,
    code: 200,
    data: result[0].facetHits,
    history: [],
    error: null,
    message: `Communities found near location (${latitude}, ${longitude})`,
    suggest: null,
  };
};
