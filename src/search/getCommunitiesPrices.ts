import { sessionStore } from "../store/zustandStore";
import { IFTypeCommunity } from "../types/communityTypes";
import { IFLocation } from "../types/types";
import { queryDocument, testPerfectMatch } from "./search";

export const getCommunitiesPrices = async (
  locations: IFLocation[]
): Promise<null | IFTypeCommunity[]> => {

  const {
    setPriceMin,
    setPriceMax,
    setLots
  } = sessionStore.getState();

  const queryArgs = sessionStore.getState().toQuery();
  const result = await queryDocument(queryArgs);

  // Safely access hits from the first element of result if it exists and has hits.
  const hits =
    Array.isArray(result) &&
      result[0] &&
      Array.isArray((result[0] as any).hits)
      ? (result[0] as any).hits
      : [];

  if (!Array.isArray(hits) || hits.length === 0) return null;

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

  // for testing
  const lots = testPerfectMatch();
  if(lots.length > 0) setLots(lots);

  setPriceMin(priceMin);
  setPriceMax(priceMax);

  return hits as IFTypeCommunity[];
};
