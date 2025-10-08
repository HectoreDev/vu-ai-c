import { model } from "./gemini.config";
import { mcpServer } from "./mcp.server";
import { Part } from "@google/genai";
import { prompts } from "../prompts/prompts";
import { tools } from "../tools/agent.tools";

interface IFHistory  {
	role: 'user' | 'model';
	parts: Part[];
}

export class GeminiService {

	async chatWithTools(message:string, history: IFHistory[], sessionId?: number) {

		const response1 = await model.sendMessage({
			message: message,
			config: {
				systemInstruction: prompts.systemInstructions,
				tools: [
					{
						functionDeclarations: tools
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
			role: 'user', parts: [{ text: message }]
		});

		// console.log('text response', response1.candidates?.[0]?.content?.parts);
		// console.log('functionCalls', response1.functionCalls);

		const toolsCall = response1.candidates?.[0]?.content?.parts || [];
		// console.log('toolsCall', toolsCall.length);

		if (response1.functionCalls && response1.functionCalls.length > 0) {
			const mcpResult = await mcpServer.callTools(toolsCall);
			// console.log('Resultados de herramientas:', mcpResult);

			const resultMCP = await model.sendMessage({
				message: mcpResult.message,
				config: {
					systemInstruction: mcpResult.systemInstruction
				}
			});

			history.push({
				role: 'model', parts: resultMCP.candidates?.[0]?.content?.parts || []
			});

			// console.log('Respuesta final con datos de MCP:', resultMCP.candidates?.[0]?.content?.parts);

			return {
				history,
				message: resultMCP.candidates?.[0]?.content?.parts || [],
				sessionId: mcpResult.sessionId
			};

		} else {

			history.push({
				role: 'model', parts: response1.candidates?.[0]?.content?.parts ? response1.candidates?.[0]?.content?.parts : [ { text: '' }  ]
			});

			return {
				history,
				message: response1.candidates?.[0]?.content?.parts ? response1.candidates?.[0]?.content?.parts : [ { text: '' }  ],
				sessionId: null
			};
		}

	}

}

export const geminiService = new GeminiService(); 