import { createStore } from "zustand/vanilla";
import {
  validateSessionId,
  validateName,
  validateLocations,
  validatePriceRange,
  validateAmenities,
  ValidationResult,
} from "../schemas/store.schema";
import { suggestionPrompts } from "../prompts/prompts";
import {
  BudgetType,
  FloorplanSpecs,
  Range,
  IFSuggestResponse,
  IFLocation,
} from "../types/types";
import { IFArgsSearch } from "../types/searchTypes";
import { hasItems } from "./helper";
import { mcpServer } from "../mcp-llm/mcp.server";
import { queryDocument, testPerfectMatch } from "../search/search";
import axios from "axios";
import dotenv from "dotenv";
import { client } from "../search/client";

dotenv.config();

interface SessionStore {
  // Estados principales
  sessionId?: string;
  name?: string;
  locations?: IFLocation[];
  priceMin?: number;
  priceMax?: number;
  amenities?: string[];

  // Estados adicionales
  communities?: any;
  filteredCommunities?: any;
  community?: string;
  lastToolUsed?: string;
  mcpSessionId?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  communitiesFromGeoLocation?: any;

  // Nuevos campos del flujo extendido
  interestFindHome?: string;

  budgetType: string | null;
  budget: BudgetType | null;
  customizing: boolean | null;
  moveInReady: boolean | null;
  renting: boolean | null;
  homeInterest: string[];
  interestRateType?: string;
  lots: any[];

  floorplanBed: {
    min: number;
    max: number;
  };
  floorplanBath: {
    min: number;
    max: number;
  };
  floorplanGarage: {
    min: number;
    max: number;
  };
  floorplanLevel: {
    min: number;
    max: number;
  };
  floorplanSqft: {
    min: number;
    max: number;
  };

  // Estado para errores de validación
  validationErrors: Record<string, string[]>;

  // Acciones básicas con validación
  setSessionId: (sessionId: string) => ValidationResult<{ sessionId: string }>;
  setName: (name: string) => ValidationResult<{ name: string }>;
  setlocations: (
    locations: IFLocation[]
  ) => ValidationResult<{ locations: IFLocation[] }>;
  setPriceRange: (
    priceMin: number,
    priceMax: number
  ) => ValidationResult<{ priceMin: number; priceMax: number }>;
  setPriceMin: (priceMin: number) => void;
  setPriceMax: (priceMax: number) => void;
  setAmenities: (
    amenities: string[]
  ) => ValidationResult<{ amenities: string }>;
  setCommunities: (communities: any) => void;
  setFilteredCommunities: (filteredCommunities: any) => void;
  setCommunity: (community: string) => void;
  setLastToolUsed: (tool: string) => void;
  setMcpSessionId: (mcpSessionId: string) => void;
  setLocation: (location: string) => void;
  setLatitude: (latitude: number) => void;
  setLongitude: (longitude: number) => void;
  setGeoLocation: (latitude: number, longitude: number) => void;
  setCommunitiesFromGeoLocation: (communitiesFromGeoLocation: any) => void;
  // Acciones para nuevos campos
  setInterestFindHome: (interestFindHome: string) => void;
  setInterestRateType: (interestRateType: string) => void;
  // removeInterest: (interest: string) => void;
  setBudgetType: (budgetType: string) => void;
  setBudget: (budget: BudgetType) => void;
  setCustomizing: (customizing: boolean) => void;
  setMoveInReady: (moveInReady: boolean) => void;
  setRenting: (renting: boolean) => void;
  setHomeInterest: (homeInterest: string[]) => void;
  addHomeInterest: (homeInterest: string) => void;
  removeHomeInterest: (homeInterest: string) => void;
  setFloorplanBed: (floorplanBed: { min: number; max: number }) => void;
  setFloorplanBath: (floorplanBath: { min: number; max: number }) => void;
  setFloorplanGarage: (floorplanGarage: { min: number; max: number }) => void;
  setFloorplanLevel: (floorplanLevel: { min: number; max: number }) => void;
  setFloorplanSqft: (floorplanSqft: { min: number; max: number }) => void;

  // Acciones de utilidad
  reset: () => void;
  updateSessionData: (data: Partial<SessionStore>) => void;
  isSessionActive: () => boolean;
  getSessionSummary: () => string;
  clearValidationErrors: (field?: string) => void;
  getValidationErrors: (field?: string) => string[];
  setBudgetPriceRange: (priceMin: number, priceMax: number) => void;
  setLots: (lots: any[]) => void;
  suggest: () => IFSuggestResponse;
  toQuery: () => IFArgsSearch;
  updateFilteredCommunities: () => Promise<void>;
  // getCommunitiesFromGeoLocation: () => Promise<void>;
  // searchWithGoogleMaps: (
  //   query: string,
  //   options?: {
  //     model?: string;
  //     latitude?: number;
  //     longitude?: number;
  //   }
  // ) => Promise<{
  //   text: string;
  //   groundingMetadata?: {
  //     groundingChunks?: Array<{
  //       maps?: {
  //         title?: string;
  //         uri?: string;
  //         placeId?: string;
  //         googleMapsWidgetContextToken?: string;
  //       };
  //     }>;
  //   };
  // }>;
}

// Estado inicial
export const initialState = {
  // Estados principales
  sessionId: undefined,
  name: undefined,
  locations: undefined,
  priceMin: undefined,
  priceMax: undefined,
  amenities: undefined,

  // Estados adicionales
  communities: undefined,
  filteredCommunities: undefined,
  community: undefined,
  lastToolUsed: undefined,
  mcpSessionId: undefined,
  location: undefined,
  latitude: undefined,
  longitude: undefined,

  // Nuevos campos del flujo extendido
  interestFindHome: undefined,
  budgetType: null,
  budget: null,
  customizing: null,
  moveInReady: null,
  renting: null,
  homeInterest: [],
  interestRate: undefined,
  lots: [
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
  ],

  // Floorplan specs
  floorplanBed: {
    min: 0,
    max: 0,
  },
  floorplanBath: {
    min: 0,
    max: 0,
  },
  floorplanGarage: {
    min: 0,
    max: 0,
  },
  floorplanLevel: {
    min: 0,
    max: 0,
  },
  floorplanSqft: {
    min: 0,
    max: 0,
  },

  // Estado para errores de validación
  validationErrors: {},
};

export const sessionStore = createStore<SessionStore>()((set, get) => ({
  ...initialState,

  // Acciones básicas con validación
  setSessionId: (sessionId: string) => {
    const validation = validateSessionId(sessionId, "SessionId");

    if (validation.success) {
      set((state) => ({
        sessionId: validation.data.sessionId,
        validationErrors: {
          ...state.validationErrors,
          sessionId: [],
        },
      }));
    } else {
      // Store actual validation errors
      const errorMessages = validation.error
        ? [validation.error]
        : ["Error de validación"];
      set((state) => ({
        validationErrors: {
          ...state.validationErrors,
          sessionId: errorMessages,
        },
      }));
    }
    return validation;
  },

  setName: (name: string) => {
    const validation = validateName(name, "Name");

    if (validation.success) {
      set((state) => ({
        name: validation.data.name,
        validationErrors: {
          ...state.validationErrors,
          name: [],
        },
      }));
    } else {
      // Store actual validation errors
      const errorMessages = validation.error
        ? [validation.error]
        : ["Error de validación"];
      set((state) => ({
        validationErrors: {
          ...state.validationErrors,
          name: errorMessages,
        },
      }));
    }
    return validation;
  },

  setlocations: (locations: IFLocation[]) => {
    const validation = validateLocations(locations, "Locations");

    if (validation.success) {
      set((state) => ({
        locations: validation.data.locations,
        validationErrors: {
          ...state.validationErrors,
          locations: [],
        },
      }));
    } else {
      // Store actual validation errors
      const errorMessages = validation.error
        ? [validation.error]
        : ["Error de validación"];
      set((state) => ({
        validationErrors: {
          ...state.validationErrors,
          locations: errorMessages,
        },
      }));
    }
    return validation;
  },

  setPriceRange: (priceMin: number, priceMax: number) => {
    const validation = validatePriceRange(priceMin, priceMax, "PriceRange");

    if (validation.success) {
      set((state) => ({
        priceMin: validation.data.priceMin,
        priceMax: validation.data.priceMax,
        validationErrors: {
          ...state.validationErrors,
          priceRange: [],
        },
      }));
    } else {
      // Store actual validation errors
      const errorMessages = validation.error
        ? [validation.error]
        : ["Error de validación"];
      set((state) => ({
        validationErrors: {
          ...state.validationErrors,
          priceRange: errorMessages,
        },
      }));
    }
    return validation;
  },

  setPriceMin: (priceMin: number) => {
    set({ priceMin });
    return get().priceMin;
  },

  setPriceMax: (priceMax: number) => {
    set({ priceMax });
    return get().priceMax;
  },

  setAmenities: (amenities: string[]) => {
    const validation = validateAmenities(amenities, "Amenities");

    if (validation.success) {
      set((state) => ({
        amenities: validation.data.amenities,
        validationErrors: {
          ...state.validationErrors,
          amenities: [],
        },
      }));
    } else {
      // Store actual validation errors
      const errorMessages = validation.error
        ? [validation.error]
        : ["Error de validación"];
      set((state) => ({
        validationErrors: {
          ...state.validationErrors,
          amenities: errorMessages,
        },
      }));
    }
    return validation;
  },

  setCommunities: (communities: string) => {
    // const validation = validateCommunities(communities, "Communities");
    set({ communities });
  },

  setFilteredCommunities: (filteredCommunities: any) => {
    set({ filteredCommunities });
  },

  setCommunity: (community: string) => {
    set({ community });
  },

  setLastToolUsed: (lastToolUsed: string) => {
    set({ lastToolUsed });
  },

  setMcpSessionId: (mcpSessionId: string) => {
    set({ mcpSessionId });
  },

  setLocation: (location: string) => {
    set({ location });
  },

  setLatitude: (latitude: number) => {
    set({ latitude });
  },

  setLongitude: (longitude: number) => {
    set({ longitude });
  },

  setGeoLocation: (latitude: number, longitude: number) => {
    set({ latitude, longitude });
  },

  setCommunitiesFromGeoLocation: (communitiesFromGeoLocation: string) => {
    set({ communitiesFromGeoLocation });
  },

  // Acciones para nuevos campos

  setInterestFindHome: (interestFindHome: string) => {
    set({ interestFindHome });
  },

  setInterestRateType: (interestRateType: string) => {
    set({ interestRateType });
  },

  setBudgetType: (budgetType: string) => {
    set({ budgetType });
  },

  setBudget: (budget: BudgetType) => {
    set({ budget });
  },

  setCustomizing: (customizing: boolean) => {
    set({ customizing });
  },

  setMoveInReady: (moveInReady: boolean) => {
    set({ moveInReady });
  },

  setRenting: (renting: boolean) => {
    set({ renting });
  },

  setHomeInterest: (homeInterest: string[]) => {
    set({ homeInterest });
  },

  addHomeInterest: (newHomeInterest: string) => {
    set((state) => ({
      homeInterest: state.homeInterest.includes(newHomeInterest)
        ? state.homeInterest
        : [...state.homeInterest, newHomeInterest],
    }));
  },

  removeHomeInterest: (homeInterestToRemove: string) => {
    set((state) => ({
      homeInterest: state.homeInterest.filter(
        (h) => h !== homeInterestToRemove
      ),
    }));
  },

  setFloorplanBed: (floorplanBed: { min: number; max: number }) => {
    set({ floorplanBed });
  },

  setFloorplanBath: (floorplanBath: { min: number; max: number }) => {
    set({ floorplanBath });
  },

  setFloorplanGarage: (floorplanGarage: { min: number; max: number }) => {
    set({ floorplanGarage });
  },

  setFloorplanLevel: (floorplanLevel: { min: number; max: number }) => {
    set({ floorplanLevel });
  },

  setFloorplanSqft: (floorplanSqft: { min: number; max: number }) => {
    set({ floorplanSqft });
  },

  // Acciones de utilidad
  reset: () => set(initialState),

  updateSessionData: (data: Partial<SessionStore>) =>
    set((state) => ({ ...state, ...data })),

  isSessionActive: () => {
    const state = get();
    return !!(state.sessionId || state.mcpSessionId);
  },
  setBudgetPriceRange: (priceMin: number, priceMax: number) =>
    set((state) => ({
      budget: {
        ...state.budget,
        price: {
          priceMin,
          priceMax,
        },
      },
    })),
  getSessionSummary: () => {
    const state = get();
    const summary = [];

    if (state.name) summary.push(`Nombre: ${state.name}`);
    if (state.locations) summary.push(`Ubicación: ${state.locations}`);
    if (state.priceMin && state.priceMax) {
      summary.push(
        `Rango de precios: $${state.priceMin.toLocaleString()} - $${state.priceMax.toLocaleString()}`
      );
    }
    if (state.amenities) summary.push(`Amenidades: ${state.amenities}`);
    if (state.communities) summary.push(`Comunidades encontradas: Sí`);
    if (state.community)
      summary.push(`Comunidad seleccionada: ${state.community}`);

    return summary.length > 0 ? summary.join(" | ") : "Sin datos de sesión";
  },

  // Métodos de utilidad para validación
  clearValidationErrors: (field?: string) => {
    if (field) {
      set((state) => ({
        validationErrors: {
          ...state.validationErrors,
          [field]: [],
        },
      }));
    } else {
      set({ validationErrors: {} });
    }
  },
  setLots: (lots:any[]) => {
    set(state => ({lots: state.lots}))
  },

  getValidationErrors: (field?: string) => {
    const state = get();
    if (field) {
      return state.validationErrors[field] || [];
    } else {
      return Object.values(state.validationErrors).flat();
    }
  },

  /**
   * Tomar el estado actual y construye la consulta a la API de Algolia 
   * @returns {IFArgsSearch} Objeto con la información de la consulta para queryDocument
   */
  toQuery: (): IFArgsSearch => {
    const state = get();
    const query = '';
    const filters: string[] = [];

    if (state.locations && state.locations.length > 0) {
      const location = state.locations[0];
      if (location.state) {
        filters.push(`state:${location.state}`);
      }
      if (location.location) {
        filters.push(`city:${location.location}`);
      }
    }

    if (state.amenities && state.amenities.length > 0) {
      state.amenities.forEach(amenity => {
        filters.push(`amenities:${amenity}`);
      });
    }

    if (state.homeInterest && state.homeInterest.length > 0) {
      state.homeInterest.forEach(interest => {
        filters.push(`homeInterest:${interest}`);
      });
    }

    const numericFilters: string[] = [];

    if (state.priceMin !== undefined && state.priceMax !== undefined) {
      numericFilters.push(`priceMin>=${state.priceMin}`);
      numericFilters.push(`priceMax<=${state.priceMax}`);
    } else if (state.budget?.price) {
      numericFilters.push(`priceMin>=${state.budget.price.priceMin}`);
      numericFilters.push(`priceMax<=${state.budget.price.priceMax}`);
    }

    if (state.floorplanBed && (state.floorplanBed.min > 0 || state.floorplanBed.max > 0)) {
      if (state.floorplanBed.min > 0) {
        numericFilters.push(`bedroomsMin>=${state.floorplanBed.min}`);
      }
      if (state.floorplanBed.max > 0) {
        numericFilters.push(`bedroomsMax<=${state.floorplanBed.max}`);
      }
    }

    if (state.floorplanBath && (state.floorplanBath.min > 0 || state.floorplanBath.max > 0)) {
      if (state.floorplanBath.min > 0) {
        numericFilters.push(`bathroomsMin>=${state.floorplanBath.min}`);
      }
      if (state.floorplanBath.max > 0) {
        numericFilters.push(`bathroomsMax<=${state.floorplanBath.max}`);
      }
    }

    if (state.floorplanGarage && (state.floorplanGarage.min > 0 || state.floorplanGarage.max > 0)) {
      if (state.floorplanGarage.min > 0) {
        numericFilters.push(`garagesMin>=${state.floorplanGarage.min}`);
      }
      if (state.floorplanGarage.max > 0) {
        numericFilters.push(`garagesMax<=${state.floorplanGarage.max}`);
      }
    }

    // Filtros de floorplan - levels
    /*  if (state.floorplanLevel && (state.floorplanLevel.min > 0 || state.floorplanLevel.max > 0)) {
       if (state.floorplanLevel.min > 0) {
         numericFilters.push(`specs.level>=${state.floorplanLevel.min}`);
       }
       if (state.floorplanLevel.max > 0) {
         numericFilters.push(`specs.level<=${state.floorplanLevel.max}`);
       }
     } */

    // Filtros de floorplan - square feet
    /*   if (state.floorplanSqft && (state.floorplanSqft.min > 0 || state.floorplanSqft.max > 0)) {
        if (state.floorplanSqft.min > 0) {
          numericFilters.push(`specs.sqft>=${state.floorplanSqft.min}`);
        }
        if (state.floorplanSqft.max > 0) {
          numericFilters.push(`specs.sqft<=${state.floorplanSqft.max}`);
        }
      } */

    // Construir searchParams con geolocalización si está disponible
    const searchParams =
      state.latitude !== undefined && state.longitude !== undefined
        ? {
          latitude: state.latitude,
          longitude: state.longitude,
          aroundRadius: 5000,
        }
        : undefined;

    const facetType = "objectType:community";

    return {
      query,
      facetType: facetType,
      filters: filters.map(filter => filter),
      numericFilters,
      ...(searchParams && {
        searchParams: {
          aroundLatLng: `${searchParams.latitude}, ${searchParams.longitude}`,
          aroundRadius: searchParams.aroundRadius
        }
      }),

    };
  },

  updateFilteredCommunities: async () => {

    const queryArgs = get().toQuery();

    const locs = get().locations;

    
    if(!locs || locs.length <= 0) {
      set({ filteredCommunities: [] });
      return
    }
    //realizamos la consulta a la api de algolia
    const result = await queryDocument(queryArgs);

    const hits =
      Array.isArray(result) &&
        result[0] &&
        Array.isArray((result[0] as any).hits)
        ? (result[0] as any).hits
        : [];

    if (Array.isArray(hits) || hits.length > 0) {
      set({ filteredCommunities: hits });
    }

  },

  // getCommunitiesFromGeoLocation: async (): Promise<any> => {
  //   const response = await client.searchSingleIndex({
  //     indexName: 'community-by-AI',
      
  //     searchParams: { aroundLatLng: `${get().latitude}, ${get().longitude}`, aroundRadius: 100000, hitsPerPage: 2 },
  //   });
  //   console.log('Response from communities from geo location', response);
  //   set({ communitiesFromGeoLocation: response.hits });
  //   return response.hits;
  // },

  /**
   * Función suggest: Sugiere la siguiente acción basándose en el estado actual
   *
   * @returns {Object} Objeto con información sobre propiedades faltantes y sugerencias
   * - missing: Propiedad principal faltante (name, location, budget) o null
   * - suggestion: Mensaje de sugerencia para el usuario
   * - nextTool: Nombre de la siguiente herramienta/función a ejecutar
   *
   * @example
   * const suggestion = store.suggest();
   * if (suggestion.missing) {
   *   console.log(`Falta: ${suggestion.missing}`);
   * }
   * console.log(`Sugerencia: ${suggestion.suggestion}`);
   * console.log(`Siguiente tool: ${suggestion.nextTool}`);
   */
  suggest: () => {
    const state = get();

    const buildSuggest = (
      prompt: string,
      primaryTool: string,
    ): IFSuggestResponse => {

      return {
        missing: null,
        suggestion: prompt,
        nextTool: primaryTool
      };
    };

    // Validar propiedades principales
    if (!state.name) {
      return {
        missing: "name",
        suggestion: suggestionPrompts.suggestionName,
        nextTool: "getName",
      };
    }

    if (!state.locations || state.locations.length === 0) {
      return {
        missing: "location",
        suggestion: suggestionPrompts.suggestionLocation,
        nextTool: "getLocations",
      };
    }

    // Si tiene todas las propiedades principales, validar adicionales y sugerir
    // Validar propiedades adicionales en orden de prioridad
    if (state.locations.length > 0 && state.name) {

      if (
        !state.budget?.price &&
        state.priceMin !== undefined &&
        state.priceMax !== undefined
      ) {

        return {
          missing: "budget",
          suggestion: `${suggestionPrompts.suggestionBudget
            } y un rango de precios entre ${state.priceMin.toLocaleString()} y ${state.priceMax.toLocaleString()}`,
          nextTool: "getBudget",
        };

      }

      if (!state.amenities) {
        return buildSuggest(
          suggestionPrompts.suggestionAnemities,
          "getAmenities"
        );
      }

      if (!state.interestFindHome) {
        return buildSuggest(
          suggestionPrompts.suggestionInterestFindHome,
          "getInterestFindHome"
        );
      }

      if (state.customizing === null) {
        return buildSuggest(
          suggestionPrompts.suggestionCustomizing,
          "getCustomizing"
        );
      }

      if (state.moveInReady === null) {
        return buildSuggest(
          suggestionPrompts.suggestionMoveInReady,
          "getMoveInReady"
        );
      }

      if (state.renting === null) {
        return buildSuggest(
          suggestionPrompts.suggestionRenting,
          "getRenting"
        );
      }

      if (
        !state.floorplanBed ||
        (state.floorplanBed.min === 0 && state.floorplanBed.max === 0)
      ) {
        return buildSuggest(
          suggestionPrompts.suggestionFloorplanBed,
          "getFloorplanBed"
        );
      }

      if (
        !state.floorplanBath ||
        (state.floorplanBath.min === 0 && state.floorplanBath.max === 0)
      ) {
        return buildSuggest(
          suggestionPrompts.suggestionFloorplanBath,
          "getFloorplanBath"
        );
      }

      if (
        !state.floorplanGarage ||
        (state.floorplanGarage.min === 0 && state.floorplanGarage.max === 0)
      ) {
        return buildSuggest(
          suggestionPrompts.suggestionFloorplanGarage,
          "getFloorplanGarage"
        );
      }

      if (
        !state.floorplanLevel ||
        (state.floorplanLevel.min === 0 && state.floorplanLevel.max === 0)
      ) {
        return buildSuggest(
          suggestionPrompts.suggestionFloorplanLevel,
          "getFloorplanLevel"
        );
      }

      if (
        !state.floorplanSqft ||
        (state.floorplanSqft.min === 0 && state.floorplanSqft.max === 0)
      ) {
        return buildSuggest(
          suggestionPrompts.suggestionFloorplanSqft,
          "getFloorplanSqft"
        );
      }

      if (!state.homeInterest || state.homeInterest.length === 0) {
        return buildSuggest(
          suggestionPrompts.suggestionHomeInterest,
          "getInterestedHome"
        );
      }

      if (!state.interestRateType) {
        return buildSuggest(
          suggestionPrompts.suggestionInterestRateType,
          "getInterestRateType"
        );
      }
    }

    // Si tiene toda la información
    return {
      missing: null,
      suggestion: '',
      nextTool: '',
    };
  },

  /**
   * Función searchWithGoogleMaps: Realiza una búsqueda con Google Maps Grounding usando Gemini API
   * 
   * Esta función utiliza la funcionalidad de Google Maps Grounding de Gemini para proporcionar
   * respuestas precisas y basadas en ubicación utilizando los datos de Google Maps.
   * 
   * @param {string} query - La consulta del usuario relacionada con ubicación (ej: "What are the best Italian restaurants within a 15-minute walk from here?")
   * @param {Object} options - Opciones opcionales para la búsqueda
   * @param {string} options.model - Modelo de Gemini a usar (por defecto: "gemini-2.5-flash")
   * @param {number} options.latitude - Latitud opcional (si no se proporciona, usa la del store)
   * @param {number} options.longitude - Longitud opcional (si no se proporciona, usa la del store)
   * 
   * @returns {Promise<Object>} Objeto con:
   * - text: La respuesta generada por Gemini
   * - groundingMetadata: Metadatos de grounding con información de Google Maps:
   *   - groundingChunks: Array de chunks con información de Maps:
   *     - maps.title: Título del lugar
   *     - maps.uri: URI del lugar en Google Maps
   *     - maps.placeId: ID del lugar
   *     - maps.googleMapsWidgetContextToken: Token para renderizar widgets de Google Maps
   * 
   * @example
   * const result = await store.searchWithGoogleMaps(
   *   "What are the best Italian restaurants within a 15-minute walk from here?",
   *   { latitude: 34.050481, longitude: -118.248526 }
   * );
   * console.log(result.text);
   * if (result.groundingMetadata?.groundingChunks) {
   *   result.groundingMetadata.groundingChunks.forEach(chunk => {
   *     console.log(`- [${chunk.maps?.title}](${chunk.maps?.uri})`);
   *   });
   * }
   */
  // searchWithGoogleMaps: async (
  //   query: string,
  //   options?: {
  //     model?: string;
  //     latitude?: number;
  //     longitude?: number;
  //   }
  // ) => {
  //   const state = get();

  //   // Usar coordenadas de las opciones o del store
  //   const latitude = options?.latitude ?? state.latitude;
  //   const longitude = options?.longitude ?? state.longitude;

  //   // Modelo compatible con Google Maps Grounding
  //   const modelName = options?.model || "gemini-2.5-flash";

  //   // Validar que tenemos API key
  //   if (!API_KEY) {
  //     throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno");
  //   }

  //   // try {
  //   //   // Configurar la solicitud con Google Maps Grounding usando la API REST directamente
  //   //   // El SDK de Node.js aún no soporta Google Maps Grounding, así que usamos la API REST
  //   //   // const requestBody: any = {
  //   //   //   contents: [
  //   //   //     {
  //   //   //       role: "user",
  //   //   //       parts: [{ text: query }],
  //   //   //     },
  //   //   //   ],
  //   //   //   tools: [{ googleMaps: {} }],
  //   //   // };

  //   //   // Agregar configuración de ubicación si está disponible
  //   //   // if (latitude !== undefined && longitude !== undefined) {
  //   //   //   requestBody.toolConfig = {
  //   //   //     retrievalConfig: {
  //   //   //       latLng: {
  //   //   //         latitude,
  //   //   //         longitude,
  //   //   //       },
  //   //   //     },
  //   //   //   };
  //   //   // }

  //   //   // Realizar la solicitud a Gemini API usando REST API
  //   //   // const response = await axios.post(
  //   //   //   `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
  //   //   //   requestBody,
  //   //   //   {
  //   //   //     headers: {
  //   //   //       "Content-Type": "application/json",
  //   //   //       "x-goog-api-key": API_KEY,
  //   //   //     },
  //   //   //   }
  //   //   // );

  //   //   // Extraer la respuesta de texto
  //   //   // const text =
  //   //   //   response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  //   //   // // Extraer metadatos de grounding si están disponibles
  //   //   // const groundingMetadata =
  //   //   //   response.data.candidates?.[0]?.groundingMetadata;

  //   //   // return {
  //   //   //   text,
  //   //   //   groundingMetadata: groundingMetadata
  //   //   //     ? {
  //   //   //       groundingChunks: groundingMetadata.groundingChunks?.map(
  //   //   //         (chunk: any) => ({
  //   //   //           maps: chunk.maps
  //   //   //             ? {
  //   //   //               title: chunk.maps.title,
  //   //   //               uri: chunk.maps.uri,
  //   //   //               placeId: chunk.maps.placeId,
  //   //   //               googleMapsWidgetContextToken:
  //   //   //                 chunk.maps.googleMapsWidgetContextToken,
  //   //   //             }
  //   //   //             : undefined,
  //   //   //         })
  //   //   //       ),
  //   //   //     }
  //   //   //     : undefined,
  //   //   // };
  //   // } catch (error) {
  //   //   // console.error("Error en searchWithGoogleMaps:", error);
  //   //   // if (axios.isAxiosError(error)) {
  //   //   //   const errorMessage =
  //   //   //     error.response?.data?.error?.message ||
  //   //   //     error.message ||
  //   //   //     "Error desconocido";
  //   //   //   throw new Error(`Error en la API de Gemini: ${errorMessage}`);
  //   //   // }
  //   //   // throw error;
  //   // }
  // },


}));

// Subscribe para debugging (opcional)
sessionStore.subscribe((state) => {
  // console.log('state', state);
});

// Tipo para exportar la interfaz del store
export type { SessionStore };
