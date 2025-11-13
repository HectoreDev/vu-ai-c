import type { SearchResponse, SearchResult } from "algoliasearch";
import { client } from "./client";
import { IFArgsSearch } from "../types/searchTypes";

export const queryDocument = async (
  args: IFArgsSearch
): Promise<SearchResult<unknown>[]> => {

  const requests = [
    {
      indexName: args.indexName || "community-by-AI",
      query: args.query,
      facetFilters: [args.facetType, ...args.filters],
      numericFilters: args.numericFilters,
      hitsPerPage: 2,
      ...(args.searchParams && { searchParams: args.searchParams })
    },
  ];

  console.log('Requests', JSON.stringify(requests, null, 2));
  console.log('Search params', JSON.stringify(args.searchParams, null, 2));
  const result = await client.search({
    requests: requests
  });
  console.log('Result', JSON.stringify(result, null, 2));
  return result.results;
};

export const testPerfectMatch = (): any[] => {

  

  return [
    {
      "lotUID": "5e675f6f-b0a3-44dd-a75c-52a00352bbc8",
      "address": null,
      "price": 500000,
      "segmentUID": "seg-4044",
      "uid": "kR1CtiAHdFBhpNBrtwKR",
      "collectionUID": "b3d61bdb-997e-4032-9eb0-f3ed07053713",
      "reservationCost": 100,
      "status": "available",
      "orientation": "left",
      "cost": null,
      "flag_isFeatured": false,
      "size": null,
      "flag_lowIncome": false,
      "flag_hasBasement": false,
      "homeOrientation": "southEast",
      "plans": {
        "V5LiWv2ttIbFkXVuPhy2": {
          "floorplanUID": "t7VQ7xWV6EY2rmufKkMK",
          "basegroupUID": "V5LiWv2ttIbFkXVuPhy2",
          "diagramUID": "HVfDmF1v3lMM3T93OYvO"
        }
      },
      "needPlan": true,
      "plansArray": [
        "t7VQ7xWV6EY2rmufKkMK"
      ],
      "objectID": "7168480000"
    }
  ]

};
