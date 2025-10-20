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

  // const getLocations = locations.map((loc, i) => {
  //   const isFirts = i === 0 ? "" : "OR";

  //   if (loc.location) {
  //     return `city:"${isFirts}${loc.location}"`;
  //   } else {
  //     return `state:"${isFirts}${loc.state}"`;
  //   }
  // });

  //const filtersLocation =
  //  getLocations.length > 0 ? `AND ${getLocations.toString()}` : "";

  // const filters = `(objectType:community ${filtersLocation})`;

  const faceType = 'objectType:community';

  const facetFilters = [];

  console.log('Locations to get community prices', locations);

  for (let i = 0; i < locations.length; i++) {
    const { location, state } = locations[i];
    if (location) {
      facetFilters.push(`city:${location}`);
    } else if (state) {
      facetFilters.push(`state:${state}`);
    }
  }

  console.log('Filters for community prices', facetFilters);

  const result = await queryDocument({
    faceType,
    query: "",
    filters: facetFilters,
  });

  console.log('Result from community prices query', result);

  // @ts-ignore
  const hits = result[0].hits;

  if (hits.length === 0) return null;

const { priceMax, priceMin } = hits.reduce(
  (acc:any, hit:any) => ({
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
