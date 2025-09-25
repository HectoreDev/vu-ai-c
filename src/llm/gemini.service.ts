import { model } from "./gemini.config";
import { mcpServer } from "../mcp/mcp.server";
import { invalidateSession } from "../mcp/mcp.tools";
import { generalTools } from "../tools/generalTools";
import { SchemaType } from "@google/generative-ai";
import { useSessionStore } from "../store/zustandStore";
import { SessionHelper } from "../store/helper";
import type { SessionState } from "./types/gemini.types";

export class GeminiService {

	async chatWithTools(message: string, sessionId?: number) {

		const contextPrompt = 'hola, estoy buscando una casa en austin o phoenix, mi nombre es jose, tengo un presupues de 2000 mil dolares, y me gustaría que tuviera alberca y parques para mascotas';

		console.log('Generando respuesta contextual con Gemini...2');
		// @ts-ignore
		const result = await model.generateContent({
			contents: [
				{ role: 'user', parts: [{ text: contextPrompt }] }
			]
		});
		// const enhancedResponse = result.response.text().trim();

		// console.log('Resultados de herramientas:', enhancedResponse);

		// @ts-ignore
		console.log('tools function3', result.response.functionCalls())

		const functionCalls = result.response.functionCalls() ? result.response.functionCalls() : [];

		if (functionCalls && functionCalls.length) {
			const { name, args } = functionCalls[0]
			const mcpResult = await mcpServer.callTool(name, args);
			console.log('Resultados de herramientas:', mcpResult.sessionId);

			const resultMCP = await model.generateContent({
				contents: [
					{ role: 'user', parts: [{ text: mcpResult.text }]  }
				],
				systemInstruction: 'La información es un arreglo JSON en formato string con las comunidades que cumplen los requisitos del usuario. Usa la información para sugerirle al usuario la mejor opción de casa acorde a sus necesidades y preferencias. Si no tienes suficiente información, haz preguntas adicionales para obtener más detalles sobre sus requisitos y gustos.'
			});

			console.log('Respuesta final con datos de MCP:', resultMCP);

			// @ts-ignore
			console.log('text:', resultMCP.response.candidates[0].text);
			// @ts-ignore
			console.log('text:', resultMCP.response.text());

			// @ts-ignore
			return { text: resultMCP.response.candidates[0].text,
				toolsUsed: [name]
			};

		} else {
			console.log('No se detectaron llamadas a herramientas en la respuesta.');
		}

		return {
			text: '',
			toolsUsed: []
		};

	}

}

export const geminiService = new GeminiService(); 