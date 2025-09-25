import { useSessionStore, SessionStore } from './zustandStore';

// Tipos helper para el store
export type SessionData = Pick<SessionStore,
    'sessionId' | 'name' | 'location' | 'priceMin' | 'priceMax' | 'amenities'
>;

export type SessionFlow = Pick<SessionStore,
    'step' | 'lastToolUsed' | 'communities' | 'community'
>;

// Funciones helper para conversiones y validaciones
export class SessionHelper {
    /**
     * Convierte el estado del store a formato SessionState compatible
     */
    static toSessionState(): import('../llm/types/gemini.types').SessionState {
        const state = useSessionStore.getState();

        return {
            step: state.step,
            name: state.name,
            location: state.location,
            priceMin: state.priceMin,
            priceMax: state.priceMax,
            amenities: state.amenities,
            communities: state.communities,
            community: state.community,
            lastToolUsed: state.lastToolUsed,
            sessionId: state.sessionId,
            mcpSessionId: state.mcpSessionId,
        };
    }

    /**
     * Actualiza el store desde un objeto SessionState
     */
    static fromSessionState(sessionState: import('../llm/types/gemini.types').SessionState): void {
        const { updateSessionData } = useSessionStore.getState();

        updateSessionData({
            step: sessionState.step,
            name: sessionState.name,
            location: sessionState.location,
            priceMin: sessionState.priceMin,
            priceMax: sessionState.priceMax,
            amenities: sessionState.amenities,
            communities: sessionState.communities,
            community: sessionState.community,
            lastToolUsed: sessionState.lastToolUsed,
            sessionId: sessionState.sessionId,
            mcpSessionId: sessionState.mcpSessionId,
        });
    }

    /**
     * Valida si el estado actual es válido para un paso específico
     */
    static validateStateForStep(step: number): boolean {
        const state = useSessionStore.getState();

        switch (step) {
            case 0: // session-start
                return true;
            case 1: // get-name
                return !!(state.sessionId || state.mcpSessionId);
            case 2: // get-location
                return !!(state.name && (state.sessionId || state.mcpSessionId));
            case 3: // get-min-max-prices
                return !!(state.name && state.location && (state.sessionId || state.mcpSessionId));
            case 4: // get-amenities-from-prices
                return !!(state.location && state.priceMin && state.priceMax);
            case 5: // get-communities
                return !!(state.location && state.amenities);
            case 6: // get-community-info
                return !!(state.communities);
            case 7: // completed
                return true;
            default:
                return false;
        }
    }

    /**
     * Obtiene el siguiente paso válido basado en el estado actual
     */
    static getNextValidStep(): number {
        const state = useSessionStore.getState();

        // Si no hay sessionId, necesitamos empezar
        if (!state.sessionId && !state.mcpSessionId) return 0;

        // Si no hay nombre, lo necesitamos
        if (!state.name) return 1;

        // Si no hay ubicación, la necesitamos
        if (!state.location) return 2;

        // Si no tenemos precios, los buscamos
        if (!state.priceMin || !state.priceMax) return 3;

        // Si no tenemos amenidades, las buscamos
        if (!state.amenities) return 4;

        // Si no tenemos comunidades, las buscamos
        if (!state.communities) return 5;

        // Si llegamos aquí, podemos buscar info específica de comunidades
        return 6;
    }

    /**
     * Resetea el store y prepara para una nueva sesión
     */
    static startNewSession(mcpSessionId?: string): void {
        const { reset, setMcpSessionId, setStep } = useSessionStore.getState();

        reset();

        if (mcpSessionId) {
            setMcpSessionId(mcpSessionId);
        }

        setStep(0);
    }

    /**
     * Obtiene un resumen completo del estado actual
     */
    static getFullSummary(): {
        isActive: boolean;
        currentStep: number;
        completedData: string[];
        missingData: string[];
        nextAction: string;
    } {
        const state = useSessionStore.getState();
        const completedData: string[] = [];
        const missingData: string[] = [];

        // Verificar datos completados
        if (state.sessionId || state.mcpSessionId) completedData.push('Sesión iniciada');
        else missingData.push('Sesión');

        if (state.name) completedData.push(`Nombre: ${state.name}`);
        else missingData.push('Nombre');

        if (state.location) completedData.push(`Ubicación: ${state.location}`);
        else missingData.push('Ubicación');

        if (state.priceMin && state.priceMax) {
            completedData.push(`Precios: $${state.priceMin.toLocaleString()} - $${state.priceMax.toLocaleString()}`);
        } else {
            missingData.push('Rango de precios');
        }

        if (state.amenities) completedData.push(`Amenidades: ${state.amenities}`);
        else missingData.push('Amenidades');

        if (state.communities) completedData.push('Comunidades encontradas');
        else missingData.push('Comunidades');

        // Determinar siguiente acción
        const nextStep = this.getNextValidStep();
        const nextActions = [
            'Inicializar sesión',
            'Obtener nombre',
            'Obtener ubicación',
            'Buscar precios',
            'Buscar amenidades',
            'Buscar comunidades',
            'Información de comunidades',
            'Flujo completado'
        ];

        return {
            isActive: state.isSessionActive(),
            currentStep: state.step,
            completedData,
            missingData,
            nextAction: nextActions[nextStep] || 'Acción desconocida'
        };
    }
}

// Funciones de utilidad exportadas
export const sessionUtils = {
    toSessionState: SessionHelper.toSessionState,
    fromSessionState: SessionHelper.fromSessionState,
    validateStateForStep: SessionHelper.validateStateForStep,
    getNextValidStep: SessionHelper.getNextValidStep,
    startNewSession: SessionHelper.startNewSession,
    getFullSummary: SessionHelper.getFullSummary,
};
