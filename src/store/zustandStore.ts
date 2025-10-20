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
import { hasItems } from "./helper";

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
  community?: string;
  lastToolUsed?: string;
  mcpSessionId?: string;
  location?: string;

  // Nuevos campos del flujo extendido
  interestFindHome?: string;

  budgetType: string | null;
  budget: BudgetType | null;
  customizing: boolean | null;
  moveInReady: boolean | null;
  renting: boolean | null;
  homeInterest: string[];
  interestRateType?: string;

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
  setCommunity: (community: string) => void;
  setLastToolUsed: (tool: string) => void;
  setMcpSessionId: (mcpSessionId: string) => void;
  setLocation: (location: string) => void;

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
  suggest: () => IFSuggestResponse;
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
  community: undefined,
  lastToolUsed: undefined,
  mcpSessionId: undefined,
  location: undefined,

  // Nuevos campos del flujo extendido
  interestFindHome: undefined,
  budgetType: null,
  budget: null,
  customizing: null,
  moveInReady: null,
  renting: null,
  homeInterest: [],
  interestRate: undefined,

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

  getValidationErrors: (field?: string) => {
    const state = get();
    if (field) {
      return state.validationErrors[field] || [];
    } else {
      return Object.values(state.validationErrors).flat();
    }
  },

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
      state: SessionStore
    ): IFSuggestResponse => {
      const hasCommunities = hasItems(state.communities);
      const extraPrompt = !hasCommunities
        ? ` o ${suggestionPrompts.suggestionSearhCommunity}`
        : "";

      const nextTools = [primaryTool];

      return {
        missing: null,
        suggestion: `${prompt}${extraPrompt}`.replace(/\s+/g, " ").trim(),
        nextTool: nextTools.join(" | "),
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
          "getAmenities",
          state
        );
      }

      if (!state.interestFindHome) {
        return buildSuggest(
          suggestionPrompts.suggestionInterestFindHome,
          "getInterestFindHome",
          state
        );
      }

      if (state.customizing === null) {
        return buildSuggest(
          suggestionPrompts.suggestionCustomizing,
          "getCustomizing",
          state
        );
      }

      if (state.moveInReady === null) {
        return buildSuggest(
          suggestionPrompts.suggestionMoveInReady,
          "getMoveInReady",
          state
        );
      }

      if (state.renting === null) {
        return buildSuggest(
          suggestionPrompts.suggestionRenting,
          "getRenting",
          state
        );
      }

      if (
        !state.floorplanBed ||
        (state.floorplanBed.min === 0 && state.floorplanBed.max === 0)
      ) {
        return buildSuggest(
          suggestionPrompts.suggestionFloorplanBed,
          "getFloorplanBed",
          state
        );
      }

      if (
        !state.floorplanBath ||
        (state.floorplanBath.min === 0 && state.floorplanBath.max === 0)
      ) {
        return buildSuggest(
          suggestionPrompts.suggestionFloorplanBath,
          "getFloorplanBath",
          state
        );
      }

      if (
        !state.floorplanGarage ||
        (state.floorplanGarage.min === 0 && state.floorplanGarage.max === 0)
      ) {
        return buildSuggest(
          suggestionPrompts.suggestionFloorplanGarage,
          "getFloorplanGarage",
          state
        );
      }

      if (
        !state.floorplanLevel ||
        (state.floorplanLevel.min === 0 && state.floorplanLevel.max === 0)
      ) {
        return buildSuggest(
          suggestionPrompts.suggestionFloorplanLevel,
          "getFloorplanLevel",
          state
        );
      }

      if (
        !state.floorplanSqft ||
        (state.floorplanSqft.min === 0 && state.floorplanSqft.max === 0)
      ) {
        return buildSuggest(
          suggestionPrompts.suggestionFloorplanSqft,
          "getFloorplanSqft",
          state
        );
      }

      if (!state.homeInterest || state.homeInterest.length === 0) {
        return buildSuggest(
          suggestionPrompts.suggestionHomeInterest,
          "getInterestedHome",
          state
        );
      }

      if (!state.interestRateType) {
        return buildSuggest(
          suggestionPrompts.suggestionInterestRateType,
          "getInterestRateType",
          state
        );
      }

      if (!state.communities) {
        return {
          missing: null,
          suggestion: suggestionPrompts.suggestionSearhCommunity,
          nextTool: "searchCommmunity",
        };
      }
    }

    // Si tiene toda la información
    return {
      missing: null,
      suggestion: suggestionPrompts.suggestionComplete,
      nextTool: "searchCommmunity",
    };
  },
}));

// Subscribe para debugging (opcional)
sessionStore.subscribe((state) => {
  // console.log('state', state);
});

// Tipo para exportar la interfaz del store
export type { SessionStore };
