import type { SearchResponse } from "algoliasearch";
import { client } from "./client";
import { IFArgsSearch } from "../types/searchTypes";


export const queryDocument = async (
  args: IFArgsSearch
): Promise<SearchResponse<any>> => {
  const result = await client.searchSingleIndex({
    indexName: "community-by-AI",
    searchParams: {
      query: args.query,
      filters: args.filters,
      page: args.page,
      numericFilters: args.numericFilters,
    },
  });

  return result;
};
