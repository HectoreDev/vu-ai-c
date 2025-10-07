import { BudgetType } from '../types/types';
import { useSessionStore, SessionStore } from './zustandStore';

// Tipos helper para el store
export type SessionData = Pick<SessionStore,
    'sessionId' | 'name' | 'locations' | 'priceMin' | 'priceMax' | 'amenities'
>;

export type SessionFlow = Pick<SessionStore,
    'lastToolUsed' | 'communities' | 'community'
>;

// Interfaz local para SessionState sin step
export interface LocalSessionState {
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
    location?: string;

    // Nuevos campos del flujo extendido
    interest: string[];
    budgetType: string | null;
    budget: BudgetType | null;
    customizing: boolean | null;
    moveInReady: boolean | null;
    renting: string | null;
    homeInterest: string[];
    interestRate?: string;

    // Floorplan specs
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
}

// Funciones helper para conversiones y validaciones
export class SessionHelper {
    /**
     * Convierte el estado del store a formato SessionState compatible
     */
    static toSessionState(): LocalSessionState {
        const state = useSessionStore.getState();

        return {
            // Estados principales
            sessionId: state.sessionId,
            name: state.name,
            locations: state.locations,
            priceMin: state.priceMin,
            priceMax: state.priceMax,
            amenities: state.amenities,

            // Estados adicionales
            communities: state.communities,
            community: state.community,
            lastToolUsed: state.lastToolUsed,
            mcpSessionId: state.mcpSessionId,
            location: state.location,

            // Nuevos campos del flujo extendido 
            interest: state.interest,
            budgetType: state.budgetType,
            budget: state.budget,
            customizing: state.customizing,
            moveInReady: state.moveInReady,
            renting: state.renting,
            homeInterest: state.homeInterest,
            interestRate: state.interestRate,

            // Floorplan specs
            floorplanBed: state.floorplanBed,
            floorplanBath: state.floorplanBath,
            floorplanGarage: state.floorplanGarage,
            floorplanLevel: state.floorplanLevel,
            floorplanSqft: state.floorplanSqft,
        };
    }

    /**
     * Actualiza el store desde un objeto SessionState
     */
    static fromSessionState(sessionState: LocalSessionState): void {
        const store = useSessionStore.getState();

        store.updateSessionData({
            // Estados principales
            sessionId: sessionState.sessionId,
            name: sessionState.name,
            locations: sessionState.locations,
            priceMin: sessionState.priceMin,
            priceMax: sessionState.priceMax,
            amenities: sessionState.amenities,

            // Estados adicionales
            communities: sessionState.communities,
            community: sessionState.community,
            lastToolUsed: sessionState.lastToolUsed,
            mcpSessionId: sessionState.mcpSessionId,
            location: sessionState.location,

            // Nuevos campos del flujo extendido  
            interest: sessionState.interest,
            budgetType: sessionState.budgetType,
            budget: sessionState.budget,
            customizing: sessionState.customizing,
            moveInReady: sessionState.moveInReady,
            renting: sessionState.renting,
            homeInterest: sessionState.homeInterest,
            interestRate: sessionState.interestRate,

            // Floorplan specs
            floorplanBed: sessionState.floorplanBed,
            floorplanBath: sessionState.floorplanBath,
            floorplanGarage: sessionState.floorplanGarage,
            floorplanLevel: sessionState.floorplanLevel,
            floorplanSqft: sessionState.floorplanSqft,
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
    }

    /**
     * Obtiene un resumen completo del estado actual
     */
    static getFullSummary(): {
        isActive: boolean;
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
        if (state.interest.length > 0) completedData.push(`Intereses: ${state.interest.join(', ')}`);
        if (state.budgetType) completedData.push(`Tipo de presupuesto: ${state.budgetType}`);
        if (state.budget) completedData.push(`Presupuesto configurado`);
        if (state.customizing !== null) completedData.push(`Personalización: ${state.customizing ? 'Sí' : 'No'}`);
        if (state.moveInReady !== null) completedData.push(`Listo para mudanza: ${state.moveInReady ? 'Sí' : 'No'}`);
        if (state.renting) completedData.push(`Alquiler: ${state.renting}`);
        if (state.homeInterest.length > 0) completedData.push(`Interés en hogar: ${state.homeInterest.join(', ')}`);
        if (state.interestRate) completedData.push(`Tasa de interés: ${state.interestRate}`);

        // Verificar campos de floorplan
        if (state.floorplanBed.min > 0 || state.floorplanBed.max > 0) {
            completedData.push(`Habitaciones: ${state.floorplanBed.min}-${state.floorplanBed.max}`);
        }
        if (state.floorplanBath.min > 0 || state.floorplanBath.max > 0) {
            completedData.push(`Baños: ${state.floorplanBath.min}-${state.floorplanBath.max}`);
        }
        if (state.floorplanGarage.min > 0 || state.floorplanGarage.max > 0) {
            completedData.push(`Garajes: ${state.floorplanGarage.min}-${state.floorplanGarage.max}`);
        }
        if (state.floorplanLevel.min > 0 || state.floorplanLevel.max > 0) {
            completedData.push(`Niveles: ${state.floorplanLevel.min}-${state.floorplanLevel.max}`);
        }
        if (state.floorplanSqft.min > 0 || state.floorplanSqft.max > 0) {
            completedData.push(`Sqft: ${state.floorplanSqft.min}-${state.floorplanSqft.max}`);
        }

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
            completedData,
            missingData,
            nextAction: nextActions[nextStep] || 'Acción desconocida'
        };
    }

    /**
     * Obtiene un resumen de los nuevos campos del flujo extendido
     */
    static getExtendedFieldsSummary(): {
        interests: string[];
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
        homeInterest: string[];
        budget: {
            type: string | null;
            amount: number | undefined;
        };
        preferences: {
            customizing: boolean | null;
            moveInReady: boolean | null;
            renting: string | null;
        };
        interestRate?: string;
    } {
        const state = useSessionStore.getState();

        return {
            interests: state.interest,
            budget: {
                type: state.budgetType,
                amount: state.budget?.total_budget?.min,
            },
            preferences: {
                customizing: state.customizing,
                moveInReady: state.moveInReady,
                renting: state.renting,
            },
            floorplanBed: state.floorplanBed,
            floorplanBath: state.floorplanBath,
            floorplanGarage: state.floorplanGarage,
            floorplanLevel: state.floorplanLevel,
            floorplanSqft: state.floorplanSqft,
            homeInterest: state.homeInterest,
            interestRate: state.interestRate,
        };
    }

    /**
     * Limpia solo los nuevos campos del flujo extendido
     */
    static resetExtendedFields(): void {
        const store = useSessionStore.getState();

        store.updateSessionData({
            interest: [],
            budgetType: null,
            budget: null,
            customizing: null,
            moveInReady: null,
            renting: null,
            homeInterest: [],
            interestRate: undefined,
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
        if (state.interest.length > 0) completedFields.push('interest');
        else missingFields.push('interest');

        if (state.floorplanBed.min > 0 && state.floorplanBed.max > 0) completedFields.push('floorplanBed');
        else missingFields.push('floorplanBed');

        if (state.floorplanBath.min > 0 && state.floorplanBath.max > 0) completedFields.push('floorplanBath');
        else missingFields.push('floorplanBath');

        if (state.floorplanGarage.min > 0 && state.floorplanGarage.max > 0) completedFields.push('floorplanGarage');
        else missingFields.push('floorplanGarage');

        if (state.floorplanLevel.min > 0 && state.floorplanLevel.max > 0) completedFields.push('floorplanLevel');
        else missingFields.push('floorplanLevel');

        if (state.floorplanSqft.min > 0 && state.floorplanSqft.max > 0) completedFields.push('floorplanSqft');
        else missingFields.push('floorplanSqft');

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
