import { model } from "./gemini.config";
import { mcpServer } from "./mcp.server";
import { invalidateSession } from "./mcp.tools";
import { generalTools } from "../tools/generalTools";
import { SchemaType } from "@google/generative-ai";
import { useSessionStore } from "../store/zustandStore";
import { SessionHelper } from "../store/helper";
import type { SessionState } from "./types/gemini.types";
import { FunctionCallingConfigMode } from "@google/genai";

export class GeminiService {

	async chatWithTools(message: string, sessionId?: number) {

		// const contextPrompt = 'hola, estoy buscando una casa en austin o phoenix, mi nombre es jose, tengo un presupues de 200000 dolares. Me gustaría que tuviera alberca y parques para mascotas';

		// const contextPrompt = 'hola, me podrías dar una receta para hacer un pastel de chocolate?';

		console.log('Generando respuesta contextual con Gemini...2');

		// notes:
		// Añadir al prompt que no puede salir del tema de buscar casa y no le de otras sugerencias.

		const response1 = await model.sendMessage({
			message: message,
			config: {
				systemInstruction: 'Eres un asistente útil que ayuda a los usuarios a encontrar casas basándote en sus necesidades y preferencias. Utiliza las herramientas proporcionadas para obtener información específica como el nombre del usuario, la ubicación, el presupuesto y las amenidades deseadas. Sí el usuario se desvia del tema, recuérdale que estás aquí para ayudarle a encontrar una casa.',
				tools: [
					{
						// @ts-ignore
						functionDeclarations: generalTools.tools
					},
				],
				toolConfig: {
					functionCallingConfig: {
						// Force the model to call the specified function
						// mode: FunctionCallingConfigMode.ANY,
						// Specify the exact tool name to force
						// allowedFunctionNames: generalTools.listTools
					}
				}
			}
		});

		console.log('text response', response1.candidates?.[0]?.content?.parts);
		console.log('functionCalls', response1.functionCalls);

		const toolsCall = response1.candidates?.[0]?.content?.parts || [];
		console.log('toolsCall', toolsCall.length);

		if (response1.functionCalls && response1.functionCalls.length > 0) {
			const mcpResult = await mcpServer.callTools(toolsCall);
			console.log('Resultados de herramientas:', mcpResult);

			const resultMCP = await model.sendMessage({
				message: mcpResult.message,
				config: {
					systemInstruction: mcpResult.systemInstruction
				}
			});

			console.log('Respuesta final con datos de MCP:', resultMCP.candidates?.[0]?.content?.parts);

			return {
				text: resultMCP.candidates?.[0]?.content?.parts,
			};

		} else {
			return {
				text: response1.candidates?.[0]?.content?.parts,
			};
		}

		// return {
		// 	text: '',
		// 	toolsUsed: []
		// };

	}

}

export const geminiService = new GeminiService(); 