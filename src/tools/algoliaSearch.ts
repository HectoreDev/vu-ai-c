import { algoliasearch } from "algoliasearch";
const client = algoliasearch('5WEGK1QY4E', '41716df1c4ed609036405ed46647e5df');  

export interface IFAlgoliaSearchProps {
    uid: string;
    name?: string;
    location: string;
    priceMin?: number;
    priceMax?: number; 
}

// Interfaces para la respuesta de Algolia
export interface AlgoliaHighlightResult {
    value: string;
    matchLevel: string;
    matchedWords: string[];
    fullyHighlighted?: boolean;
}

export interface AlgoliaCommunityOrigin {
    uid: string;
    name: string;
}

export interface AlgoliaDivisionOrigin {
    uid: string;
    name: string;
    state: string;
}

export interface AlgoliaOrigin {
    community: AlgoliaCommunityOrigin;
    division: AlgoliaDivisionOrigin;
}

export interface AlgoliaPrice {
    priceMin: number;
    priceMax: number;
}

export interface AlgoliaHighlightResults {
    uid: AlgoliaHighlightResult;
    divisionUID: AlgoliaHighlightResult;
    amenities: AlgoliaHighlightResult[];
    _origin: {
        community: {
            name: AlgoliaHighlightResult;
        };
        division: {
            uid: AlgoliaHighlightResult;
        };
    };
}

export interface AlgoliaCommunityResult {
    uid: string;
    divisionUID: string;
    status: string;
    name: string;
    amenities: string[];
    price: AlgoliaPrice;
    _origin: AlgoliaOrigin;
    objectID: string;
    _highlightResult: AlgoliaHighlightResults;
}

export type AlgoliaSearchResult = AlgoliaCommunityResult[];

export const makeLLMAlgoliaRequest = async (data: IFAlgoliaSearchProps): Promise<AlgoliaSearchResult | null> => {

    let queryLocation = data.location || '';

    let numericFiltersPrice : string[]= [];
    if (data.priceMin) { 
        numericFiltersPrice.push(`priceMax:>=${data.priceMin}`);
    }
    if (data.priceMax) {
        numericFiltersPrice.push(`priceMax:>=${data.priceMax}`);
    }
   
    try { // Implementa la lógica real de búsqueda con Algolia
        const search = await client.search({
            requests: [
                {
                    indexName: 'communities-gemini',
                    query: queryLocation,
                    numericFilters: numericFiltersPrice,
                    hitsPerPage: 1
                },
            ]
        });
        console.log("search", JSON.stringify(search))
        if (search?.results?.[0] && 'hits' in search.results[0] && search.results[0].hits?.[0]) {
            return search.results[0].hits as unknown as AlgoliaSearchResult;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error in Algolia request:", error);
        return null;
    }
}