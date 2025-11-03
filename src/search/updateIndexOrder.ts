import type { SearchResponse } from "algoliasearch";
import { client } from "./client";
import { IFArgsSearch } from "../types/searchTypes";

export const updateIndexOrder = async (
    args: IFArgsSearch
): Promise<SearchResponse<unknown>> => {


    const result = client.setSettings({
        indexName: "community-by-AI",
        indexSettings: {
            searchableAttributes: ['city', 'state', 'objectType', 'geolocation'],
            customRanking: ['city', 'state', 'objectType', 'geolocation']
        }
    });

    return result as unknown as SearchResponse<unknown>;
};