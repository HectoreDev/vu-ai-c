import { model } from "./gemini.config";
import { mcpServer } from "../mcp/mcp.server";
import { invalidateSession } from "../mcp/mcp.tools";
import { generalTools } from "../tools/generalTools";
import { SchemaType } from "@google/generative-ai";
import { useSessionStore } from "../store/zustandStore";
import { SessionHelper } from "../store/helper";
import type { SessionState } from "./types/gemini.types";

export class GeminiService {
	/**
	 * Obtiene el estado actual de la sesión desde el store de Zustand
	 */
	private getSessionState(): SessionState {
		return SessionHelper.toSessionState();
	}

	/**
	 * Actualiza el estado de la sesión en el store de Zustand
	 */
	private updateSessionState(updates: Partial<SessionState>): void {
		const store = useSessionStore.getState();
		store.updateSessionData(updates as any);
		console.log('Estado de sesión actualizado:', this.getSessionState());
	}

	/**
	 * Crea una nueva sesión inicializando el store
	 */
	private createNewSessionState(mcpSessionId?: string): SessionState {
		SessionHelper.startNewSession(mcpSessionId);
		return this.getSessionState();
	}

	async chatWithTools(message: string, sessionId?: number) {

		const contextPrompt = 'hola, estoy buscando una casa en austin o phoenix, mi nombre es jose, tengo un presupues de 2000 mil dolares, y me gustaría que tuviera alberca y parques para mascotas';

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
		console.log('tools function3-3', result.response.candidates[0].functionCalls)

		const functionCalls = result.response.functionCalls() ? result.response.functionCalls() : [];

		if (functionCalls && functionCalls.length) {
			const { name, args } = functionCalls[0]
			const mcpResult = await mcpServer.callTool(name, args);
			console.log('Resultados de herramientas:', mcpResult);
		} else {
			console.log('No se detectaron llamadas a herramientas en la respuesta.');
		}

		console.log('🤖 Respuesta contextual generada:', enhancedResponse);
		return {
			text: enhancedResponse,
			toolsUsed: []
		};

	}

	/**
	 * Limpia el estado de la sesión actual
	 */
	clearSessionState(): void {
		const store = useSessionStore.getState();
		store.reset();
		console.log('Estado de sesión limpiado');
	}

	/**
	 * Obtiene el estado actual de la sesión (método público)
	 */
	getSessionStatePublic(): SessionState {
		return this.getSessionState();
	}

}

export const geminiService = new GeminiService(); 