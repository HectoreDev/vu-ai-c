import { Range } from '../types/types';
import { sessionStore, SessionStore } from './zustandStore';

/**
 * Helper types para acceso a partes específicas del SessionStore
 */

// Tipo para datos básicos de sesión
export type SessionData = Pick<SessionStore,
    'sessionId' | 'name' | 'locations' | 'priceMin' | 'priceMax' | 'amenities'
>;

// Tipo para flujo de sesión
export type SessionFlow = Pick<SessionStore,
    'lastToolUsed' | 'communities' | 'community'
>;

type MaybeBool = boolean | null | undefined;

/**
 * Helper class con utilidades para el SessionStore
 * Nota: La mayoría de la funcionalidad ahora está directamente en el store (zustandStore.ts)
 * Esta clase solo mantiene utilidades complementarias que no están en el store
 */
export class SessionHelper {
    /**
     * Obtiene un snapshot completo del estado actual del store
     */
    static getStateSnapshot() {
        return sessionStore.getState();
    }


    /**
     * Resetea el store y opcionalmente establece un nuevo mcpSessionId
     */
    static startNewSession(mcpSessionId?: string): void {
        const store = sessionStore.getState();
        store.reset();

        if (mcpSessionId) {
            store.setMcpSessionId(mcpSessionId);
        }
    }
}

export const hasRange = (r?: Range | null) => !!r && (r.min ?? 0) > 0 && (r.max ?? 0) > 0;
export const isUnsetBool = (v: MaybeBool) => v === null || v === undefined;
export const hasItems = <T>(a?: T[] | null) => Array.isArray(a) && a.length > 0;
