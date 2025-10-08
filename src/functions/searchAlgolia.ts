import { ResponseError, ResponseSuccess } from "../mcp-llm/types/responseType";
import { AlgoliaCommunityResult } from "../tools/algoliaSearch";
import { algoliasearch } from "algoliasearch";


const client = algoliasearch('5WEGK1QY4E', '41716df1c4ed609036405ed46647e5df');

// Tipo para rangos numéricos
export interface Range {
	min?: number;
	max?: number;
}

export interface AlgoliaSearchFilters {
	location: string[];

	// Filtros de precio
	priceMin?: number;
	priceMax?: number;

	// Filtros adicionales
	amenities?: string[];
	communities?: string[];
	status?: string;
	sqft?: Range;
	beds?: Range;
	baths?: Range;
	garage?: Range;

	// Configuración de búsqueda
	indexName?: string;
	hitsPerPage?: number;
	query?: string;


	numericFilters?: string[];

	facetFilters?: string[];
}

// Interfaz para la respuesta de la búsqueda general
export interface AlgoliaGeneralResponse {
	success: boolean;
	data: unknown;
	error?: string;

}

/**
 * Función general para realizar búsquedas en Algolia con filtros flexibles
 * @param filters - Filtros de búsqueda configurables
 * @returns Respuesta con datos o error
 */
export const searchAlgolia = async (filters: AlgoliaSearchFilters): Promise<ResponseSuccess | ResponseError> => {
	try {

		const location = filters.location;

		// Validaciones básicas
		if (location.length === 0) {

			return {
				success: false,
				data: null,
				error: "location es requerido",
				code: 400,
				history: [],
				message: 'El filtro de ubicación es obligatorio para realizar la búsqueda.',
				suggest: null
			};
		}

		const cities = [];

		for (let i = 0; i < location.length; i++) {
			const element = location[i];
			cities.push(`_origin.division.name:${element}`);
		}

		const numericFilters: string[] = filters.numericFilters || [];

		if (filters.priceMin !== undefined) {
			numericFilters.push(`PriceMin>=${filters.priceMin}`);
		}

		if (filters.priceMax !== undefined) {
			numericFilters.push(`PriceMax<=${filters.priceMax}`);
		}

		// Configuración de búsqueda
		const searchConfig = {
			indexName: 'communities-gemini-test',
			query: '',
			hitsPerPage: 10,
			// numericFilters: numericFilters,
			facetFilters: [
				cities
			],
		};

		// console.log('🔍 Algolia Search Config:', JSON.stringify(searchConfig, null, 2));

		const searchResponse = await client.search({
			requests: [searchConfig]
		});

		// Validar respuesta
		if (!searchResponse?.results?.[0] || !('hits' in searchResponse.results[0])) {
			return {
				success: false,
				data: null,
				error: "No se encontraron resultados",
				code: 404,
				history: [],
				message: 'No se encontraron comunidades que coincidan con los filtros proporcionados.',
				suggest: null
			};
		}

		const result = searchResponse.results[0];
		const hits = 'hits' in result ? result.hits : [];

		if (!hits || hits.length === 0) {
			return {
				success: false,
				data: null,
				error: "No se encontraron comunidades que coincidan con los filtros",
				code: 404,
				history: [],
				message: 'No se encontraron comunidades que coincidan con los filtros proporcionados.',
				suggest: null
			};
		}

		const formattedHits = hits.map((hit: any) => {
			const { name, _origin, amenities } = hit;

			const specs = amenities ? amenities.join(', ') : 'No especificado';

			return {
				type: "text",
				text: `Encontramos en la siguiente comunidad ${name}, en la ciudad de ${_origin.division.name}, con las siguientes amenidades: ${specs}`,
			};
		});

		return {
			success: true,
			code: 200,
			history: [],
			message: 'Con los siguientes resultados y los datos proporcionados anteriormente, puedes elegir la mejor comunidad que se adapte a las necesidades del usuario.',
			data: formattedHits,
			error: null,
			suggest: null
		};

	} catch (error) {
		console.error('❌ Error en búsqueda de Algolia:', error);
		return {
			success: false,
			code: 500,
			message: 'Error interno del servidor durante la búsqueda en Algolia.',
			history: [],
			data: null,
			error: 'Error desconocido en la búsqueda',
			suggest: null
		};
	}
};