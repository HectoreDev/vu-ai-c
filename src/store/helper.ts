import { useSessionStore, SessionStore } from './zustandStore';

// Tipos helper para el store
export type SessionData = Pick<SessionStore,
    'sessionId' | 'name' | 'locations' | 'priceMin' | 'priceMax' | 'amenities'
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
            locations: state.locations,
            priceMin: state.priceMin,
            priceMax: state.priceMax,
            amenities: state.amenities,
            communities: state.communities,
            community: state.community,
            lastToolUsed: state.lastToolUsed,
            sessionId: state.sessionId,
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
        };
    }

    /**
     * Actualiza el store desde un objeto SessionState
     */
    static fromSessionState(sessionState: import('../llm/types/gemini.types').SessionState): void {
        const store = useSessionStore.getState();

        store.updateSessionData({
            step: sessionState.step,
            name: sessionState.name,
            locations: sessionState.locations,
            priceMin: sessionState.priceMin,
            priceMax: sessionState.priceMax,
            amenities: sessionState.amenities,
            communities: sessionState.communities,
            community: sessionState.community,
            lastToolUsed: sessionState.lastToolUsed,
            sessionId: sessionState.sessionId,
            mcpSessionId: sessionState.mcpSessionId,

            // Nuevos campos del flujo extendido
            welcome: sessionState.welcome,
            nameSpecs: sessionState.nameSpecs,
            interest: sessionState.interest,
            markets: sessionState.markets,
            budgetProduct: sessionState.budgetProduct,
            budgetType: sessionState.budgetType,
            budget: sessionState.budget,
            customizing: sessionState.customizing,
            moveInReady: sessionState.moveInReady,
            renting: sessionState.renting,
            floorplanSpecs: sessionState.floorplanSpecs,
            homeInterest: sessionState.homeInterest,
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
                return !!(state.name && state.locations && (state.sessionId || state.mcpSessionId));
            case 4: // get-amenities-from-prices
                return !!(state.locations && state.priceMin && state.priceMax);
            case 5: // get-communities
                return !!(state.locations && state.amenities);
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
        if (!state.locations) return 2;

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
        const store = useSessionStore.getState();

        store.reset();

        if (mcpSessionId) {
            store.setMcpSessionId(mcpSessionId);
        }

        store.setStep(0);
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

        if (state.locations) completedData.push(`Ubicación: ${state.locations}`);
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

        // Verificar nuevos campos del flujo extendido
        if (state.welcome) completedData.push(`Bienvenida: ${state.welcome}`);
        if (state.nameSpecs) completedData.push(`Especificaciones de nombre: ${state.nameSpecs}`);
        if (state.interest.length > 0) completedData.push(`Intereses: ${state.interest.join(', ')}`);
        if (state.markets.length > 0) completedData.push(`Mercados: ${state.markets.join(', ')}`);
        if (state.budgetProduct) completedData.push(`Producto presupuestario: ${state.budgetProduct}`);
        if (state.budgetType) completedData.push(`Tipo de presupuesto: ${state.budgetType}`);
        if (state.budget) completedData.push(`Presupuesto: $${state.budget.toLocaleString()}`);
        if (state.customizing) completedData.push(`Personalización: ${state.customizing}`);
        if (state.moveInReady) completedData.push(`Listo para mudanza: ${state.moveInReady}`);
        if (state.renting) completedData.push(`Alquiler: ${state.renting}`);
        if (state.floorplanSpecs) completedData.push(`Especificaciones de plano: ${state.floorplanSpecs}`);
        if (state.homeInterest.length > 0) completedData.push(`Interés en hogar: ${state.homeInterest.join(', ')}`);

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

    /**
     * Obtiene un resumen de los nuevos campos del flujo extendido
     */
    static getExtendedFieldsSummary(): {
        welcome: string | null;
        nameSpecs: string | null;
        interests: string[];
        markets: string[];
        budget: {
            product: string | null;
            type: string | null;
            amount: number | undefined;
        };
        preferences: {
            customizing: string | null;
            moveInReady: string | null;
            renting: string | null;
        };
        homeSpecs: {
            floorplan: string | undefined;
            interests: string[];
        };
    } {
        const state = useSessionStore.getState();

        return {
            welcome: state.welcome,
            nameSpecs: state.nameSpecs,
            interests: state.interest,
            markets: state.markets,
            budget: {
                product: state.budgetProduct,
                type: state.budgetType,
                amount: state.budget,
            },
            preferences: {
                customizing: state.customizing,
                moveInReady: state.moveInReady,
                renting: state.renting,
            },
            homeSpecs: {
                floorplan: state.floorplanSpecs,
                interests: state.homeInterest,
            },
        };
    }

    /**
     * Limpia solo los nuevos campos del flujo extendido
     */
    static resetExtendedFields(): void {
        const store = useSessionStore.getState();

        store.updateSessionData({
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
        });
    }

    /**
     * Valida si hay suficiente información en los nuevos campos
     */
    static validateExtendedFields(): {
        isValid: boolean;
        completedFields: string[];
        missingFields: string[];
    } {
        const state = useSessionStore.getState();
        const completedFields: string[] = [];
        const missingFields: string[] = [];

        // Validar campos opcionales pero importantes
        if (state.welcome) completedFields.push('welcome');
        else missingFields.push('welcome');

        if (state.interest.length > 0) completedFields.push('interest');
        else missingFields.push('interest');

        if (state.markets.length > 0) completedFields.push('markets');
        else missingFields.push('markets');

        if (state.budget) completedFields.push('budget');
        else missingFields.push('budget');

        if (state.homeInterest.length > 0) completedFields.push('homeInterest');
        else missingFields.push('homeInterest');

        return {
            isValid: completedFields.length >= 3, // Al menos 3 campos completados
            completedFields,
            missingFields,
        };
    }
}

// Funciones de utilidad exportadas
export const sessionUtils = {
    // Conversión y compatibilidad
    toSessionState: SessionHelper.toSessionState,
    fromSessionState: SessionHelper.fromSessionState,

    // Validación y flujo
    validateStateForStep: SessionHelper.validateStateForStep,
    getNextValidStep: SessionHelper.getNextValidStep,
    startNewSession: SessionHelper.startNewSession,

    // Resúmenes y análisis
    getFullSummary: SessionHelper.getFullSummary,
    getExtendedFieldsSummary: SessionHelper.getExtendedFieldsSummary,

    // Gestión de campos extendidos
    resetExtendedFields: SessionHelper.resetExtendedFields,
    validateExtendedFields: SessionHelper.validateExtendedFields,
};
