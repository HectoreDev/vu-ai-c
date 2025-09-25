import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';


interface SessionStore {
    // Estados principales
    sessionId?: string;
    name?: string;
    locations?: string[];
    priceMin?: number;
    priceMax?: number;
    amenities?: string;
    interestHome: string[];

    step: number;
    communities?: string;
    community?: string;
    lastToolUsed?: string;
    mcpSessionId?: string;


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
    setInterestHome: (interestHome: string[]) => void;

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
    priceMin: undefined,
    priceMax: undefined,
    amenities: undefined,
    step: 0,
    communities: undefined,
    community: undefined,
    lastToolUsed: undefined,
    mcpSessionId: undefined,
    interestHome: []
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

                setlocations: (locations: string[]) =>
                    set({ locations }, false, 'setlocations'),

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

                // Acciones de utilidad
                reset: () =>
                    set(initialState, false, 'reset'),

                updateSessionData: (data: Partial<SessionStore>) =>
                    set((state) => ({ ...state, ...data }), false, 'updateSessionData'),

                isSessionActive: () => {
                    const state = get();
                    return !!(state.sessionId || state.mcpSessionId);
                },

                setInterestHome: (interestHome: string[]) => set({
                    interestHome
                }),
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
            }),
            {
                name: 'session-storage', // Nombre para localStorage
                partialize: (state) => ({
                    // Solo persistir estos campos específicos
                    sessionId: state.sessionId,
                    name: state.name,
                    locations: state.locations,
                    priceMin: state.priceMin,
                    priceMax: state.priceMax,
                    amenities: state.amenities,
                    step: state.step,
                    communities: state.communities,
                    community: state.community,
                    mcpSessionId: state.mcpSessionId,
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
export const uselocations = () => useSessionStore((state) => state.locations);
export const usePriceRange = () => useSessionStore((state) => ({
    priceMin: state.priceMin,
    priceMax: state.priceMax
}));
export const useAmenities = () => useSessionStore((state) => state.amenities);
export const useStep = () => useSessionStore((state) => state.step);
export const useMcpSessionId = () => useSessionStore((state) => state.mcpSessionId);

// Hook para obtener todas las acciones
export const useSessionActions = () => useSessionStore((state) => ({
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
