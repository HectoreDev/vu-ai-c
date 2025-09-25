import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';


interface SessionStore {
    // Estados principales
    sessionId?: string;
    name?: string;
    location?: string;
    step: number;

    // Estados adicionales
    priceMin?: number;
    priceMax?: number;
    amenities?: string;
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
    setLocation: (location: string) => void;
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
const initialState = {
    sessionId: undefined,
    name: undefined,
    location: undefined,
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


export const useSessionStore = create<SessionStore>()(
    devtools(
        persist(
            (set, get) => ({
                // Estado inicial
                ...initialState,

                // Acciones básicas
                setSessionId: (sessionId: string) =>
                    set({ sessionId }, false, 'setSessionId'),

                setName: (name: string) =>
                    set({ name }, false, 'setName'),

                setLocation: (location: string) =>
                    set({ location }, false, 'setLocation'),

                setPriceRange: (priceMin: number, priceMax: number) =>
                    set({ priceMin, priceMax }, false, 'setPriceRange'),

                setPriceMin: (priceMin: number) =>
                    set({ priceMin }, false, 'setPriceMin'),

                setPriceMax: (priceMax: number) =>
                    set({ priceMax }, false, 'setPriceMax'),

                setAmenities: (amenities: string) =>
                    set({ amenities }, false, 'setAmenities'),

                setStep: (step: number) =>
                    set({ step }, false, 'setStep'),

                setCommunities: (communities: string) =>
                    set({ communities }, false, 'setCommunities'),

                setCommunity: (community: string) =>
                    set({ community }, false, 'setCommunity'),

                setLastToolUsed: (lastToolUsed: string) =>
                    set({ lastToolUsed }, false, 'setLastToolUsed'),

                setMcpSessionId: (mcpSessionId: string) =>
                    set({ mcpSessionId }, false, 'setMcpSessionId'),

                // Acciones para nuevos campos
                setWelcome: (welcome: string) =>
                    set({ welcome }, false, 'setWelcome'),

                setNameSpecs: (nameSpecs: string) =>
                    set({ nameSpecs }, false, 'setNameSpecs'),

                setInterest: (interest: string[]) =>
                    set({ interest }, false, 'setInterest'),

                addInterest: (newInterest: string) =>
                    set((state) => ({
                        interest: state.interest.includes(newInterest)
                            ? state.interest
                            : [...state.interest, newInterest]
                    }), false, 'addInterest'),

                removeInterest: (interestToRemove: string) =>
                    set((state) => ({
                        interest: state.interest.filter(i => i !== interestToRemove)
                    }), false, 'removeInterest'),

                setMarkets: (markets: string[]) =>
                    set({ markets }, false, 'setMarkets'),

                addMarket: (newMarket: string) =>
                    set((state) => ({
                        markets: state.markets.includes(newMarket)
                            ? state.markets
                            : [...state.markets, newMarket]
                    }), false, 'addMarket'),

                removeMarket: (marketToRemove: string) =>
                    set((state) => ({
                        markets: state.markets.filter(m => m !== marketToRemove)
                    }), false, 'removeMarket'),

                setBudgetProduct: (budgetProduct: string) =>
                    set({ budgetProduct }, false, 'setBudgetProduct'),

                setBudgetType: (budgetType: string) =>
                    set({ budgetType }, false, 'setBudgetType'),

                setBudget: (budget: number) =>
                    set({ budget }, false, 'setBudget'),

                setCustomizing: (customizing: string) =>
                    set({ customizing }, false, 'setCustomizing'),

                setMoveInReady: (moveInReady: string) =>
                    set({ moveInReady }, false, 'setMoveInReady'),

                setRenting: (renting: string) =>
                    set({ renting }, false, 'setRenting'),

                setFloorplanSpecs: (floorplanSpecs: string) =>
                    set({ floorplanSpecs }, false, 'setFloorplanSpecs'),

                setHomeInterest: (homeInterest: string[]) =>
                    set({ homeInterest }, false, 'setHomeInterest'),

                addHomeInterest: (newHomeInterest: string) =>
                    set((state) => ({
                        homeInterest: state.homeInterest.includes(newHomeInterest)
                            ? state.homeInterest
                            : [...state.homeInterest, newHomeInterest]
                    }), false, 'addHomeInterest'),

                removeHomeInterest: (homeInterestToRemove: string) =>
                    set((state) => ({
                        homeInterest: state.homeInterest.filter(h => h !== homeInterestToRemove)
                    }), false, 'removeHomeInterest'),

                // Acciones de utilidad
                reset: () =>
                    set(initialState, false, 'reset'),

                updateSessionData: (data: Partial<SessionStore>) =>
                    set((state) => ({ ...state, ...data }), false, 'updateSessionData'),

                isSessionActive: () => {
                    const state = get();
                    return !!(state.sessionId || state.mcpSessionId);
                },

                getSessionSummary: () => {
                    const state = get();
                    const summary = [];

                    if (state.name) summary.push(`Nombre: ${state.name}`);
                    if (state.location) summary.push(`Ubicación: ${state.location}`);
                    if (state.priceMin && state.priceMax) {
                        summary.push(`Rango de precios: $${state.priceMin.toLocaleString()} - $${state.priceMax.toLocaleString()}`);
                    }
                    if (state.amenities) summary.push(`Amenidades: ${state.amenities}`);
                    if (state.communities) summary.push(`Comunidades encontradas: Sí`);
                    if (state.community) summary.push(`Comunidad seleccionada: ${state.community}`);

                    return summary.length > 0 ? summary.join(' | ') : 'Sin datos de sesión';
                },
            }),
            {
                name: 'session-storage', // Nombre para localStorage
                partialize: (state) => ({
                    // Campos principales
                    sessionId: state.sessionId,
                    name: state.name,
                    location: state.location,
                    step: state.step,
                    priceMin: state.priceMin,
                    priceMax: state.priceMax,
                    amenities: state.amenities,
                    communities: state.communities,
                    community: state.community,
                    mcpSessionId: state.mcpSessionId,

                    // Nuevos campos del flujo extendido
                    welcome: state.welcome,
                    nameSpecs: state.nameSpecs,
                    interest: state.interest,
                    markets: state.markets,
                    budgetProduct: state.budgetProduct,
                    budgetType: state.budgetType,
                    budget: state.budget,
                    customizing: state.customizing,
                    moveInReady: state.moveInReady,
                    renting: state.renting,
                    floorplanSpecs: state.floorplanSpecs,
                    homeInterest: state.homeInterest,
                }),
            }
        ),
        {
            name: 'session-store', // Nombre para DevTools
        }
    )
);

// Hooks de utilidad para acceso rápido a partes específicas del estado
export const useSessionId = () => useSessionStore((state) => state.sessionId);
export const useName = () => useSessionStore((state) => state.name);
export const useLocation = () => useSessionStore((state) => state.location);
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
    setLocation: state.setLocation,
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
