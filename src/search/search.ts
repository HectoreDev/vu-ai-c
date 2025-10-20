import type { SearchResponse, SearchResult } from "algoliasearch";
import { client } from "./client";
import { IFArgsSearch } from "../types/searchTypes";

export const queryDocument = async (
  args: IFArgsSearch
): Promise<SearchResult<unknown>[]> => {

  const requests = [
    {
      indexName: "community-by-AI",
      query: args.query,
      facetFilters: [ args.faceType, args.filters],
      numericFilters: args.numericFilters,
    },
  ];

  const result = await client.search({
    requests: requests
  });

  return result.results;
};
