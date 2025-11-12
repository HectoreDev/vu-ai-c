import { sessionStore } from "../store/zustandStore";
import { IFTypeCommunity } from "../types/communityTypes";
import { IFLocation } from "../types/types";
import { queryDocument } from "./search";

export const getFloorplans = async (
    locations?: IFLocation[],
    priceMin?: number,
    priceMax?: number
): Promise<null | IFTypeCommunity[]> => {

    const {
        setPriceMin,
        setPriceMax
    } = sessionStore.getState();

    // Usar los parámetros opcionales o los valores del store
    const finalPriceMin = priceMin !== undefined ? priceMin : sessionStore.getState().priceMin;
    const finalPriceMax = priceMax !== undefined ? priceMax : sessionStore.getState().priceMax;
    const finalLocations = locations || sessionStore.getState().locations || [];

    const faceType = 'objectType:community';

    const facetFilters = [];
    const numericFilters = [];

    console.log('Locations to get floorplans', finalLocations);
    console.log('Price range for floorplans', { priceMin: finalPriceMin, priceMax: finalPriceMax });

    // Agregar filtros de ubicación si están disponibles
    for (let i = 0; i < finalLocations.length; i++) {
        const { location, state } = finalLocations[i];
        if (location) {
            facetFilters.push(`city:${location}`);
        } else if (state) {
            facetFilters.push(`state:${state}`);
        }
    }

    // Agregar filtros numéricos de precio si están disponibles
    if (finalPriceMin !== undefined && finalPriceMin > 0) {
        numericFilters.push(`priceMin >= ${finalPriceMin}`);
    }

    if (finalPriceMax !== undefined && finalPriceMax > 0) {
        numericFilters.push(`priceMax <= ${finalPriceMax}`);
    }

    console.log('Filters for floorplans', facetFilters);
    console.log('Numeric filters for floorplans', numericFilters);

    const result = await queryDocument({
        facetType: faceType,
        query: "",
        filters: facetFilters,
        numericFilters: numericFilters.length > 0 ? numericFilters : undefined,
    });

    console.log('Result from floorplans query', result);

    // @ts-ignore
    const hits = result[0].hits;

    if (hits.length === 0) return null;

    // Si no se proporcionaron precios como parámetros, actualizar el store con los precios encontrados
    if (priceMin === undefined && priceMax === undefined) {
        const { priceMax: foundPriceMax, priceMin: foundPriceMin } = hits.reduce(
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

        setPriceMin(foundPriceMin);
        setPriceMax(foundPriceMax);
    }

    return hits as IFTypeCommunity[];
};
