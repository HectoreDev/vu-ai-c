import { create } from 'zustand';
import {
    validateSessionId,
    validateName,
    validateLocations,
    validatePriceRange,
    validateAmenities,
    ValidationResult
} from '../schemas/store.schema';
import { BudgetType, Range } from "../types/types";

interface SessionStore {
    // Estados principales
    sessionId?: string;
    name?: string;
    locations?: string[];
    priceMin?: number;
    priceMax?: number;
    amenities?: string;

    // Estados adicionales
    communities?: string;
    community?: string;
    lastToolUsed?: string;
    mcpSessionId?: string;

    // Nuevos campos del flujo extendido
    welcome: string | null;
    nameSpecs: string | null;
    interest: string[];
    markets: string[];
    budgetProduct: string | null;
    budgetType: string | null;
    budget: BudgetType | null;
    customizing: string | null;
    moveInReady: string | null;
    renting: string | null;
    floorplanSpecs: string | null;
    homeInterest: string[];
    interestRate?: string;

    // Estado para errores de validación
    validationErrors: Record<string, string[]>;

    // Acciones básicas con validación
    setSessionId: (sessionId: string) => ValidationResult<{ sessionId: string }>;
    setName: (name: string) => ValidationResult<{ name: string }>;
    setlocations: (locations: string[]) => ValidationResult<{ locations: string[] }>;
    setPriceRange: (priceMin: number, priceMax: number) => ValidationResult<{ priceMin: number; priceMax: number }>;
    setPriceMin: (priceMin: number) => void;
    setPriceMax: (priceMax: number) => void;
    setAmenities: (amenities: string) => ValidationResult<{ amenities: string }>;
    setCommunities: (communities: string) => void;
    setCommunity: (community: string) => void;
    setLastToolUsed: (tool: string) => void;
    setMcpSessionId: (mcpSessionId: string) => void;

    // Acciones para nuevos campos
    setWelcome: (welcome: string) => void;
    setNameSpecs: (nameSpecs: string) => void;
    setInterest: (interest: string[]) => void;
    setInterestRate: (interestRate: string) => void;
    addInterest: (interest: string) => void;
    removeInterest: (interest: string) => void;
    setMarkets: (markets: string[]) => void;
    addMarket: (market: string) => void;
    removeMarket: (market: string) => void;
    setBudgetProduct: (budgetProduct: string) => void;
    setBudgetType: (budgetType: string) => void;
    setBudget: (budget: BudgetType) => void;
    setCustomizing: (customizing: string) => void;
    setMoveInReady: (moveInReady: string) => void;
    setRenting: (renting: string) => void;
    setFloorplanSpecs: (floorplanSpecs: string) => void;
    setHomeInterest: (homeInterest: string[]) => void;
    addHomeInterest: (homeInterest: string) => void;
    removeHomeInterest: (homeInterest: string) => void;

    // Acciones de utilidad
    reset: () => void;
    updateSessionData: (data: Partial<SessionStore>) => void;
    isSessionActive: () => boolean;
    getSessionSummary: () => string;
    clearValidationErrors: (field?: string) => void;
    getValidationErrors: (field?: string) => string[];
}

// Estado inicial
export const initialState = {
    sessionId: undefined,
    name: undefined,
    locations: undefined,
    priceMin: undefined,
    priceMax: undefined,
    amenities: undefined,
    communities: undefined,
    community: undefined,
    lastToolUsed: undefined,
    mcpSessionId: undefined,

    // Nuevos campos del flujo extendido
    welcome: null,
    nameSpecs: null,
    interest: [],
    markets: [],
    budgetProduct: null,
    budgetType: null,
    budget: null,
    customizing: null,
    moveInReady: null,
    renting: null,
    floorplanSpecs: null,
    homeInterest: [],
    interestRate: undefined,

    validationErrors: {},
};



export const useSessionStore = create<SessionStore>()((set, get) => ({

    ...initialState,

    // Acciones básicas con validación
    setSessionId: (sessionId: string) => {
        const validation = validateSessionId(sessionId);

        if (validation.success) {
            set((state) => ({
                sessionId: validation.data.sessionId,
                validationErrors: {
                    ...state.validationErrors,
                    sessionId: []
                }
            }));
        } else {
            // Store actual validation errors
            const errorMessages = validation.error ? [validation.error] : ['Error de validación'];
            set((state) => ({
                validationErrors: {
                    ...state.validationErrors,
                    sessionId: errorMessages
                }
            }));
        }
        return validation;
    },

    setName: (name: string) => {
        const validation = validateName(name);

        if (validation.success) {
            set((state) => ({
                name: validation.data.name,
                validationErrors: {
                    ...state.validationErrors,
                    name: []
                }
            }));
        } else {
            // Store actual validation errors
            const errorMessages = validation.error ? [validation.error] : ['Error de validación'];
            set((state) => ({
                validationErrors: {
                    ...state.validationErrors,
                    name: errorMessages
                }
            }));
        }
        return validation;
    },

    setlocations: (locations: string[]) => {
        const validation = validateLocations(locations);

        if (validation.success) {
            set((state) => ({
                locations: validation.data.locations,
                validationErrors: {
                    ...state.validationErrors,
                    locations: []
                }
            }));
        } else {
            // Store actual validation errors
            const errorMessages = validation.error ? [validation.error] : ['Error de validación'];
            set((state) => ({
                validationErrors: {
                    ...state.validationErrors,
                    locations: errorMessages
                }
            }));
        }
        return validation;
    },

    setPriceRange: (priceMin: number, priceMax: number) => {
        const validation = validatePriceRange(priceMin, priceMax);

        if (validation.success) {
            set((state) => ({
                priceMin: validation.data.priceMin,
                priceMax: validation.data.priceMax,
                validationErrors: {
                    ...state.validationErrors,
                    priceRange: []
                }
            }));
        } else {
            // Store actual validation errors
            const errorMessages = validation.error ? [validation.error] : ['Error de validación'];
            set((state) => ({
                validationErrors: {
                    ...state.validationErrors,
                    priceRange: errorMessages
                }
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

    setAmenities: (amenities: string) => {
        const validation = validateAmenities(amenities);

        if (validation.success) {
            set((state) => ({
                amenities: validation.data.amenities,
                validationErrors: {
                    ...state.validationErrors,
                    amenities: []
                }
            }));
        } else {
            // Store actual validation errors
            const errorMessages = validation.error ? [validation.error] : ['Error de validación'];
            set((state) => ({
                validationErrors: {
                    ...state.validationErrors,
                    amenities: errorMessages
                }
            }));
        }
        return validation;
    },

    setCommunities: (communities: string) => {
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

    // Acciones para nuevos campos
    setWelcome: (welcome: string) => {
        set({ welcome });
    },

    setNameSpecs: (nameSpecs: string) => {
        set({ nameSpecs });
    },

    setInterest: (interest: string[]) => {
        set({ interest });
    },

    setInterestRate: (interestRate: string) => {
        set({ interestRate });
    },

    addInterest: (newInterest: string) => {
        set((state) => ({
            interest: state.interest.includes(newInterest)
                ? state.interest
                : [...state.interest, newInterest]
        }));
    },

    removeInterest: (interestToRemove: string) => {
        set((state) => ({
            interest: state.interest.filter(i => i !== interestToRemove)
        }));
    },

    setMarkets: (markets: string[]) => {
        set({ markets });
    },

    addMarket: (newMarket: string) => {
        set((state) => ({
            markets: state.markets.includes(newMarket)
                ? state.markets
                : [...state.markets, newMarket]
        }));
    },

    removeMarket: (marketToRemove: string) => {
        set((state) => ({
            markets: state.markets.filter(m => m !== marketToRemove)
        }));
    },

    setBudgetProduct: (budgetProduct: string) => {
        set({ budgetProduct });
    },

    setBudgetType: (budgetType: string) => {
        set({ budgetType });
    },

    setBudget: (budget: BudgetType) => {
        set({ budget });
    },

    setCustomizing: (customizing: string) => {
        set({ customizing });
    },

    setMoveInReady: (moveInReady: string) => {
        set({ moveInReady });
    },

    setRenting: (renting: string) => {
        set({ renting });
    },

    setFloorplanSpecs: (floorplanSpecs: string) => {
        set({ floorplanSpecs });
    },

    setHomeInterest: (homeInterest: string[]) => {
        set({ homeInterest });
    },

    addHomeInterest: (newHomeInterest: string) => {
        set((state) => ({
            homeInterest: state.homeInterest.includes(newHomeInterest)
                ? state.homeInterest
                : [...state.homeInterest, newHomeInterest]
        }));
    },

    removeHomeInterest: (homeInterestToRemove: string) => {
        set((state) => ({
            homeInterest: state.homeInterest.filter(h => h !== homeInterestToRemove)
        }));
    },

    // Acciones de utilidad
    reset: () =>
        set(initialState),

    updateSessionData: (data: Partial<SessionStore>) =>
        set((state) => ({ ...state, ...data })),

    isSessionActive: () => {
        const state = get();
        return !!(state.sessionId || state.mcpSessionId);
    },

    getSessionSummary: () => {
        const state = get();
        const summary = [];

        if (state.name) summary.push(`Nombre: ${state.name}`);
        if (state.locations) summary.push(`Ubicación: ${state.locations}`);
        if (state.priceMin && state.priceMax) {
            summary.push(`Rango de precios: $${state.priceMin.toLocaleString()} - $${state.priceMax.toLocaleString()}`);
        }
        if (state.amenities) summary.push(`Amenidades: ${state.amenities}`);
        if (state.communities) summary.push(`Comunidades encontradas: Sí`);
        if (state.community) summary.push(`Comunidad seleccionada: ${state.community}`);

        return summary.length > 0 ? summary.join(' | ') : 'Sin datos de sesión';
    },

    // Métodos de utilidad para validación
    clearValidationErrors: (field?: string) => {
        if (field) {
            set((state) => ({
                validationErrors: {
                    ...state.validationErrors,
                    [field]: []
                }
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

}));


useSessionStore.subscribe((state) => {
    console.log('state', state);
});

// Hooks de utilidad para acceso rápido a partes específicas del estado
export const useSessionId = () => useSessionStore((state) => state.sessionId);
export const useName = () => useSessionStore((state) => state.name);
export const uselocations = () => useSessionStore((state) => state.locations);
export const usePriceRange = () => useSessionStore((state) => ({
    priceMin: state.priceMin,
    priceMax: state.priceMax
}));
export const useAmenities = () => useSessionStore((state) => state.amenities);
export const useMcpSessionId = () => useSessionStore((state) => state.mcpSessionId);

// Hooks para nuevos campos
export const useWelcome = () => useSessionStore((state) => state.welcome);
export const useNameSpecs = () => useSessionStore((state) => state.nameSpecs);
export const useInterest = () => useSessionStore((state) => state.interest);
export const useMarkets = () => useSessionStore((state) => state.markets);
export const useBudgetProduct = () => useSessionStore((state) => state.budgetProduct);
export const useBudgetType = () => useSessionStore((state) => state.budgetType);
export const useBudget = () => useSessionStore((state) => state.budget);
export const useCustomizing = () => useSessionStore((state) => state.customizing);
export const useMoveInReady = () => useSessionStore((state) => state.moveInReady);
export const useRenting = () => useSessionStore((state) => state.renting);
export const useFloorplanSpecs = () => useSessionStore((state) => state.floorplanSpecs);
export const useHomeInterest = () => useSessionStore((state) => state.homeInterest);

// Hook para obtener todas las acciones
export const useSessionActions = () => useSessionStore((state) => ({
    // Acciones básicas
    setSessionId: state.setSessionId,
    setName: state.setName,
    setlocations: state.setlocations,
    setPriceRange: state.setPriceRange,
    setPriceMin: state.setPriceMin,
    setPriceMax: state.setPriceMax,
    setAmenities: state.setAmenities,
    setCommunities: state.setCommunities,
    setCommunity: state.setCommunity,
    setLastToolUsed: state.setLastToolUsed,
    setMcpSessionId: state.setMcpSessionId,

    // Acciones para nuevos campos
    setWelcome: state.setWelcome,
    setNameSpecs: state.setNameSpecs,
    setInterest: state.setInterest,
    addInterest: state.addInterest,
    removeInterest: state.removeInterest,
    setMarkets: state.setMarkets,
    addMarket: state.addMarket,
    removeMarket: state.removeMarket,
    setBudgetProduct: state.setBudgetProduct,
    setBudgetType: state.setBudgetType,
    setBudget: state.setBudget,
    setCustomizing: state.setCustomizing,
    setMoveInReady: state.setMoveInReady,
    setRenting: state.setRenting,
    setFloorplanSpecs: state.setFloorplanSpecs,
    setHomeInterest: state.setHomeInterest,
    addHomeInterest: state.addHomeInterest,
    removeHomeInterest: state.removeHomeInterest,

    // Acciones de utilidad
    reset: state.reset,
    updateSessionData: state.updateSessionData,
}));

// Hook para obtener utilidades
export const useSessionUtils = () => useSessionStore((state) => ({
    isSessionActive: state.isSessionActive,
    getSessionSummary: state.getSessionSummary,
}));

// Hooks para validación
export const useValidationErrors = (field?: string) => useSessionStore((state) => {
    if (field) {
        return state.validationErrors[field] || [];
    }
    return Object.values(state.validationErrors).flat();
});

export const useValidationActions = () => useSessionStore((state) => ({
    clearValidationErrors: state.clearValidationErrors,
    getValidationErrors: state.getValidationErrors,
}));

// Hook para verificar si un campo tiene errores
export const useHasValidationErrors = (field?: string) => useSessionStore((state) => {
    if (field) {
        return (state.validationErrors[field] || []).length > 0;
    }
    return Object.values(state.validationErrors).some(errors => errors.length > 0);
});

// Tipo para exportar la interfaz del store
export type { SessionStore };
