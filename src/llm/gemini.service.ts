import { model } from "./gemini.config";
import { mcpServer } from "../mcp/mcp.server";
import { invalidateSession } from "../mcp/mcp.tools";
import { generalTools } from "../tools/generalTools";
import { SchemaType } from "@google/generative-ai";


interface SessionState {
	step: number; // 0: session-start, 1: get-name, 2: get-location, 3: get-min-max-prices, 4: get-amenities-from-prices, 5: get-communities, 6: get-community-info, 7: completed
	name?: string;
	location?: string;
	priceMin?: number;
	priceMax?: number;
	amenities?: string;
	communities?: string;
	community?: string;
	lastToolUsed?: string;
	sessionId?: string;
	mcpSessionId?: string; // Token de sesión del sistema MCP
}

export class GeminiService {
	// Storage simple para el estado de las sesiones  
	private sessionStates: Map<string, SessionState> = new Map();

	private getSessionKey(sessionId?: number): string {
		return sessionId ? `session_${sessionId}` : 'default_session';
	}

	private getSessionState(sessionId?: number): SessionState | null {
		const key = this.getSessionKey(sessionId);
		return this.sessionStates.get(key) || null;
	}

	private createNewSessionState(sessionId?: number): SessionState {
		const key = this.getSessionKey(sessionId);
		const newState: SessionState = { step: 0 };
		this.sessionStates.set(key, newState);
		return newState;
	}

	private updateSessionState(sessionId: number | undefined, updates: Partial<SessionState>): void {
		const key = this.getSessionKey(sessionId);
		const currentState = this.getSessionState(sessionId);
		if (currentState) {
			this.sessionStates.set(key, { ...currentState, ...updates });
			console.log('Estado de sesión actualizado:', this.sessionStates.get(key));
		}
	}

	async chatWithTools(message: string, sessionId?: number) {

		const contextPrompt = 'hola, estoy buscando una casa en austin, mi nombre es jose, tengo un presupues de 2000 mil dolares, y me gustaría que tuviera alberca y parques para mascotas';

		console.log('Generando respuesta contextual con Gemini...2');
		// @ts-ignore
		const result = await model.generateContent({
			contents: [
				{ role: 'user', parts: [{ text: contextPrompt }] }
			]
		});
		const enhancedResponse = result.response.text().trim();


		console.log('Resultados de herramientas:', enhancedResponse);

		// @ts-ignore
		console.log('tools function3', result.response.functionCalls())
		// @ts-ignore
		console.log('tools function3-3', result.response.candidates?.length)

		console.log('🤖 Respuesta contextual generada:', enhancedResponse);
		return {
			text: enhancedResponse,
			toolsUsed: []
		};

	}

	// Método para limpiar el estado de una sesión (opcional)
	clearSessionState(sessionId?: number): void {
		const key = this.getSessionKey(sessionId);
		this.sessionStates.delete(key);
		console.log(`Estado de sesión ${key} limpiado`);
	}

	// Método para obtener el estado actual de una sesión (opcional)
	getSessionStatePublic(sessionId?: number): SessionState | null {
		return this.getSessionState(sessionId);
	}

}

export const geminiService = new GeminiService(); 