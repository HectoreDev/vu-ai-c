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
      facetFilters: [args.facetType, ...args.filters],
      numericFilters: args.numericFilters,
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
