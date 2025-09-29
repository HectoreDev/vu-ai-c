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

		const contextPrompt = 'hola, estoy buscando una casa en austin o phoenix, mi nombre es jose, tengo un presupues de 2000 mil dolares, y me gustaría que tuviera alberca y parques para mascotas';

		console.log('Generando respuesta contextual con Gemini...2');
		// @ts-ignore
		const response1 = await model.sendMessage({
      message: contextPrompt,
      config: {
        tools: [
          {
						// @ts-ignore
            functionDeclarations: generalTools.tools
          },
        ],
        toolConfig: {
          functionCallingConfig: {
            // Force the model to call the specified function
            mode: FunctionCallingConfigMode.ANY,
            // Specify the exact tool name to force
            allowedFunctionNames: generalTools.listTools
          }
        }
      }
    });

		console.log('text response', response1.candidates?.[0]?.content?.parts)

		const toolsCall = response1 && response1.candidates?.[0]?.content?.parts ? response1.candidates?.[0]?.content?.parts : [];

		if (toolsCall.length) {
			const mcpResult = await mcpServer.callTools(toolsCall);
			console.log('Resultados de herramientas:', mcpResult);

			// const resultMCP = await model.sendMessage({
			// 	message: mcpResult,
			// 	config: {
			// 		systemInstruction: 'se te brindara un array de communities, tienes que seleccionar la mejor y describirla al usuario, si no hay ninguna que cumpla sus requisitos, haz preguntas adicionales para obtener más detalles sobre sus requisitos y gustos.'
			// 	}
			// });

			// console.log('Respuesta final con datos de MCP:', resultMCP);

			return {
				text: mcpResult,
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