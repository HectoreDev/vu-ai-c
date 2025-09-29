import { create } from 'zustand';


interface SessionStore {
    // Estados principales
    sessionId?: string;
    name?: string;
    locations?: string[];
    priceMin?: number;
    priceMax?: number;
    amenities?: string;

    step: number;
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
    budget: number | undefined;
    customizing: string | null;
    moveInReady: string | null;
    renting: string | null;
    floorplanSpecs: string | undefined;
    homeInterest: string[];

    // Acciones básicas
    setSessionId: (sessionId: string) => void;
    setName: (name: string) => void;
    setlocations: (locations: string[]) => void;
    setPriceRange: (priceMin: number, priceMax: number) => void;
    setPriceMin: (priceMin: number) => void;
    setPriceMax: (priceMax: number) => void;
    setAmenities: (amenities: string) => void;
    setStep: (step: number) => void;
    setCommunities: (communities: string) => void;
    setCommunity: (community: string) => void;
    setLastToolUsed: (tool: string) => void;
    setMcpSessionId: (mcpSessionId: string) => void;

    // Acciones para nuevos campos
    setWelcome: (welcome: string) => void;
    setNameSpecs: (nameSpecs: string) => void;
    setInterest: (interest: string[]) => void;
    addInterest: (interest: string) => void;
    removeInterest: (interest: string) => void;
    setMarkets: (markets: string[]) => void;
    addMarket: (market: string) => void;
    removeMarket: (market: string) => void;
    setBudgetProduct: (budgetProduct: string) => void;
    setBudgetType: (budgetType: string) => void;
    setBudget: (budget: number) => void;
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
}

// Estado inicial
export const initialState = {
    sessionId: undefined,
    name: undefined,
    locations: undefined,
    step: 0,
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
    budget: undefined,
    customizing: null,
    moveInReady: null,
    renting: null,
    floorplanSpecs: undefined,
    homeInterest: [],
};


// Crear el store sin devtools ni persistencia
export const useSessionStore = create<SessionStore>()((set, get) => ({
    // Estado inicial
    ...initialState,

    // Acciones básicas
    setSessionId: (sessionId: string) => {
        set({ sessionId });
        return get().sessionId
    },

    setName: (name: string) => {
        set({ name });
        return get().name;
    },

    setlocations: (locations: string[]) => {
        set({ locations });
        return get().locations;
    },

    setPriceRange: (priceMin: number, priceMax: number) => {
        set({ priceMin, priceMax });
        return get().priceMin, get().priceMax;
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
        set({ amenities });
        return get().amenities;
    },

    setStep: (step: number) => {
        set({ step });
        return get().step;
    },

    setCommunities: (communities: string) => {
        set({ communities });
        return get().communities;
    },

    setCommunity: (community: string) => {
        set({ community });
        return get().community;
    },

    setLastToolUsed: (lastToolUsed: string) => {
        set({ lastToolUsed });
        return get().lastToolUsed;
    },

    setMcpSessionId: (mcpSessionId: string) => {
        set({ mcpSessionId });
        return get().mcpSessionId;
    },

    // Acciones para nuevos campos
    setWelcome: (welcome: string) => {
        set({ welcome });
        return get().welcome;
    },

    setNameSpecs: (nameSpecs: string) => {
        set({ nameSpecs });
        return get().nameSpecs;
    },

    setInterest: (interest: string[]) => {
        set({ interest });
        return get().interest;
    },

    addInterest: (newInterest: string) => {
        set((state) => ({
            interest: state.interest.includes(newInterest)
                ? state.interest
                : [...state.interest, newInterest]
        }));
        return get().interest;
    },

    removeInterest: (interestToRemove: string) => {
        set((state) => ({
            interest: state.interest.filter(i => i !== interestToRemove)
        }));
        return get().interest;
    },

    setMarkets: (markets: string[]) => {
        set({ markets });
        return get().markets;
    },

    addMarket: (newMarket: string) => {
        set((state) => ({
            markets: state.markets.includes(newMarket)
                ? state.markets
                : [...state.markets, newMarket]
        }));
        return get().markets;
    },

    removeMarket: (marketToRemove: string) => {
        set((state) => ({
            markets: state.markets.filter(m => m !== marketToRemove)
        }));
        return get().markets;
    },

    setBudgetProduct: (budgetProduct: string) => {
        set({ budgetProduct });
        return get().budgetProduct;
    },

    setBudgetType: (budgetType: string) => {
        set({ budgetType });
        return get().budgetType;
    },

    setBudget: (budget: number) => {
        set({ budget });
        return get().budget;
    },

    setCustomizing: (customizing: string) => {
        set({ customizing });
        return get().customizing;
    },

    setMoveInReady: (moveInReady: string) => {
        set({ moveInReady });
        return get().moveInReady;
    },

    setRenting: (renting: string) => {
        set({ renting });
        return get().renting;
    },

    setFloorplanSpecs: (floorplanSpecs: string) => {
        set({ floorplanSpecs });
        return get().floorplanSpecs;
    },

    setHomeInterest: (homeInterest: string[]) => {
        set({ homeInterest });
        return get().homeInterest;
    },

    addHomeInterest: (newHomeInterest: string) => {
        set((state) => ({
            homeInterest: state.homeInterest.includes(newHomeInterest)
                ? state.homeInterest
                : [...state.homeInterest, newHomeInterest]
        }));
        return get().homeInterest;
    },

    removeHomeInterest: (homeInterestToRemove: string) => {
        set((state) => ({
            homeInterest: state.homeInterest.filter(h => h !== homeInterestToRemove)
        }));
        return get().homeInterest;
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
export const useStep = () => useSessionStore((state) => state.step);
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
    setStep: state.setStep,
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

// Tipo para exportar la interfaz del store
export type { SessionStore };
