import { sessionStore } from "../store/zustandStore";
import { IFTypeCommunity } from "../types/communityTypes";
import { IFLocation } from "../types/types";
import { queryDocument } from "./search";

export const getCommunitiesPrices = async (
  locations: IFLocation[]
): Promise<null | IFTypeCommunity[]> => {

  const {
    setPriceMin,
    setPriceMax
  } = sessionStore.getState();

  const facetType = 'objectType:community';

  const facetFilters = [];

  for (let i = 0; i < locations.length; i++) {
    const { location, state } = locations[i];
    if (location) {
      facetFilters.push(`city:${location}`);
    } else if (state) {
      facetFilters.push(`state:${state}`);
    }
  }

  const result = await queryDocument({
    facetType,
    query: "",
    filters: facetFilters,
  });

  // @ts-ignore
  const hits = result[0].hits;

  if (hits.length === 0) return null;

  const { priceMax, priceMin } = hits.reduce(
    (acc: any, hit: any) => ({
      priceMin:
        hit.priceMin > 0
          ? acc.priceMin === 0
            ? hit.priceMin
            : Math.min(acc.priceMin, hit.priceMin)
          : acc.priceMin,
      priceMax: Math.max(acc.priceMax, hit.priceMax),
    }),
    { priceMin: Infinity, priceMax: 0 }
  );

  setPriceMin(priceMin);
  setPriceMax(priceMax);

  return hits as IFTypeCommunity[];
};
