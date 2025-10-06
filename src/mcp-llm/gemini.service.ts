import { model } from "./gemini.config";
import { mcpServer } from "./mcp.server";
import { invalidateSession } from "./mcp.tools";
import { generalTools } from "../tools/generalTools";
import { SchemaType } from "@google/generative-ai";
import { useSessionStore } from "../store/zustandStore";
import { SessionHelper } from "../store/helper";
import type { SessionState } from "./types/gemini.types";
import { FunctionCallingConfigMode } from "@google/genai";

interface IFHistory  {
	role: 'user' | 'model';
	text: string;
}

export class GeminiService {

	async chatWithTools(message:string, history: IFHistory[], sessionId?: number) {

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

		history.push({
			role: 'user', text: message
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

			history.push({
				role: 'model', text: resultMCP.candidates?.[0]?.content?.parts?.map(part => part.text).join('') || ''
			});

			console.log('Respuesta final con datos de MCP:', resultMCP.candidates?.[0]?.content?.parts);

			return {
				history,
			};

		} else {

			history.push({
				role: 'model', text: response1.candidates?.[0]?.content?.parts?.map(part => part.text).join('') || ''
			});

			return {
				history,
			};
		}

	}

}

export const geminiService = new GeminiService(); 