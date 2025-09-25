import { AlgoliaCommunityResult, AlgoliaSearchResult, IFAlgoliaSearchProps, makeLLMAlgoliaRequest } from "../tools/algoliaSearch";
import { getDivisionByName } from "../tools/utilities";
import { algoliasearch } from "algoliasearch";

// Cliente de Algolia
const client = algoliasearch('5WEGK1QY4E', '41716df1c4ed609036405ed46647e5df');

// Interfaz extendida para filtros más flexibles
export interface AlgoliaSearchFilters {
    // Campos básicos requeridos
    sessionId: string;
    location: string;

    // Filtros de precio
    priceMin?: number;
    priceMax?: number;

    // Filtros adicionales
    amenities?: string[];
    communities?: string[];
    status?: string;

    // Configuración de búsqueda
    indexName?: string;
    hitsPerPage?: number;
    query?: string;

    // Filtros numéricos adicionales
    numericFilters?: string[];

    // Filtros de facetas
    facetFilters?: string[];
}

// Interfaz para la respuesta de la búsqueda general
export interface AlgoliaGeneralResponse<T = AlgoliaCommunityResult[]> {
    success: boolean;
    data?: T;
    error?: string;
    metadata?: {
        totalHits: number;
        hitsPerPage: number;
        query: string;
        location: string;
        appliedFilters: string[];
    };
}

/**
 * Función general para realizar búsquedas en Algolia con filtros flexibles
 * @param filters - Filtros de búsqueda configurables
 * @returns Respuesta con datos o error
 */
export const searchAlgolia = async (filters: AlgoliaSearchFilters): Promise<AlgoliaGeneralResponse> => {
    try {
        // Validaciones básicas
        if (!filters.location || !filters.sessionId) {
            return {
                success: false,
                error: "sessionId y location son requeridos"
            };
        }

        // Obtener información de la división/ubicación
        const divisionObj = getDivisionByName(filters.location);
        if (!divisionObj) {
            return {
                success: false,
                error: `División no encontrada para la ubicación: ${filters.location}`
            };
        }

        // Construir filtros numéricos
        const numericFilters: string[] = [...(filters.numericFilters || [])];

        if (filters.priceMin !== undefined) {
            numericFilters.push(`PriceMin>=${filters.priceMin}`);
        }

        if (filters.priceMax !== undefined) {
            numericFilters.push(`PriceMax<=${filters.priceMax}`);
        }

        // Construir filtros de facetas
        const facetFilters: string[] = [...(filters.facetFilters || [])];

        if (filters.status) {
            facetFilters.push(`status:${filters.status}`);
        }

        if (filters.amenities && filters.amenities.length > 0) {
            // Para amenidades, usamos OR entre ellas
            filters.amenities.forEach(amenity => {
                facetFilters.push(`amenities:${amenity}`);
            });
        }

        if (filters.communities && filters.communities.length > 0) {
            // Para comunidades, usamos OR entre ellas  
            filters.communities.forEach(community => {
                facetFilters.push(`_origin.community.name:${community}`);
            });
        }

        // Configuración de búsqueda
        const searchConfig = {
            indexName: filters.indexName || 'communities-gemini-test',
            query: filters.query || divisionObj.id,
            hitsPerPage: filters.hitsPerPage || 10,
            numericFilters: numericFilters.length > 0 ? numericFilters : undefined,
            facetFilters: facetFilters.length > 0 ? facetFilters : undefined,
        };

        console.log('🔍 Algolia Search Config:', JSON.stringify(searchConfig, null, 2));

        // Realizar búsqueda
        const searchResponse = await client.search({
            requests: [searchConfig]
        });

        // Validar respuesta
        if (!searchResponse?.results?.[0] || !('hits' in searchResponse.results[0])) {
            return {
                success: false,
                error: "No se encontraron resultados"
            };
        }

        const result = searchResponse.results[0];
        const hits = result.hits as unknown as AlgoliaCommunityResult[];

        if (!hits || hits.length === 0) {
            return {
                success: false,
                error: "No se encontraron comunidades que coincidan con los filtros"
            };
        }

        return {
            success: true,
            data: hits,
            metadata: {
                totalHits: result.nbHits || 0,
                hitsPerPage: result.hitsPerPage || 0,
                query: searchConfig.query,
                location: filters.location,
                appliedFilters: [
                    ...numericFilters,
                    ...facetFilters.flat()
                ]
            }
        };

    } catch (error) {
        console.error('❌ Error en búsqueda de Algolia:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido en la búsqueda'
        };
    }
};

/**
 * Función específica para obtener precios mínimos y máximos
 * @param location - Ubicación para buscar
 * @param sessionId - ID de sesión
 * @returns Precios min/max encontrados
 */
export const getMinMaxPricesFromAlgolia = async (location: string, sessionId: string) => {
    const result = await searchAlgolia({
        sessionId,
        location,
        hitsPerPage: 1
    });

    if (!result.success || !result.data || result.data.length === 0) {
        return {
            success: false,
            error: result.error || "No se encontraron datos de precios"
        };
    }

    const community = result.data[0];
    return {
        success: true,
        data: {
            location,
            priceMin: community.PriceMin || 0,
            priceMax: community.PriceMax || 0
        }
    };
};

/**
 * Función específica para obtener amenidades en un rango de precios
 * @param location - Ubicación para buscar
 * @param sessionId - ID de sesión
 * @param priceMin - Precio mínimo
 * @param priceMax - Precio máximo
 * @returns Amenidades encontradas
 */
export const getAmenitiesFromPricesAlgolia = async (
    location: string,
    sessionId: string,
    priceMin: number,
    priceMax: number
) => {
    const result = await searchAlgolia({
        sessionId,
        location,
        priceMin,
        priceMax,
        hitsPerPage: 1
    });

    if (!result.success || !result.data || result.data.length === 0) {
        return {
            success: false,
            error: result.error || "No se encontraron comunidades en ese rango de precios"
        };
    }

    const community = result.data[0];
    const amenities = community.amenities || [];

    return {
        success: true,
        data: {
            location,
            amenities
        }
    };
};

/**
 * Función para buscar comunidades por amenidades específicas
 * @param location - Ubicación para buscar
 * @param sessionId - ID de sesión
 * @param amenities - Lista de amenidades deseadas
 * @param priceMin - Precio mínimo opcional
 * @param priceMax - Precio máximo opcional
 * @returns Comunidades que tienen las amenidades
 */
export const searchCommunitiesByAmenities = async (
    location: string,
    sessionId: string,
    amenities: string[],
    priceMin?: number,
    priceMax?: number
) => {
    const result = await searchAlgolia({
        sessionId,
        location,
        amenities,
        priceMin,
        priceMax,
        hitsPerPage: 20
    });

    if (!result.success || !result.data) {
        return {
            success: false,
            error: result.error || "No se encontraron comunidades con esas amenidades"
        };
    }

    return {
        success: true,
        data: {
            location,
            communities: result.data.map(community => ({
                uid: community.uid,
                name: community.name,
                amenities: community.amenities,
                priceMin: community.PriceMin,
                priceMax: community.PriceMax
            })),
            totalFound: result.metadata?.totalHits || 0
        }
    };
};

/**
 * Función para búsqueda avanzada con múltiples filtros
 * @param filters - Filtros complejos para búsqueda avanzada
 * @returns Resultados de búsqueda avanzada
 */
export const advancedAlgoliaSearch = async (filters: AlgoliaSearchFilters) => {
    const result = await searchAlgolia(filters);

    if (!result.success || !result.data) {
        return {
            success: false,
            error: result.error || "No se encontraron resultados"
        };
    }

    return {
        success: true,
        data: {
            communities: result.data,
            metadata: result.metadata,
            appliedFilters: {
                location: filters.location,
                priceRange: filters.priceMin || filters.priceMax ?
                    `$${filters.priceMin || 0} - $${filters.priceMax || '∞'}` : 'Sin filtro',
                amenities: filters.amenities || [],
                communities: filters.communities || [],
                status: filters.status || 'Todos'
            }
        }
    };
};
